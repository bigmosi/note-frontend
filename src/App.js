import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import NoteOrganization from './components/NoteOrganization';

const App = () => {
  const [notes, setNotes] = useState([]);

  // Fetch notes from the backend on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/notes');
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  return (
    <Router>
      <nav>
        <ul>
          {/* Add navigation links */}
        </ul>
      </nav>
      <Routes>
        <Route path="/categories/:categoryId" element={<NoteOrganization notes={notes} />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
