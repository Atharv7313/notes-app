import React, { useEffect, useState } from "react";

export default function MemberModal({ onClose, api }) {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { (async () => { const r = await api.list(); if (r.success) setMembers(r.members || []); })(); }, []);

  async function invite(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    const r = await api.invite(email, role);
    if (r.success) {
      setSuccess(`Member invited. Temp password: ${r.member?.temporaryPassword || "(sent)"}`);
      setEmail("");
      const l = await api.list(); if (l.success) setMembers(l.members || []);
    } else setError(r.message || "Invite failed");
  }

  async function removeMember(id, em) {
    if (!window.confirm(`Remove ${em}?`)) return;
    const r = await api.remove(id);
    if (r.success) setMembers(m => m.filter(x => x.id !== id));
    else setError(r.message || "Failed");
  }

  return (
    <div className="modal-overlay ">
      <div className="modal blur-xl" style={{ maxWidth: 900 }}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>Team Members</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <h4 className="card__title" style={{ fontSize: "1rem" }}>Invite New Member</h4>
            <form onSubmit={invite} style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 10 }}>
                <input className="input form-control" placeholder="member@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div style={{ marginBottom: 10 }}>
                <select className="input form-control" value={role} onChange={e => setRole(e.target.value)}>
                  <option>Member</option>
                  <option>Admin</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" type="submit">Invite</button>
                <button type="button" className="btn btn--ghost" onClick={() => { setEmail(""); setRole("Member"); }}>Reset</button>
              </div>

              {error && <div className="error-message" style={{ marginTop: 10 }}>{error}</div>}
              {success && <div className="success-message" style={{ marginTop: 10 }}>{success}</div>}
            </form>
          </div>

          <div>
            <h4 className="card__title" style={{ fontSize: "1rem" }}>Current Members</h4>
            <div className="members-list" style={{ marginTop: 12 }}>
              {members.length === 0 && <div className="text-muted">No members yet.</div>}
              {members.map(m => (
                <div className="member-item" key={m.id}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{m.email}</div>
                    <div className="small">{m.role} • Joined {new Date(m.createdAt).toLocaleDateString()}</div>
                    {m.isTemporaryPassword && <div className="small" style={{ color: "var(--success)" }}>Temporary password</div>}
                  </div>
                  <div>
                    <button className="btn btn--small btn--danger" onClick={() => removeMember(m.id, m.email)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
