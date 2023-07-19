import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NoteCreationInterface = () => {
  const [noteTitle, setNoteTitle] = useState('Hello World');
  const [noteContent, setNoteContent] = useState(
    '<ul><li><strong>﻿</strong></li></ul>',
  );
  const [noteCategory, setNoteCategory] = useState('General');
  const [noteTags, setNoteTags] = useState(['tag1']);

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
        setNoteTitle('');
        setNoteContent('');
        setNoteCategory('');
        setNoteTags([]);
        alert('Note created successfully!');
      } else {
        alert('Failed to create the note. Please try again later.');
      }
    } catch (error) {
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
      <input
        type="text"
        placeholder="Enter category"
        value={noteCategory}
        onChange={(e) => setNoteCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter tags (comma-separated)"
        value={noteTags.join(', ')}
        onChange={(e) => setNoteTags(e.target.value.split(', '))}
      />
      <button type="submit" onClick={handleSaveNote}>Save Note</button>
    </div>
  );
};

export default NoteCreationInterface;
