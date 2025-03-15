// Chatbot.jsx
import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    text: "Hello! How can I assist you with loan management today?",
    sender: "bot"
  }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Thanks for your message. I'll help you with your inquiry once tejas updates me.",
          sender: "bot"
        }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ${isOpen ? 'opacity-0 z-0' : 'opacity-100 z-50'}`}
      >
        <FaRobot className="text-2xl" />
      </button>

      {/* Chat window */}
      <div className={`fixed bottom-5 right-5 w-80 bg-white rounded-lg shadow-2xl transition-all duration-300 transform ${isOpen ? 'scale-100 z-50' : 'scale-0 z-0'} overflow-hidden max-h-[500px] flex flex-col`}>
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div className="font-bold flex items-center">
            <FaRobot className="mr-2" /> Loan Assistant
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
            <FaTimes />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 max-h-[350px]">
          {messages.map((msg, index) => (
            <div key={index} className={`my-2 ${msg.sender === "user" ? "text-right" : ""}`}>
              <div className={`inline-block rounded-lg px-4 py-2 max-w-[70%] ${
                msg.sender === "user" 
                  ? "bg-blue-500 text-white rounded-br-none" 
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4 flex">
          <input 
            type="text" 
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <button 
            onClick={handleSend} 
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;