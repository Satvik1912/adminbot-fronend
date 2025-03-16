/**
 * Utility functions for the chatbot component
 */

/**
 * Generate a title for the chat based on the first user message
 * @param {string} message - The user's message
 * @returns {string} - A title for the chat
 */
export const generateChatTitle = (message) => {
    if (!message) return "New Chat";
    
    // Extract meaningful content, filtering out short words
    const words = message.split(/\s+/).filter(word => word.length > 2);
    
    // Create a descriptive title
    if (words.length <= 3) {
      return words.join(" ");
    } else {
      // Get first 3 meaningful words with ellipsis
      return words.slice(0, 3).join(" ") + "...";
    }
  };
  
  /**
   * Format timestamp to user-friendly format
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} - Formatted timestamp
   */
  export const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      // Today
      if (diffInHours < 24 && date.getDate() === now.getDate()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Yesterday
      if (diffInHours < 48 && (now.getDate() - date.getDate() === 1 || (now.getDate() === 1 && date.getDate() === new Date(now.getFullYear(), now.getMonth(), 0).getDate()))) {
        return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Within a week
      if (diffInHours < 168) {
        return date.toLocaleDateString([], { weekday: 'short' }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Older
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "";
    }
  };