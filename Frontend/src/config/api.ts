// API Configuration
export const API_CONFIG = {
  // Backend server (Express) - Authentication
  BACKEND_URL: "http://localhost:3001",
  
  // ML server (Flask) - Video feed and attentiveness
  ML_SERVER_URL: "http://localhost:5000"
};

// Helper function to get full URL for ML server endpoints
export const getMLServerUrl = (endpoint: string) => {
  return `${API_CONFIG.ML_SERVER_URL}${endpoint}`;
}; 