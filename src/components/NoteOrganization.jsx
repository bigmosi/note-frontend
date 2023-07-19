import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';

const NoteOrganization = () => {
  const [notes, setNotes] = useState([]);
  const { categoryId } = useParams();

  // Fetch notes from the backend on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/categories/${categoryId}/notes/`);
      setNotes(response.data.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // Check if the drag-and-drop was successful
    if (!destination) return;

    // Reorder the notes based on the drag-and-drop result
    const updatedNotes = Array.from(notes);
    const [draggedNote] = updatedNotes.splice(source.index, 1);
    updatedNotes.splice(destination.index, 0, draggedNote);

    // Update the frontend state to reflect the new order immediately
    setNotes(updatedNotes);

    // Make an API call to update the order in the backend
    axios
      .put(`http://localhost:4000/api/v1/categories/${categoryId}/notes/reorder`, {
        noteIds: updatedNotes.map((note) => note._id),
      })
      .then((response) => {
        // Handle successful response if needed
        console.log('Note order updated successfully!', response.data);
        // Show a success message to the user, update UI, etc.
      })
      .catch((error) => {
        console.error('Error updating note order:', error);
        // Rollback the frontend state if the API call fails
        setNotes([...notes]);
        // Show an error message to the user, handle UI accordingly, etc.
      });
  };
  
  return (
    <div>
      <h2>My Notes</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="notes">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {notes && notes.length > 0 ? (
                notes.map((note, index) => (
                  <Draggable draggableId={note._id} index={index} key={note._id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {/* ... your existing note rendering ... */}
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p>No notes found.</p>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default NoteOrganization;
