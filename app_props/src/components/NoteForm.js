import React, { useState, useEffect } from 'react';
import '../pages/NoteForm.css';

const NoteForm = ({ onSave, onCancel, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '') return;

    const newNote = { title, content };
    if (note?.id) newNote.id = note.id;

    console.log("🔄 Note envoyée :", newNote); 
    onSave(newNote);

    if (!note?.id) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-input"
      />
      <textarea
        placeholder="Contenu"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="form-textarea"
      />
      <button type="submit" className="form-button">
        {note ? 'Modifier' : 'Ajouter'}
      </button>
      {note && (
        <button type="button" onClick={onCancel} className="form-button cancel">
          Annuler
        </button>
      )}
    </form>
  );
};

export default NoteForm;
