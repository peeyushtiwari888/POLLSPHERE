import axios from 'axios';

/**
 * Reusable Axios Instance
 * 
 * We use this instance for all API calls in the application instead of using 
 * the default `axios` object. This allows us to configure base URLs, common 
 * headers, and interceptors (middleware) in one single place.
 */

const api = axios.create({
  // Use Vite environment variable for API URL. If not set, fallback to localhost.
  // Note: Vite requires environment variables to be prefixed with VITE_
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Common headers applied to all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 1. REQUEST INTERCEPTOR
// ==========================================
// The request interceptor runs BEFORE every request is sent to the backend.
api.interceptors.request.use(
  (config) => {
    // Step 1: Retrieve the authentication token from localStorage
    const token = localStorage.getItem('token');
    
    // Step 2: If a token exists, attach it to the Authorization header
    if (token) {
      // The 'Bearer ' prefix is standard for JWT authentication
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Step 3: Return the modified config so the request can proceed
    return config;
  },
  (error) => {
    // Handle request setup errors
    return Promise.reject(error);
  }
);


// ==========================================
// 2. RESPONSE INTERCEPTOR
// ==========================================
// The response interceptor runs AFTER a response is received from the backend,
// but BEFORE your `.then()` or `.catch()` blocks are executed in your components.
api.interceptors.response.use(
  (response) => {
    // Success: Any status code in the 2xx range triggers this function.
    // We simply return the response intact.
    return response;
  },
  (error) => {
    // Error: Any status code outside the 2xx range triggers this function.
    
    // Cleanly extract the error message from the backend response, 
    // or fallback to a default JavaScript error message.
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Log the error to the console for debugging
    console.error('API Error:', errorMessage);
    
    // Handle 401 Unauthorized errors globally
    if (error.response?.status === 401) {
      console.warn('Unauthorized access. The token may be expired or missing.');
      // Note: We are not implementing refresh token logic here as requested.
      // Usually, you would clear the token and redirect to the login page here.
    }
    
    // Reject the promise with the error so the component can handle it
    return Promise.reject(error);
  }
);

export default api;
