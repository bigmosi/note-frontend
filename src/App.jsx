// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideBar from './Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './utils/protectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute element={<SideBar />} /> // Use ProtectedRoute here
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
