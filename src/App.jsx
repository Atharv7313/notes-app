import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Dashboard from "./components/Dashboard";
import NotesList from "./components/NotesList";
import NoteModal from "./components/NoteModal";
import MemberModal from "./components/MemberModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import Toast from "./components/Toast";
import { get as apiGet, post as apiPost, put as apiPut, del as apiDel } from "./api/api";

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [tenant, setTenant] = useState(user?.tenant || null);
  const [screen, setScreen] = useState(token && user ? "dashboard" : "login");

  const [notes, setNotes] = useState([]);
  const [subscription, setSubscription] = useState({ plan: "free", noteCount: 0, noteLimit: 3 });

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadProfile();
      loadNotes();
    } else {
      localStorage.removeItem("token");
    }
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [token]);

  async function loadProfile() {
    try {
      const data = await apiGet("/auth/profile");
      if (data.success) {
        setUser(data.user);
        setTenant(data.user.tenant);
      }
    } catch (e) { console.error(e); }
  }

  async function loadNotes() {
    try {
      const data = await apiGet("/notes");
      if (data.success) {
        setNotes(data.notes || []);
        if (data.subscription) setSubscription(data.subscription);
      }
    } catch (e) { console.error("Error loading notes:", e); }
  }

  const auth = {
    login: async (email, password) => {
      const res = await apiPost("/auth/login", { email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        setTenant(res.user.tenant);
        setScreen("dashboard");
        showToast("Logged in", "success");
      }
      return res;
    },
    register: async (payload) => {
      const res = await apiPost("/auth/register-tenant", payload);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        setTenant(res.user.tenant);
        setScreen("dashboard");
        showToast("Organization created", "success");
      }
      return res;
    },
    logout: () => {
      setToken(null);
      setUser(null);
      setTenant(null);
      setScreen("login");
      showToast("Logged out");
    }
  };

  const notesApi = {
    createOrUpdate: async (title, content, id = null) => {
      if (id) {
        const r = await apiPut(`/notes/${id}`, { title, content });
        if (r.success) { await loadNotes(); showToast("Note updated", "success"); }
        return r;
      } else {
        const r = await apiPost("/notes", { title, content });
        if (r.success) { await loadNotes(); showToast("Note created", "success"); }
        return r;
      }
    },
    remove: async (id) => {
      const r = await apiDel(`/notes/${id}`);
      if (r.success) { await loadNotes(); showToast("Note deleted", "success"); }
      return r;
    },
  };

  const membersApi = {
    list: async () => apiGet("/members"),
    invite: (email, role) => apiPost("/members/invite", { memberEmail: email, role }),
    remove: (id) => apiDel(`/members/${id}`),
  };

  const billingApi = {
    upgrade: async () => {
      const r = await apiPost(`/tenants/${tenant?.id}/upgrade`, {});
      if (r.success) { setTenant(t => ({ ...t, plan: "pro" })); showToast("Upgraded", "success"); await loadNotes(); }
      return r;
    }
  };

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="app-root p-4">
      <Header
        user={user} tenant={tenant}
        onLogout={auth.logout}
        onShowMembers={() => { setMemberModalOpen(true); }}
        onShowChangePassword={() => setChangePasswordOpen(true)}
      />

      {screen === "login" && <Login onLogin={auth.login} onShowRegister={() => setScreen("register")} />}
      {screen === "register" && <Registration onRegister={auth.register} onShowLogin={() => setScreen("login")} />}

      {screen === "dashboard" && (
        <>
          <Dashboard
            user={user}
            subscription={subscription}
            onCreateNote={() => { setEditingNote(null); setNoteModalOpen(true); }}
            onUpgrade={billingApi.upgrade}
          />
          <NotesList notes={notes} onEdit={(n) => { setEditingNote(n); setNoteModalOpen(true); }} onDelete={(id) => notesApi.remove(id)} />
        </>
      )}

      {noteModalOpen && <NoteModal note={editingNote} onClose={() => { setNoteModalOpen(false); setEditingNote(null); }} onSave={(t,c) => notesApi.createOrUpdate(t,c, editingNote?.id)} />}

      {memberModalOpen && <MemberModal onClose={() => setMemberModalOpen(false)} api={membersApi} />}

      {changePasswordOpen && <ChangePasswordModal onClose={() => setChangePasswordOpen(false)} />}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
