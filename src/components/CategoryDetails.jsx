import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
    <div ref={ref}>
      <h4>{note.title}</h4>
      <p>{note.content}</p>
      <ul>
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
  )

  return (
    <div>
      {category ? (
        <div>
          <h2>{category.name}</h2>
          <p>{category.description}</p>
          <div>
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title or content"
            />
          </div>

          <div>
            <label htmlFor="filterTag">Filter by Tag:</label>
            <input
              type="text"
              id="filterTag"
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
            <p>No notes found for this category.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CategoryDetails;
