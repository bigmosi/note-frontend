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
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <ul>
        {note.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
};

const NoteOrganization = () => {
  const [notes, setNotes] = useState([]);
  const { categoryId } = useParams();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/categories/${categoryId}/notes`
      );
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const moveNote = (dragIndex, hoverIndex) => {
    const updatedNotes = [...notes];
    const draggedNote = updatedNotes[dragIndex];
    updatedNotes.splice(dragIndex, 1);
    updatedNotes.splice(hoverIndex, 0, draggedNote);
    setNotes(updatedNotes);
  };

  return (
    <div>
      <h2>My Notes</h2>
      <DndProvider backend={HTML5Backend}>
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <Note key={note._id} note={note} index={index} moveNote={moveNote} />
          ))
        ) : (
          <p>No notes found.</p>
        )}
      </DndProvider>
    </div>
  );
};

export default NoteOrganization;
