import axios from 'axios';

let isAuthenticated = false;

export const checkAuthentication = () => {
  return isAuthenticated;
};

export const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:4000/api/v1/auth/login', {
      username,
      password,
    });

    // Assuming the API returns a successful response with an access_token
    // Save the access token to local storage
    localStorage.setItem('access_token', response.data.access_token);

    // Set isAuthenticated to true upon successful login
    isAuthenticated = true;

    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
