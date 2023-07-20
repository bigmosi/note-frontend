// Main file where you render your application
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SideBar from './Sidebar';

const App = () => {
  return (
    <Router>
      <SideBar />
    </Router>
  );
};

export default App;
