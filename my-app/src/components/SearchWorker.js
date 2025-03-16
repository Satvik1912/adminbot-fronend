/**
 * Web Worker for searching through chat history
 * This allows searching to be done in a separate thread without blocking the UI
 */

// Listen for messages from the main thread
self.addEventListener('message', function(e) {
    const { chatHistory, query } = e.data;
    
    if (!query || !chatHistory) {
      self.postMessage({ results: [] });
      return;
    }
    
    const searchQuery = query.toLowerCase();
    const results = [];
    
    // Search through chat history
    Object.entries(chatHistory).forEach(([chatId, chat]) => {
      let matchScore = 0;
      let matchFound = false;
      let matchDetails = [];
      
      // Check title
      if (chat.title.toLowerCase().includes(searchQuery)) {
        matchScore += 10; // Title matches are more important
        matchFound = true;
        matchDetails.push({ type: 'title', text: chat.title });
      }
      
      // Check messages
      chat.messages.forEach(msg => {
        if (msg.text.toLowerCase().includes(searchQuery)) {
          matchScore += 1;
          matchFound = true;
          
          // Extract context around match
          const index = msg.text.toLowerCase().indexOf(searchQuery);
          const start = Math.max(0, index - 20);
          const end = Math.min(msg.text.length, index + searchQuery.length + 20);
          let contextText = msg.text.substring(start, end);
          
          if (start > 0) contextText = '...' + contextText;
          if (end < msg.text.length) contextText = contextText + '...';
          
          matchDetails.push({ 
            type: 'message', 
            sender: msg.sender,
            text: contextText
          });
        }
      });
      
      // Add to results if match found
      if (matchFound) {
        results.push({
          chatId,
          title: chat.title,
          createdAt: chat.createdAt,
          matchScore,
          matchDetails: matchDetails.slice(0, 3) // Limit to first 3 matches
        });
      }
    });
    
    // Sort by match score (highest first)
    results.sort((a, b) => b.matchScore - a.matchScore);
    
    // Send results back to main thread
    self.postMessage({ results });
  });