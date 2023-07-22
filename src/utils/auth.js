import axios from 'axios';

let isAuthenticated = false;
let user = null;

export const checkAuthentication = () => {
  return isAuthenticated;
};

export const getUser = () => {
  return user;
};

export const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:4000/api/v1/auth/login', {
      username,
      password,
    });
    console.log('Login Response:', response.data);


    // Save the access token to local storage
    localStorage.setItem('access_token', response.data.access_token);

    // Set isAuthenticated to true upon successful login
    isAuthenticated = true;

    // Save the user data in the variable
    user = response.data.user;
    console.log('User:', user);

    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
