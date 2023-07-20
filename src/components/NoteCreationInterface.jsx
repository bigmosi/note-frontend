import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NoteCreationInterface = () => {
  const [noteTitle, setNoteTitle] = useState('Hello World');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [noteTags, setNoteTags] = useState(['']);
  const [categories, setCategories] = useState([]);

  // Fetch categories from the server on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('An error occurred while fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSaveNote = async () => {
    const newNote = {
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      tags: noteTags,
      order: 0,
    };

    try {
      const response = await fetch('http://localhost:4000/api/v1/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        // If the response is successful, clear the input fields
        setNoteTitle('');
        setNoteContent('');
        setNoteCategory('');
        setNoteTags(['']);
        alert('Note created successfully!');
      } else {
        const errorData = await response.json(); // Parse the error response as JSON
        console.error('Error response from server:', errorData);
        alert('Failed to create the note. Please try again later.');
      }
    } catch (error) {
      console.error('An error occurred while creating the note:', error);
      alert('An error occurred while creating the note. Please try again later.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter note title"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
      />
      <ReactQuill
        value={noteContent}
        onChange={setNoteContent}
        modules={{ toolbar: true }}
      />
      <select value={noteCategory} onChange={(e) => setNoteCategory(e.target.value)}>
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter tags (comma-separated)"
        value={noteTags.join(', ')}
        onChange={(e) => setNoteTags(e.target.value.split(', '))}
      />
      <button type="button" onClick={handleSaveNote}>Save Note</button>
    </div>
  );
};

export default NoteCreationInterface;
