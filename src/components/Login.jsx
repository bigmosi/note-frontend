import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await AuthService.login(username, password);
          console.log('Login response:', response); // Check the data in the console
          // Save the access token to local storage
          localStorage.setItem('access_token', response.access_token);
      
          navigate('/dashboard');
        } catch (error) {
          console.error('Error logging in:', error);
        }
      };
      
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
