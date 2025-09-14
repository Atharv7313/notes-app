import React from "react";

export default function Toast({ message, type }) {
  const cls = type === "success" ? "toast toast--success" : type === "error" ? "toast toast--error" : "toast";
  return (
    <div className={cls} style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
      <div style={{ padding: "10px 14px", borderRadius: 10, fontWeight: 700 }}>
        {message}
      </div>
    </div>
  );
}
