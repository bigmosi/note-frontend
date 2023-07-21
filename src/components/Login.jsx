import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { login } from '../utils/auth';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      setError('Invalid username or password, Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setError('');
  
    if (e.target.name === 'username') {
      setUsername(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };
  
      
  return (
    <div>
      <h2 className="title">Login</h2>
      <form onSubmit={handleLogin}>
        {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: "center" }}>{error}</p>}
        <div className="input-main">
         <div>
         <div className="text-input-container">
          <label>User Name:</label><br />
          <input 
            type="text"
            name="username"
            value={username}
            placeholder="Please enter user name."
            style={{ '--placeholder-color': 'green' }}
            onChange={handleInputChange}
            required
             />
        </div>
        <div className="text-input-container">
          <label>Password:</label> <br />
          <input 
           type="password" 
           name="password"
           value={password} 
           onChange={handleInputChange}
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
