import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
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
        <p className="note-date">Date: {new Date(note.createdAt).toLocaleDateString()}</p>
      </div>
    );
  };

export default Note;
