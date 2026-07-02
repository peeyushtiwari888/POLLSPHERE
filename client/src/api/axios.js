import axios from 'axios';
import { getToken } from '../utils/token';

/**
 * Reusable Axios Instance
 * 
 * We use this instance for all API calls in the application instead of using 
 * the default `axios` object. This allows us to configure base URLs, common 
 * headers, and interceptors (middleware) in one single place.
 */

const api = axios.create({
  // Use Vite environment variable for API URL. If not set, fallback to the current hostname.
  // This ensures that if the app is accessed via a local IP (e.g., from a mobile phone on the same WiFi),
  // it will correctly route API requests to that same IP instead of failing on 'localhost'.
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`,
  
  // Common headers applied to all requests
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Important for sending/receiving cookies (like our HTTP-only JWT)
  withCredentials: true,
});

// ==========================================
// 1. REQUEST INTERCEPTOR
// ==========================================
// The request interceptor runs BEFORE every request is sent to the backend.
api.interceptors.request.use(
  (config) => {
    // Note: Since we are using HTTP-only cookies, the browser automatically
    // attaches the JWT cookie to every request. However, some browsers block
    // third-party cross-site cookies (e.g. deployed frontend to deployed backend).
    // As a robust fallback, we also manually attach the JWT from localStorage if it exists.
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
