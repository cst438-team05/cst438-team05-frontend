// Helper function to add JWT token to fetch requests
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    window.location.href = '/login';
    return;
  }

  return response;
};

// Helper function to get current user's role
export const getUserRole = () => {
  return localStorage.getItem('userType');
};

// Helper function to get current user's ID
export const getUserId = () => {
  return localStorage.getItem('userId');
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
}; 