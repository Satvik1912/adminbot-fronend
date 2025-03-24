import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaRobot, FaPaperPlane, FaTimes, FaSearch, FaPlus, FaChartBar, FaFileExcel, FaBars } from "react-icons/fa";
import { generateChatTitle, formatTimestamp } from "./chatbot-utils.js";
import "./Chatbot.css";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
    // Main states
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentChatId, setCurrentChatId] = useState(null);
    const [chatHistory, setChatHistory] = useState({});
    const [currentThreadId, setCurrentThreadId] = useState(null);
    const [funFactIndex, setFunFactIndex] = useState(0);
    const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [threadPage, setThreadPage] = useState(1);
    const [totalThreadPages, setTotalThreadPages] = useState(1);
    const [isLoadingThreads, setIsLoadingThreads] = useState(false);
    const [conversationPage, setConversationPage] = useState(1);
    const [totalConversationPages, setTotalConversationPages] = useState(1);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const [chatHistoryLoaded, setChatHistoryLoaded] = useState(false);

    // New states for the dropdown functionality
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [answerType, setAnswerType] = useState("excel"); // Default to excel
    const [cursorPosition, setCursorPosition] = useState(0);

    const THREAD_LIMIT = 10;
    const CONVERSATION_LIMIT = 10;

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
    const sidebarRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const typeDropdownRef = useRef(null);
    const [threadScrollPosition, setThreadScrollPosition] = useState(0); // Store thread scroll position

    // Debounce Function
    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Check authentication status on load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
            fetchThreadHistory();
        } else {
            setIsAuthenticated(false);
            setMessages([{
                text: "Hello! How can I assist you with loans query today? Please login to see previous conversations.",
                sender: "bot",
                isInitial: true
            }]);
        }
    }, []);

    // Handle input changes including @ trigger
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        const position = e.target.selectionStart;
        setCursorPosition(position);

        if (value[position - 1] === '@') {
            setShowTypeDropdown(true);
        } else if (showTypeDropdown) {
            const nearText = value.substring(Math.max(0, position - 2), position);
            if (!nearText.includes('@')) {
                setShowTypeDropdown(false);
            }
        }


    };

    // Handle dropdown option selection
    const handleTypeSelect = (type) => {
        const beforeCursor = input.substring(0, cursorPosition - 1);
        const afterCursor = input.substring(cursorPosition);

        const displayType = type.charAt(0).toUpperCase() + type.slice(1);
        setInput(`${beforeCursor}@${displayType} ${afterCursor}`);

        setAnswerType(type);

        setShowTypeDropdown(false);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const newPosition = beforeCursor.length + displayType.length + 2;
                inputRef.current.setSelectionRange(newPosition, newPosition);
            }
        }, 0);


    };

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target) &&
                event.target !== inputRef.current) {
                setShowTypeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);

    // Use a ref to track if a fetch is in progress
    const isFetchingThreads = useRef(false);

    // Fetch thread history - useCallback for performance optimization
    const fetchThreadHistory = useCallback(async (page = 1, resetHistory = true) => {
        if (!isAuthenticated || isFetchingThreads.current) return;

        isFetchingThreads.current = true;
        setIsLoadingThreads(true);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/threads?page=${page}&limit=${THREAD_LIMIT}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (response.data && response.data.threads) {
                const { threads, total_pages, total_threads } = response.data.threads;

                const sortedThreads = threads.sort((a, b) =>
                    new Date(b.start_timestamp) - new Date(a.start_timestamp)
                );

                const threadsObj = {};
                sortedThreads.forEach(thread => {
                    threadsObj[thread.thread_id] = {
                        title: thread.chat_name,
                        messages: [],
                        createdAt: thread.start_timestamp,
                        threadId: thread.thread_id
                    };
                });

                setTotalThreadPages(total_pages);

                setChatHistory(prev => {
                    const updatedHistory = resetHistory ? threadsObj : { ...prev, ...threadsObj };
                    return updatedHistory;
                });

                setChatHistoryLoaded(true);
                setThreadPage(page);  // Ensure threadPage is updated AFTER setting data
            }
        } catch (error) {
            console.error("Error fetching thread history:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setAuthToken(null);
                setIsAuthenticated(false);
            }
        } finally {
            setIsLoadingThreads(false);
            isFetchingThreads.current = false;
        }

    }, [authToken, isAuthenticated]);

    // Fetch more threads when scrolling
    const fetchMoreThreads = useCallback(() => {
        if (!isLoadingThreads && threadPage < totalThreadPages) {
            fetchThreadHistory(threadPage + 1, false);
        }
    }, [isLoadingThreads, threadPage, totalThreadPages, fetchThreadHistory]);


    // Use a ref to track if a fetch is in progress
    const isFetchingConversations = useRef(false);

    // Fetch conversations for a specific thread
    const fetchThreadConversations = useCallback(async (threadId, page = 1, resetMessages = true) => {
        if (!isAuthenticated || !threadId || isFetchingConversations.current) return;

        isFetchingConversations.current = true;
        setIsLoadingConversations(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/threads?thread_id=${threadId}&page=${page}&limit=${CONVERSATION_LIMIT}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.data && response.data.conversations) {
                const { conversations, total_pages, total_conversations } = response.data;

                setTotalConversationPages(total_pages);
                setConversationPage(page);

                const sortedConversations = [...conversations].sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                });

                const parseMarkdown = (text) => {
                    if (!text) return '';
                    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                };

                const formattedMessages = sortedConversations.map(conv => [
                    {
                        text: conv.query,
                        sender: "user",
                        timestamp: conv.timestamp
                    },
                    {
                        text: parseMarkdown(conv.response),
                        sender: "bot",
                        timestamp: conv.timestamp,
                        conversationId: conv.conversation_id,
                        excelPath: conv.excel_path,
                        parsedHtml: true
                    }
                ]).flat();

                setMessages(prevMessages => {
                    const newMessages = resetMessages
                        ? [{
                            text: "Hello! How can I assist you with loans query today?",
                            sender: "bot",
                            isInitial: true,

                        }, ...formattedMessages]
                        : [...formattedMessages, ...prevMessages];
                    return newMessages;
                });

                setCurrentThreadId(threadId);
                setCurrentChatId(threadId);

                setChatHistory(prev => ({
                    ...prev,
                    [threadId]: {
                        ...prev[threadId],
                        messages: formattedMessages,
                        threadId: threadId
                    }
                }));
            }
        } catch (error) {
            console.error("Error fetching thread conversations:", error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                setAuthToken(null);
                setIsAuthenticated(false);
            }
        } finally {
            setIsLoadingConversations(false);
            isFetchingConversations.current = false;
        }

    }, [authToken, isAuthenticated]);

    // Fetch more conversations when scrolling
    const fetchMoreConversations = useCallback(() => {
        if (!isLoadingConversations && conversationPage < totalConversationPages && currentThreadId) {
            fetchThreadConversations(currentThreadId, conversationPage + 1, false);
        }
    }, [isLoadingConversations, conversationPage, totalConversationPages, currentThreadId, fetchThreadConversations]);

    // useEffect for sidebar scroll
    useEffect(() => {
        const handleSidebarScroll = () => {
            if (!sidebarRef.current || isLoadingThreads) return;

            const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                fetchMoreThreads();
            }
        };

        const sidebarElement = sidebarRef.current;
        if (sidebarElement) {
            sidebarElement.addEventListener('scroll', handleSidebarScroll);
        }

        return () => {
            if (sidebarElement) {
                sidebarElement.removeEventListener('scroll', handleSidebarScroll);
                setThreadScrollPosition(sidebarElement.scrollTop);
            }
        };

    }, [threadPage, totalThreadPages, isLoadingThreads, fetchMoreThreads]);

    // useEffect for message scroll
    useEffect(() => {
        const handleMessagesScroll = () => {
            if (!chatMessagesRef.current || isLoadingConversations) return;

            const { scrollTop } = chatMessagesRef.current;
            if (scrollTop <= 100) {
                fetchMoreConversations();
            }
        };

        const messagesElement = chatMessagesRef.current;

        if (messagesElement) {
            messagesElement.addEventListener('scroll', handleMessagesScroll);
        }

        return () => {
            if (messagesElement) {
                messagesElement.removeEventListener('scroll', handleMessagesScroll);
            }
        };

    }, [conversationPage, totalConversationPages, isLoadingConversations, fetchMoreConversations]);

    // Initialize on first load
    useEffect(() => {
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

        };

        setMessages([initialMessage]);

        setChatHistory(prev => ({
            [newChatId]: {
                title: "New Chat",
                messages: [initialMessage],
                createdAt: new Date().toISOString(),
                threadId: null
            },
            ...prev
        }));

        setCurrentChatId(newChatId);
        setCurrentThreadId(null);

        setAnswerType("excel");

        setConversationPage(1);
        setTotalConversationPages(1);

        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }

        setTimeout(() => inputRef.current?.focus(), 100);


    };

    // Load an existing chat
    const loadChat = (chatId) => {
        if (chatHistory[chatId]) {
            setCurrentChatId(chatId);

            // Reset conversation state before loading
            setConversationPage(1);
            setTotalConversationPages(1);
            setMessages([]); // Clear existing messages

            // If it's a server-side thread, fetch the initial conversations
            if (chatHistory[chatId].threadId) {
                fetchThreadConversations(chatHistory[chatId].threadId, 1, true); // Load first page and reset messages
            } else {
                setMessages(chatHistory[chatId].messages || []);
                setCurrentThreadId(null);
            }

            setAnswerType("excel");

            if (window.innerWidth <= 768) {
                setIsSidebarOpen(false);
            }

            setInput("");
            setIsWaitingForResponse(false);
        }


    };

    // Handle sending a message
    const handleSend = async () => {
        if (!isAuthenticated) {
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
            const isInsightsMode = input.includes('@Insights') || input.includes('@insights');
            const currentAnswerType = isInsightsMode ? 'insights' : 'excel';

            const userMessage = {
                text: input.trim(),
                sender: "user",
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, userMessage]);

            setInput("");
            setIsWaitingForResponse(true);

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
                const requestBody = {
                    user_input: userMessage.text,
                    answer_type: currentAnswerType
                };

                if (currentThreadId) {
                    requestBody.thread_id = currentThreadId;
                }

                const response = await axios.post('http://127.0.0.1:8000/generate-response/', requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                const {
                    results,
                    message,
                    thread_id,
                    chart_type,
                    chart_image_url,
                    conversation_id
                } = response.data;

                if (thread_id && thread_id !== currentThreadId) {
                    setCurrentThreadId(thread_id);
                }

                const parseMarkdown = (text) => {
                    if (!text) return '';
                    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                };

                const botResponse = {
                    rawText: message || results,
                    text: parseMarkdown(message || results),
                    sender: "bot",
                    timestamp: new Date().toISOString(),
                    chartType: chart_type,
                    chartImageUrl: chart_image_url,
                    conversationId: conversation_id,
                    excelPath: response.data.excel_path,
                    parsedHtml: true
                };

                setMessages(prev => [...prev, botResponse]);

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

                if (error.response && error.response.status === 401) {
                    errorMessage = "Your session has expired. Please log in again.";
                    localStorage.removeItem('token');
                    setAuthToken(null);
                    setIsAuthenticated(false);
                }

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

        if (chat.title.toLowerCase().includes(query)) return true;

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
    const handleDownloadExcel = (conversationId, excelPath) => {
        if (!conversationId) {
            alert("No data available for download");
            return;
        }

        if (!isAuthenticated) {
            alert("Authentication required. Please log in.");
            return;
        }

        fetch(`http://127.0.0.1:8000/download-excel/${conversationId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
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

    // Login helper function
    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setAuthToken(token);
        setIsAuthenticated(true);
        fetchThreadHistory();
    };

    // Logout helper function
    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setIsAuthenticated(false);
        setChatHistory({});
        createNewChat();
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
                    <aside className={`chat-sidebar ${isSidebarOpen ? 'active' : ''}`} ref={sidebarRef}>
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
                            {isAuthenticated && isLoadingThreads && !chatHistoryLoaded && (
                                <div className="loading-indicator"></div>
                            )}

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
                                <div className="no-results">
                                    {isAuthenticated && chatHistoryLoaded ? "No chats found" : "Sign in to see your chat history"}
                                </div>
                            )}

                            {isLoadingThreads && chatHistoryLoaded && (
                                <div className="loading-more">Loading more chats...</div>
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
                                <div className="chat-title">Loanie</div>
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

                            </div>
                        )}

                        {/* Messages */}
                        <div className="chat-messages" ref={chatMessagesRef}>
                            {isLoadingConversations && conversationPage > 1 && (
                                <div className="loading-older-messages">Loading older messages...</div>
                            )}

                            {messages.map((msg, index) => (
                                <div key={index} className={`message-wrapper ${msg.sender === "user" ? "user-message-wrapper" : "bot-message-wrapper"}`}>
                                    <div className={`message ${msg.sender === "user" ? "user-message" : "bot-message"} ${msg.isError ? "error-message" : ""}`}>
                                        {msg.parsedHtml ? (
                                            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                        ) : (
                                            <>{msg.text}</>
                                        )}

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
                                                    onClick={() => handleDownloadExcel(msg.conversationId, msg.excelPath)}
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

                        {/* Input area with dropdown */}
                        <div className="chat-input-area">
                            <div className="input-wrapper w-full flex-grow relative">
                                <input
                                    type="text"
                                    ref={inputRef}
                                    className="chat-input w-full"
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder={isAuthenticated ? "Type @ for insights or just type for excel..." : "Please log in to chat"}
                                    disabled={isWaitingForResponse || !isAuthenticated}
                                />

                                {/* Type dropdown - showing only insights option */}
                                {showTypeDropdown && (
                                    <div
                                        ref={typeDropdownRef}
                                        className="type-dropdown absolute left-0 bottom-full mb-2 bg-white rounded-md shadow-lg z-10 w-48"
                                    >
                                        <div className="p-2 text-xs text-gray-500 border-b">Loanie insights:</div>
                                        <div
                                            className="p-2 hover:bg-blue-50 cursor-pointer"
                                            onClick={() => handleTypeSelect('insights')}
                                        >
                                            @Insights
                                        </div>
                                    </div>
                                )}
                            </div>

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