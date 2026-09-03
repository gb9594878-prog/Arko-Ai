"use client";

import { useState } from "react";

export default function ApiKeyDialog() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveKey = () => {
    const key = apiKey.trim();

    if (!key) {
      alert("Please enter your API key");
      return;
    }

    // Accept any valid API key format.
    // Do NOT restrict the key to only AIza... keys.
    localStorage.setItem("arko_api_key", key);

    setSaved(true);

    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#1f1f1f",
          border: "1px solid #333",
          borderRadius: "24px",
          padding: "32px",
          color: "white",
        }}
      >
        <h1 style={{ marginBottom: "12px" }}>
          Connect your AI API key
        </h1>

        <p
          style={{
            color: "#aaa",
            fontSize: "17px",
            lineHeight: "1.7",
            marginBottom: "24px",
          }}
        >
          Paste your API key to start chatting with Arko AI.
        </p>

        <div style={{ position: "relative" }}>
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "18px",
              paddingRight: "70px",
              borderRadius: "14px",
              border: "1px solid #555",
              background: "#111",
              color: "white",
              fontSize: "16px",
            }}
          />

          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              bottom: "10px",
              border: "none",
              borderRadius: "10px",
              padding: "0 12px",
              cursor: "pointer",
            }}
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={saveKey}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "17px",
            borderRadius: "14px",
            border: "none",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {saved ? "Key Saved ✓" : "Save key"}
        </button>
      </div>
    </div>
  );
}
