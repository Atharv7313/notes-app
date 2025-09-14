import React, { useEffect, useState } from "react";

export default function NoteModal({ note, onClose, onSave }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => { setTitle(note?.title || ""); setContent(note?.content || ""); }, [note]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0 }}>{note ? "Edit Note" : "Create Note"}</h3>
            <div className="card__subtitle small" style={{ marginTop: 4 }}>{note ? "Modify and save changes" : "Start by giving your note a title"}</div>
          </div>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(title.trim(), content.trim()); }}>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Title</label>
            <input className="input form-control" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Content</label>
            <textarea className="input form-control" rows={8} value={content} onChange={e => setContent(e.target.value)} />
          </div>

          <div className="modal-actions">
            <button className="btn" type="submit">{note ? "Update Note" : "Save Note"}</button>
            <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
