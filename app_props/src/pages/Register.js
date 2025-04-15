import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      alert("Inscription réussie !");
      navigate('/login');
    } catch (err) {
      setError("Erreur lors de l'inscription : email déjà utilisé ou serveur indisponible.");
    }
  };

  return (
    <div className="register">
      <h2>Inscription</h2>
      <p className="register-subtitle">Créez un compte pour enregistrer vos notes</p>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">S'inscrire</button>
      </form>

      {error && <div className="register-error">{error}</div>}
    </div>
  );
};

export default Register;
