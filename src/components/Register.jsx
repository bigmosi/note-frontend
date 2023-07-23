import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import AuthService from './AuthService';
import './Register.css'

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register(email, username, password);
      setRegistrationStatus('Registration successful! Please login');
    } catch (error) {
      console.error('Error registering:', error);
      setRegistrationStatus('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="title">Register</h2>
      { registrationStatus && <p className="registration-status">{registrationStatus}</p> }
      <form onSubmit={handleRegister}>
        <div className="input-main">
        <div>
        <div className="text-input-container">
          <label>Email:</label>
          <input 
           type="email" 
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="Please enter your email address"
            required />
        </div>
        <div className="text-input-container">
          <label>Username:</label>
          <input 
           type="text" 
           value={username} 
           onChange={(e) => setUsername(e.target.value)}
           placeholder="Please enter username"
            required />
        </div>
        <div className="text-input-container">
          <label>Password:</label>
          <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="please enter your password"
           required />
        </div>
        </div>
        </div>
        <div className="button-container">
          <button type="submit">Register</button>
        </div>
      </form>
      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Register;
