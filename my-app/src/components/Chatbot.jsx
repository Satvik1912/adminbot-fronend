
// Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaTimes, FaSearch, FaPlus, FaChartBar, FaFileExcel, FaBars } from "react-icons/fa";
import { generateChatTitle, formatTimestamp } from "./chatbot-utils.js";
import "./Chatbot.css";
import axios from "axios"; 

const Chatbot = () => {
  // Main states
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [messages, setMessages] = useState([{
    text: "Hello! How can I assist you with loans query today?",
    sender: "bot",
    isInitial: true,
    timestamp: new Date().toISOString()
  }]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentChatId, setCurrentChatId] = useState(`chat_${Date.now()}`);
  const [chatHistory, setChatHistory] = useState({});
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [funFactIndex, setFunFactIndex] = useState(0);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // Fun facts about loans, banking, and NBFCs
  const funFacts = [
    "The word 'bank' is derived from the Italian word 'banca', which means bench.",
    "The world's oldest bank still in operation is Monte dei Paschi di Siena in Italy, founded in 1472.",
    "NBFCs in India manage assets worth over $450 billion.",
    "The first credit card was introduced in 1950 called the Diners Club card.",
    "The average mortgage loan term worldwide is between 25-30 years.",
    "The concept of interest dates back to ancient Mesopotamia, around 3000 BCE.",
    "Microlending has helped over 200 million people globally escape extreme poverty.",
    "NBFCs typically serve customer segments not covered by traditional banks.",
    "The RBI classifies NBFCs into 11 different categories based on their activities.",
    "Personal loans were first introduced in the United States in the 1920s.",
    "The global microfinance market is expected to reach $304 billion by 2026.",
    "Auto loans are the third largest category of household debt after mortgages and student loans."
  ];
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check authentication status on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Initialize on first load
  useEffect(() => {
    // Load chat history from localStorage
    try {
      const savedChats = localStorage.getItem('loanveChatHistory');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChatHistory(parsedChats);
        
        // Create initial chat if there's no history
        if (Object.keys(parsedChats).length === 0) {
          createNewChat();
        } else {
          // Set the current chat to the most recent one
          const mostRecentChatId = Object.keys(parsedChats)[0];
          setCurrentChatId(mostRecentChatId);
          setMessages(parsedChats[mostRecentChatId].messages || []);
          setCurrentThreadId(parsedChats[mostRecentChatId].threadId || null);
        }
      } else {
        createNewChat();
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      createNewChat();
    }
    
    // Register the service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

  // Save chat history whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('loanveChatHistory', JSON.stringify(chatHistory));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }, [chatHistory]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Rotate fun facts during loading
  useEffect(() => {
    let interval;
    if (isWaitingForResponse) {
      interval = setInterval(() => {
        setFunFactIndex(prev => (prev + 1) % funFacts.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isWaitingForResponse]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Create a new chat
  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const initialMessage = {
      text: "Hello! How can I assist you with loan management today?",
      sender: "bot",
      isInitial: true,
      timestamp: new Date().toISOString()
    };
    
    // Update messages state for the UI
    setMessages([initialMessage]);
    
    // Update chat history with the new chat
    setChatHistory(prev => ({
      [newChatId]: {
        title: "New Chat",
        messages: [initialMessage],
        createdAt: new Date().toISOString(),
        threadId: null
      },
      ...prev // Keep previous chats
    }));
    
    // Set current chat ID and reset thread ID
    setCurrentChatId(newChatId);
    setCurrentThreadId(null);
    
    // Reset other states
    setInput("");
    setIsWaitingForResponse(false);
    
    // Close sidebar on mobile if open
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
    
    // Focus on input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Load an existing chat
  const loadChat = (chatId) => {
    if (chatHistory[chatId]) {
      setCurrentChatId(chatId);
      setMessages(chatHistory[chatId].messages || []);
      setCurrentThreadId(chatHistory[chatId].threadId || null);
      
      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
      
      // Reset other states
      setInput("");
      setIsWaitingForResponse(false);
    }
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!isAuthenticated) {
      // Show authentication error message
      const authErrorMessage = {
        text: "Authentication required. Please log in to continue.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, authErrorMessage]);
      return;
    }

    if (input.trim() && !isWaitingForResponse) {
      const userMessage = {
        text: input.trim(),
        sender: "user",
        timestamp: new Date().toISOString()
      };
      
      // Update messages for UI
      setMessages(prev => [...prev, userMessage]);
      
      // Clear input and set waiting state
      setInput("");
      setIsWaitingForResponse(true);
      
      // Update chat history
      setChatHistory(prev => {
        const currentChat = prev[currentChatId] || { messages: [] };
        const isFirstUserMessage = currentChat.messages.filter(m => m.sender === "user").length === 0;
        
        return {
          ...prev,
          [currentChatId]: {
            ...currentChat,
            title: isFirstUserMessage ? generateChatTitle(userMessage.text) : currentChat.title,
            messages: [...currentChat.messages, userMessage],
            threadId: currentThreadId
          }
        };
      });

      try {
        // Call the API with the user input
        const requestBody = {
          user_input: userMessage.text
        };
        
        // Add thread_id if it exists
        if (currentThreadId) {
          requestBody.thread_id = currentThreadId;
        }
      
        const response = await axios.post('http://127.0.0.1:8000/generate-response/', requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      
        // Extract data from API response
        const { 
          results, 
          message,
          thread_id, 
          chart_type, 
          chart_image_url, 
          conversation_id 
        } = response.data;
      
        // Update thread ID if this is a new thread
        if (thread_id && thread_id !== currentThreadId) {
          setCurrentThreadId(thread_id);
        }
      
        // Create bot response with the results from API
        const botResponse = {
          text: message || results, // Use the results field directly
          sender: "bot",
          timestamp: new Date().toISOString(),
          chartType: chart_type,
          chartImageUrl: chart_image_url,
          conversationId: conversation_id
        };
        
        // Update messages for UI
        setMessages(prev => [...prev, botResponse]);
        
        // Update chat history with bot response and thread_id
        setChatHistory(prev => {
          const currentChat = prev[currentChatId];
          
          return {
            ...prev,
            [currentChatId]: {
              ...currentChat,
              messages: [...currentChat.messages, botResponse],
              threadId: thread_id || currentThreadId
            }
          };
        });
      } catch (error) {
        console.error("Error sending message to API:", error);
        
        let errorMessage = "Sorry, I encountered an error processing your request. Please try again later.";
        
        // Check for authentication errors
        if (error.response && error.response.status === 401) {
          errorMessage = "Your session has expired. Please log in again.";
          // Clear authentication token
          localStorage.removeItem('token');
          setAuthToken(null);
          setIsAuthenticated(false);
        }
        
        // Handle error with a message to the user
        const errorResponse = {
          text: errorMessage,
          sender: "bot",
          timestamp: new Date().toISOString(),
          isError: true
        };
        
        setMessages(prev => [...prev, errorResponse]);
        setChatHistory(prev => {
          const currentChat = prev[currentChatId];
          return {
            ...prev,
            [currentChatId]: {
              ...currentChat,
              messages: [...currentChat.messages, errorResponse]
            }
          };
        });
      } finally {
        // Reset waiting state
        setIsWaitingForResponse(false);
      }
    }
  };

  // Handle key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isWaitingForResponse) {
        handleSend();
      }
    }
  };

  // Filter chats based on search query
  const filteredChats = Object.entries(chatHistory).filter(([id, chat]) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Search in title
    if (chat.title.toLowerCase().includes(query)) return true;
    
    // Search in chat messages
    return chat.messages.some(msg => msg.text.toLowerCase().includes(query));
  });

  // Handle chart display
  const handleDisplayChart = (chartImageUrl) => {
    if (chartImageUrl) {
      window.open(chartImageUrl, '_blank');
    } else {
      alert("No chart available for this message");
    }
  };

  // Handle Excel download
  const handleDownloadExcel = (conversationId) => {
    if (!conversationId) {
      alert("No data available for download");
      return;
    }
    
    if (!isAuthenticated) {
      alert("Authentication required. Please log in.");
      return;
    }
    
    // Using Fetch API for authenticated download
    fetch(`http://127.0.0.1:8000/download-excel/${conversationId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          // Handle authentication error
          localStorage.removeItem('token');
          setAuthToken(null);
          setIsAuthenticated(false);
          throw new Error('Authentication failed');
        }
        throw new Error('Download failed');
      }
      return response.blob();
    })
    .then(blob => {
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `conversation_${conversationId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch(error => {
      console.error("Download error:", error);
      alert("Failed to download the file: " + error.message);
    });
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Login helper function (this would typically be part of a login component)
  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  // Logout helper function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  return (
    <>
      {/* Chat button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ${isOpen ? 'opacity-0 z-0' : 'opacity-100 z-50'}`}
        aria-label="Open chat"
      >
        <FaRobot className="text-xl" />
      </button>

      {/* Chat window */}
      <div className={`fixed bottom-5 right-5 chat-window transition-all duration-300 transform ${isOpen ? 'scale-100 z-50' : 'scale-0 z-0'}`}>
        <div className="chat-container">
          {/* Sidebar */}
          <aside className={`chat-sidebar ${isSidebarOpen ? 'active' : ''}`}>
            <div className="search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Search chats" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <button className="new-chat-btn" onClick={createNewChat}>
              <FaPlus className="mr-2" /> New Chat
            </button>
            
            {/* Authentication status indicator */}
            <div className="auth-status">
              {isAuthenticated ? (
                <div className="flex justify-between items-center px-4 py-2 bg-green-50 text-green-800 text-sm">
                  <span>Authenticated</span>
                  <button 
                    onClick={handleLogout}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 bg-red-50 text-red-800 text-sm">
                  Not authenticated. Please log in.
                </div>
              )}
            </div>
            
            <div className="chat-history-list">
              {filteredChats.length > 0 ? (
                filteredChats.map(([chatId, chat]) => (
                  <div 
                    key={chatId}
                    className={`chat-history-item ${currentChatId === chatId ? 'active' : ''}`}
                    onClick={() => loadChat(chatId)}
                  >
                    <div className="chat-history-title">{chat.title}</div>
                    <div className="chat-history-date">{formatTimestamp(chat.createdAt)}</div>
                  </div>
                ))
              ) : (
                <div className="no-results">No chats found</div>
              )}
            </div>
          </aside>
          
          {/* Main chat area */}
          <main className="chat-main">
            {/* Header */}
            <div className="chat-header">
              <div className="flex items-center">
                <button 
                  className="sidebar-toggle"
                  onClick={toggleSidebar}
                  aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                  <FaBars />
                </button>
                <div className="chat-title">Loan Assistant</div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="close-button"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Authentication warning banner */}
            {!isAuthenticated && (
              <div className="auth-warning-banner">
                
                {/* This would typically be replaced with a login form or link */}
                <button 
                  className="login-button"
                  onClick={() => {
                    // This is a placeholder. In a real app, you'd show a login form
                    const mockToken = prompt("Enter mock token for testing:");
                    if (mockToken) handleLogin(mockToken);
                  }}
                >
                 
                </button>
              </div>
            )}
            
            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message-wrapper ${msg.sender === "user" ? "user-message-wrapper" : "bot-message-wrapper"}`}>
                 <div className={`message ${msg.sender === "user" ? "user-message" : "bot-message"} ${msg.isError ? "error-message" : ""}`}>
                   {msg.text}
                   
                   {/* Action buttons for bot messages (excluding initial message) */}
                   {msg.sender === "bot" && !msg.isInitial && !msg.isError && msg.conversationId && (
                     <div className="message-actions">
                       {msg.chartType && msg.chartImageUrl && (
                         <button 
                           className="action-button display-chart"
                           onClick={() => handleDisplayChart(msg.chartImageUrl)}
                           aria-label="Display chart"
                         >
                           <FaChartBar className="mr-1" /> Display Chart
                         </button>
                       )}
                       <button 
                         className="action-button download-excel"
                         onClick={() => handleDownloadExcel(msg.conversationId)}
                         aria-label="Download Excel"
                       >
                         <FaFileExcel className="mr-1" /> Download Excel
                       </button>
                     </div>
                   )}
                 </div>
                 <div className="message-timestamp">
                   {formatTimestamp(msg.timestamp)}
                 </div>
               </div>
             ))}
             
             {/* Loading indicator with fun facts */}
             {isWaitingForResponse && (
               <div className="message-wrapper bot-message-wrapper">
                 <div className="message bot-message">
                   <div className="typing-indicator">
                     <span></span>
                     <span></span>
                     <span></span>
                   </div>
                   <div className="fun-fact">
                     <p><strong>Did you know?</strong> {funFacts[funFactIndex]}</p>
                   </div>
                 </div>
               </div>
             )}
             
             <div ref={messagesEndRef} />
           </div>
           
           {/* Input area */}
           <div className="chat-input-area">
             <input 
               type="text" 
               ref={inputRef}
               className="chat-input" 
               value={input} 
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={handleKeyPress}
               placeholder={isAuthenticated ? "Type a message..." : "Please log in to chat"}
               disabled={isWaitingForResponse || !isAuthenticated}
             />
             <button 
               onClick={isWaitingForResponse || !isAuthenticated ? null : handleSend} 
               className={`send-button ${isWaitingForResponse ? 'loading' : (!isAuthenticated || !input.trim() ? 'disabled' : '')}`}
               disabled={!input.trim() || isWaitingForResponse || !isAuthenticated}
               aria-label="Send message"
             >
               {isWaitingForResponse ? (
                 <div className="button-loader"></div>
               ) : (
                 <FaPaperPlane />
               )}
             </button>
           </div>
         </main>
       </div>
     </div>
   </>
 );
 };
 
 export default Chatbot;
