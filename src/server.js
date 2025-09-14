// src/server.js  (CommonJS to match your package.json:type "commonjs")
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: true })); // permissive for now

app.get('/api/health', (req, res) => res.json({ ok: true }));

let notes = []; // placeholder in-memory store
app.get('/api/notes', (req, res) => res.json(notes));
app.post('/api/notes', (req, res) => {
  const id = Date.now().toString();
  const note = { id, ...req.body };
  notes.push(note);
  res.status(201).json(note);
});
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  notes = notes.map(n => (n.id === id ? { ...n, ...req.body } : n));
  const updated = notes.find(n => n.id === id);
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const prev = notes.length;
  notes = notes.filter(n => n.id !== id);
  if (notes.length === prev) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
