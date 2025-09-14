import React from "react";
import escapeHtml from "../utils/escapeHtml";

export default function NotesList({ notes, onEdit, onDelete }) {
  if (!notes || notes.length === 0) return (
    <div className="empty-state card" style={{ marginTop: 18 }}>
      <div className="empty-state-icon" style={{ fontSize: 40 }}>📝</div>
      <h3>No notes yet</h3>
      <p className="small">Create your first note to get started.</p>
    </div>
  );

  return (
    <div className="notes-grid" style={{ marginTop: 18 }}>
      {notes.map(note => (
        <article key={note.id} className="note-card" data-note-id={note.id}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <h3 className="note-title">{note.title}</h3>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-icon" title="Edit" onClick={() => onEdit(note)}>✏️</button>
              <button className="btn-icon" title="Delete" onClick={() => onDelete(note.id)}>🗑️</button>
            </div>
          </header>

          <div className="note-content" style={{ marginTop: 8 }}>
            <p dangerouslySetInnerHTML={{ __html: (escapeHtml(note.content) || "").substring(0, 250) + (note.content.length > 250 ? "..." : "") }} />
          </div>

          <footer className="note-footer">Created {new Date(note.createdAt).toLocaleDateString()}</footer>
        </article>
      ))}
    </div>
  );
}
