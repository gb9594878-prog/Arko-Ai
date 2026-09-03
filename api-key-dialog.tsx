"use client";

import { useState } from "react";

interface ApiKeyDialogProps {
  initialKey?: string;
  onSave?: (key: string) => void;
  onClose?: () => void;
  dismissible?: boolean;
}

export function ApiKeyDialog({ 
  initialKey = "", 
  onSave, 
  onClose,
  dismissible = true 
}: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState(initialKey);
  const [showKey, setShowKey] = useState(false);

  const saveKey = () => {
    const key = apiKey.trim();
    if (!key) {
      alert("Please enter your API key");
      return;
    }
    // Accept any format - no AIza check
    localStorage.setItem("arko_api_key", key);
    if (onSave) {
      onSave(key);
    } else {
      window.location.reload();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", padding: "20px", zIndex: 9999 }}>
      <div style={{ background: "#111", border: "1px solid #333", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "400px" }}>
        <h2 style={{ color: "white", fontSize: "18px", marginBottom: "8px" }}>Connect API key</h2>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>Enter any API key to start</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", background: "#222", borderRadius: "10px", padding: "8px" }}>
          <input type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter your API key..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white" }} />
          <button onClick={() => setShowKey(!showKey)} style={{ color: "white", background: "transparent", border: "none", fontSize: "12px" }}>{showKey ? "Hide" : "Show"}</button>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {dismissible && onClose && <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "#222", color: "white", borderRadius: "10px", border: "none" }}>Cancel</button>}
          <button onClick={saveKey} style={{ flex: 2, padding: "12px", background: "white", color: "black", borderRadius: "10px", fontWeight: "bold", border: "none" }}>Save key</button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyDialog;
