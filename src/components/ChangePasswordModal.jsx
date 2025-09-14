import React, { useState } from "react";
import { post as apiPost } from "../api/api";

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmPassword) return setMessage("New passwords do not match");
    const res = await apiPost("/auth/change-password", { currentPassword, newPassword });
    if (res.success) { setMessage("Password changed"); setTimeout(onClose, 1200); }
    else setMessage(res.message || "Failed");
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h3 style={{ margin: 0 ,}}>Change Password</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 10 }}>
            <label className="form-label">Current Password</label>
            <input type="password" className="input form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="form-label">New Password</label>
            <input type="password" className="input form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <div className="form-help">Minimum 8 characters</div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="form-label">Confirm New Password</label>
            <input type="password" className="input form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>

          {message && <div className="small" style={{ marginBottom: 10 }}>{message}</div>}

          <div style={{ display: "flex", gap: 8,}}>
            <button className="btn" type="submit">Change Password</button>
            <button className="btn btn--ghost" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
