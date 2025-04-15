import React from 'react';
import '../pages/NoteCard.css';

const NoteCard = ({ note, onEdit, onDelete, isAuthenticated }) => {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>

      {note.labels && (
        <div className="labels">
          {note.labels.map((label, index) => (
            <span key={index} className="label">{label}</span>
          ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="note-actions">
          <button onClick={() => onEdit(note)} className="btn btn-sm btn-warning me-2">Modifier</button>
          <button onClick={() => onDelete(note.id)} className="btn btn-sm btn-danger">Supprimer</button>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
// 