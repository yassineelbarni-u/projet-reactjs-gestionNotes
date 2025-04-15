const API_BASE = "http://localhost:3000";

// --- Auth ---

export const register = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur API: ${errorText}`);
  }

  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    throw new Error("Réponse inattendue du serveur");
  }
};

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur API: ${errorText}`);
  }

  if (contentType && contentType.includes("application/json")) {
    return await res.json(); // { token: "..." }
  } else {
    throw new Error("Réponse inattendue du serveur");
  }
};

// --- Notes ---

export const createNote = async (note, token) => {
  const res = await fetch(`${API_BASE}/notes/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur API: ${errorText}`);
  }

  return await res.json();
};

export const updateNote = async (id, updatedNote, token) => {
  const res = await fetch(`http://localhost:3000/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedNote),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur API (modification) : ${errorText}`);
  }

  return await res.json();
};

export const deleteNote = async (id, token) => {
  const res = await fetch(`http://localhost:3000/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur API (suppression) : ${errorText}`);
  }

  return true;
};


export const getNotes = async (token) => {
  const res = await fetch(`${API_BASE}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur API: ${errorText}`);
  }

  return await res.json();
};