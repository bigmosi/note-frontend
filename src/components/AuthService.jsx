import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1/auth/';

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      // Save the access token to local storage
      localStorage.setItem('access_token', response.data.access_token);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
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
};

export default AuthService;
