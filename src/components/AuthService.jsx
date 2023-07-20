import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1/auth/';

const AuthService = {
    login: async (username, password) => {
        try {
          const response = await axios.post('http://localhost:4000/api/v1/auth/login', {
            username,
            password,
          });
    
          // Save the JWT in local storage
          localStorage.setItem('accessToken', response.data.token);
    
          return response.data;
        } catch (error) {
          throw new Error('Error logging in');
        }
      },

  register: async (email, username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, { email, username, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  isLoggedIn: () => {
    // Check if there is a valid JWT in local storage
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  },
};

export default AuthService;
