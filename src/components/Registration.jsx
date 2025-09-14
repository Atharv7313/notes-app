import React, { useEffect, useState } from "react";

export default function Registration({ onRegister, onShowLogin }) {
  const [tenantName, setTenantName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = tenantName.toLowerCase().replace(/[^a-z0-9]+/g, "").replace(/^-+|-+$/g, "");
    setTenantSlug(id);
  }, [tenantName]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (adminPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (adminPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await onRegister({ tenantName, tenantSlug, adminEmail, adminPassword, confirmPassword });
    setLoading(false);
    if (!res.success) setError(res.message || "Registration failed");
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-brand">
          <img src="/logo.svg" alt="Logo" className="auth-logo" onError={(e)=>{e.target.style.display='none'}} />
          <div className="brand-title">
            <div className="brand-name">B2B SaaS Notes</div>
            <div className="brand-sub">Create your company workspace</div>
          </div>
        </div>

        <h2 className="auth-heading">Registration</h2>

        <form className="auth-form" onSubmit={submit}>
          <div className="form-row">
            <input className="pill-input" placeholder="Company name" value={tenantName} onChange={(e)=>setTenantName(e.target.value)} required />
          </div>

          <div className="form-grid">
            <input className="pill-input" placeholder="Organization ID (auto)" value={tenantSlug} onChange={(e)=>setTenantSlug(e.target.value)} />
            <input className="pill-input" type="email" placeholder="Work email" value={adminEmail} onChange={(e)=>setAdminEmail(e.target.value)} required />
          </div>

          <div className="form-grid">
            <input className="pill-input" type="password" placeholder="Password" value={adminPassword} onChange={(e)=>setAdminPassword(e.target.value)} required />
            <input className="pill-input" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="big-cta" type="submit" disabled={loading}>{loading ? "Creating…" : "Sign Up"}</button>

          <div className="auth-links">
            <span>Already have an account? <button type="button" className="link-btn" onClick={onShowLogin}>Log in</button></span>
          </div>
        </form>

        <div className="auth-features">
          <div className="feature">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="feature-icon"><path d="M12 1l3 6 6 .5-4.5 4 1.5 6L12 15 5 18 6.5 12 2 8l6-.5L12 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div className="feature-title">Role-Based Security</div>
          </div>

          <div className="feature">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="feature-icon"><path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7l-4-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div className="feature-title">Reliable Hosting</div>
          </div>

          <div className="feature">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="feature-icon"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 7v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div className="feature-title">Team Management</div>
          </div>
        </div>
      </div>
    </div>
  );
}
