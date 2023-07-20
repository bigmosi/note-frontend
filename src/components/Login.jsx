import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import AuthService from './AuthService';
import './Login.css';

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
      
          navigate('/sidebar');
        } catch (error) {
          console.error('Error logging in:', error);
        }
      };
      
  return (
    <div>
      <h2 className="title">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-main">
         <div>
         <div className="text-input-container">
          <label>User Name:</label><br />
          <input 
            type="text"
            value={username}
            placeholder="Please enter user name."
            style={{ '--placeholder-color': 'green' }}
            onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="text-input-container">
          <label>Password:</label> <br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
         </div>
        </div>
        <div className="button-container">
          <button type="submit">Login</button>
        </div>
      </form>
      <p className="login-link">
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default Login;
