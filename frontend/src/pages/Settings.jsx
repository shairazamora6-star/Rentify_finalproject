import React, { useState } from "react";
export default function Settings() {
  const [name, setName] = useState("Administrator");
  const [email, setEmail] = useState("admin@rentify.com");
  return (
    <section className="page">
      <div className="page-title">
        <div>
          <h1>Settings</h1>
          <p>Manage your admin profile and preferences.</p>
        </div>
      </div>
      <div className="panel settings-panel">
        <h3>Admin profile</h3>
        <label>
          Display name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email address
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" placeholder="Enter new password" />
        </label>
        <button
          className="primary"
          onClick={() => alert("Demo only: connect backend to save settings.")}
        >
          Save changes
        </button>
      </div>
    </section>
  );
}
