import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import { getNotes, createNote, deleteNote, updateNote } from '../api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [greeting, setGreeting] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12
        ? 'Bonjour, bonne matinée !'
        : hour < 18
        ? 'Bonjour, bon après-midi !'
        : 'Bonsoir, bonne soirée !'
    );
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getNotes(token)
        .then(data => setNotes(data))
        .catch(err => console.error("Erreur chargement notes :", err));
    }
  }, [isAuthenticated]);

  const handleSaveNote = (note) => {
    if (!isAuthenticated) {
      if (note.id) {
        setNotes(prev => prev.map(n => (n.id === note.id ? note : n)));
      } else {
        setNotes(prev => [...prev, { ...note, id: Date.now() }]);
      }
    } else {
      if (note.id) {
        updateNote(note.id, note, token)
          .then(updated => {
            setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
            setSelectedNote(null);
            window.location.reload();
          })
          .catch(err => console.error("Erreur modification :", err));
      } else {
        createNote(note, token)
          .then(newNote => setNotes(prev => [...prev, newNote]))
          .catch(err => console.error("Erreur création :", err));
      }
    }
  };

  const handleDeleteNote = (id) => {
    if (!isAuthenticated) {
      setNotes(prev => prev.filter(n => n.id !== id));
    } else {
      deleteNote(id, token)
        .then(() => setNotes(prev => prev.filter(n => n.id !== id)))
        .catch(err => console.error("Erreur suppression :", err));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setNotes([]);
    navigate('/login');
  };

  const filteredNotes = Array.isArray(notes)
    ? notes.filter(note =>
        (note.title && note.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">MonAppNotes</Link>
          <div className="d-flex">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">
                  <i className="bi bi-box-arrow-in-right"></i> Connexion
                </Link>
                <Link to="/register" className="btn btn-primary">
                  <i className="bi bi-person-plus"></i> Inscription
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-outline-warning">
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-3">Organisez vos idées</h1>
          <p className="lead mb-4">{greeting} Commencez à capturer vos pensées dès maintenant</p>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="container my-5">
        {/* Formulaire */}
        <section className="mb-5">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">{selectedNote ? "Modifier la note" : "Ajouter une nouvelle note"}</h4>
            </div>
            <div className="card-body">
              <NoteForm
                note={selectedNote}
                onSave={handleSaveNote}
                onCancel={() => setSelectedNote(null)}
              />
            </div>
          </div>
        </section>

        {/* Recherche */}
        <section className="mb-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher une note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Notes */}
        <section className="mb-5">
          {filteredNotes.length > 0 ? (
            <div className="row g-3">
              {filteredNotes.map((note) => (
                <div className="col-md-4" key={note.id}>
                  <NoteCard
                    note={note}
                    onEdit={setSelectedNote}
                    onDelete={handleDeleteNote}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-secondary text-center" role="alert">
              Aucune note trouvée. Commencez par en créer une !
            </div>
          )}
        </section>
      </div>

      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; 2025 Mon Application de Notes - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;