import React from "react";

export default function Header({ user, tenant, onLogout, onShowMembers, onShowChangePassword }) {
  return (
    <header>
      {/* <div>
        <h1 className="card__title">Multi-Tenant Notes</h1>
        <div className="card__subtitle tenant-name">{tenant?.name ?? "No tenant"}</div>
      </div> */}

      <div className="header-actions">
        {user ? (
          <>
            <div className="card" style={{ padding: "10px 12px", display: "flex", gap: 12, alignItems: "center" }}>
              <div>
                <div id="userEmail" style={{ fontWeight: 700 }}>{user.email}</div>
                <div id="userRole" className="small">{user.role}</div>
              </div>
            </div>

            <button className="btn btn--small" onClick={onShowMembers}>Manage Team</button>
            <button className="btn btn--small" onClick={onShowChangePassword}>Change Password</button>
            <button className="btn btn--small btn--danger" onClick={onLogout}>Logout</button>
          </>
        ) : null}
      </div>
    </header>
  );
}
