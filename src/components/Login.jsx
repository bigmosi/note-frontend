import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { login } from '../utils/auth';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call the login function and pass the username and password
      await login(username, password);
      // Redirect to the home page after successful login
      navigate('/');
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
            onChange={(e) => setUsername(e.target.value)}
            required
             />
        </div>
        <div className="text-input-container">
          <label>Password:</label> <br />
          <input 
           type="password" 
           value={password} 
           onChange={(e) => setPassword(e.target.value)}
           placeholder="Please enter your password"
           required
            />
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
