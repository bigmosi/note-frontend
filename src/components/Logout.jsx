import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the access token from local storage and redirect to the login page
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  // Call the handleLogout function when the component mounts
  React.useEffect(() => {
    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
