// api-service.js

const API_BASE_URL = '/api'; // Update this to your actual API base URL

// Function to get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('loanve_auth_token');
};

// Headers with authentication token
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  };
};

// Process user input and get AI response
export const processUserInput = async (userInput, threadId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-response/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        user_input: userInput,
        thread_id: threadId
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing user input:', error);
    throw error;
  }
};

// Get Excel download URL
export const getExcelDownloadUrl = (conversationId) => {
  return `${API_BASE_URL}/download-excel/${conversationId}/`;
};

// Admin login
export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Delete and migrate thread
export const migrateThread = async (threadId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/migrate-thread/${threadId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Migration failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Thread migration error:', error);
    throw error;
  }
};