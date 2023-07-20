import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import io from 'socket.io-client';
import './CategoryDetails.css';
import Spinner from './Spinner';

const LazyNote = React.lazy(() => import('./Note'));

const CategoryDetails = () => {
  const [category, setCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const { categoryId } = useParams();
  const [filterDate, setFilterDate] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Setting up the WebSocket connection
  useEffect(() => {
    const socket = io('http://localhost:4000', {
      transports: ['websocket'],
    });
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
    });

    return () => {
      socket.disconnect(); // Cleaning up the WebSocket connection when unmounting
    };
  }, [categoryId]);

  useEffect(() => {
    fetchCategoryDetails();
  }, [categoryId]);

  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/categories/${categoryId}/notes`);
      console.log(response.data);
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

  const handleFilterDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);
  };

  const handleNewCategoryNameChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const createCategory = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/v1/categories', {
        name: newCategoryName,
        description: '',
      });

      setNewCategoryName(response.data);
      alert('Category created successfully!');
    } catch (error) {
      console.log('Error creating category:', error);
      alert('Failed to create the category. Please try again later.');
      
    }
  }

  const filteredNotes = category?.notes.filter((note) => {
    // Filter by title, content, and tags
    const matchesQuery =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.includes(filterTag);

    // Filter by date (if filterDate is not null)
    const matchesDate = filterDate
      ? new Date(note.createdAt).toLocaleDateString() === filterDate
      : true;

    return matchesQuery && matchesDate;
  });

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
            <label htmlFor="filterDate">Filter by Date:</label>
            <input
              type="date"
              id="filterDate"
              className="filter-input"
              value={filterDate !== null ? filterDate : ''}
              onChange={handleFilterDateChange}
            />
          </div>
          <h3>Notes:</h3>
          {filteredNotes.length > 0 ? (
            <DndProvider backend={HTML5Backend}>
              <ul>
                <Suspense fallback={<Spinner />}>
                {filteredNotes.map((note, index) => (
                    <LazyNote key={note._id} note={note} index={index} moveNote={moveNote} />
                  ))}
                </Suspense>
              </ul>
              <div className="new-category-form">
                <input
                 type="text"
                 value={newCategoryName}
                 onChange={handleNewCategoryNameChange}
                 placeholder="Enter category name"
                 required
                 />
                 <button type="submit" onClick={createCategory} >Create Category</button>
              </div>
            </DndProvider>
          ) : (
            <p className="no-notes-message">No notes found for this category.</p>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default CategoryDetails;
