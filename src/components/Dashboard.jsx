import React from "react";

export default function Dashboard({ user, subscription, onCreateNote, onUpgrade }) {
  const percent =
    subscription.noteLimit === -1
      ? 0
      : Math.min((subscription.noteCount / subscription.noteLimit) * 100, 100);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Full-width subscription card (keeps original look) */}
      <div style={{ width: "25%" }} className="subscription-card card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h3 id="planName" style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
              {subscription.plan === "free" ? "Free Plan" : "Pro Plan"}
            </h3>
            <div id="planDescription" className="card__subtitle" style={{ marginTop: 6 }}>
              {subscription.plan === "free" ? "Limited to 3 notes" : "Unlimited notes"}
            </div>

            <div className="usage-stats" style={{ marginTop: 12 }}>
              <div>
                <strong id="noteCount">{subscription.noteCount}</strong> of{" "}
                <strong id="noteLimit">
                  {subscription.noteLimit === -1 ? "∞" : subscription.noteLimit}
                </strong>{" "}
                notes used
              </div>

              <div className="usage-bar" style={{ marginTop: 8 }}>
                <div
                  id="usageProgress"
                  className="usage-progress"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            {subscription.plan === "free" && user?.role === "Admin" ? (
              <button className="btn" id="upgradePlan" onClick={onUpgrade}>
                Upgrade to Pro
              </button>
            ) : (
              <div className="small text-muted">Plan: {subscription.plan}</div>
            )}
          </div>
        </div>
      </div>

      {/* Header row: left = (small summary or empty), center = title, right = CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 12,
          padding: "8px 2px",
        }}
      >
        {/* Left column: keep compact subscription summary or leave blank */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          {/* Optionally show a small pill summary — uncomment if desired */}
          {/* <div style={{ background: "rgba(0,0,0,0.03)", padding: "8px 12px", borderRadius: 10 }}>
            <strong style={{ display: "block" }}>{subscription.plan === "free" ? "Free" : "Pro"}</strong>
            <small className="small text-muted">Plan</small>
          </div> */}
        </div>

        {/* Center column: title */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>Your Notes</h2>
        </div>

        {/* Right column: create button aligned to end */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn" onClick={onCreateNote}>
            Create Note
          </button>
        </div>
      </div>

      {/* Notes grid area (keeps original notes list rendering by parent) */}
      {/* If you render notes here directly, keep existing NotesList component below this header */}
    </section>
  );
}
