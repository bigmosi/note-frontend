import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import io from 'socket.io-client';
import './CategoryDetails.css';

const Note = ({ note, index, moveNote }) => {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: 'NOTE',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveNote(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [, drag] = useDrag({
    type: 'NOTE',
    item: { id: note._id, index },
  });

  drag(drop(ref));

  return (
    <div className="note" ref={ref}>
      <h4 className="note-title">{note.title}</h4>
      <p className="note-content" dangerouslySetInnerHTML={{ __html: note.content }} />
      <ul className="note-tags">
        {note.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
};

const CategoryDetails = () => {
  const [category, setCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const { categoryId } = useParams();

  // Setting up the WebSocket connection
  useEffect(() => {
    const socket = io('http://localhost:4000');
    socket.emit('joinRoom', categoryId); // Join the room (category) corresponding to the categoryId

    // Listen for note updates from the server
    socket.on('noteUpdated', (updatedNote) => {
      // Update the note in the category state with the updated content
      setCategory((prevCategory) => {
        const updatedNotes = prevCategory.notes.map((note) => {
          if (note._id === updatedNote._id) {
            return { ...note, ...updatedNote };
          }
          return note;
        });

        return { ...prevCategory, notes: updatedNotes };
      });
    }, [categoryId]);

    return () => {
      socket.disconnect(); // Cleaning up the WebSocket connection when unmounting
    };
  });

  useEffect(() => {
    fetchCategoryDetails();
  }, [categoryId]);

  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/categories/${categoryId}/notes`);
      setCategory(response.data);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };

  const moveNote = (dragIndex, hoverIndex) => {
    const reorderedNotes = [...category.notes];
    const draggedNote = reorderedNotes[dragIndex];
    reorderedNotes.splice(dragIndex, 1);
    reorderedNotes.splice(hoverIndex, 0, draggedNote);
    setCategory({ ...category, notes: reorderedNotes });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterTagChange = (e) => {
    setFilterTag(e.target.value);
  };

  const filteredNotes = category?.notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
      note.content.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
      note.tags.includes(filterTag)
  );

  return (
    <div className="category-details-container">
      {category ? (
        <div>
          <h2 className="category-name">{category.name}</h2>
          <p className="category-description">{category.description}</p>
          <div className="search-filter-container">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title or content"
            />
            <label htmlFor="filterTag">Filter by Tag:</label>
            <input
              type="text"
              id="filterTag"
              className="filter-input"
              value={filterTag}
              onChange={handleFilterTagChange}
              placeholder="Enter a tag to filter"
            />
          </div>
          <h3>Notes:</h3>
          {filteredNotes.length > 0 ? (
            <DndProvider backend={HTML5Backend}>
              <ul>
                {filteredNotes.map((note, index) => (
                  <Note key={note._id} note={note} index={index} moveNote={moveNote} />
                ))}
              </ul>
            </DndProvider>
          ) : (
            <p className="no-notes-message">No notes found for this category.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CategoryDetails;
