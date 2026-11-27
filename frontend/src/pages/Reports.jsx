import React from "react";
export default function Reports() {
  return (
    <section className="page">
      <div className="page-title">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Platform performance and activity summaries.</p>
        </div>
        <button className="primary">Export report</button>
      </div>
      <div className="stats">
        <div className="statcard">
          <span>Total bookings</span>
          <h2>892</h2>
          <small>Across all listings</small>
        </div>
        <div className="statcard">
          <span>Active listings</span>
          <h2>356</h2>
          <small>Currently listed</small>
        </div>
        <div className="statcard">
          <span>Registered users</span>
          <h2>1,248</h2>
          <small>All accounts</small>
        </div>
      </div>
      <div className="panel">
        <h3>Summary</h3>
        <p className="muted">
          Analytics visualizations and export tools can be connected to your
          database later.
        </p>
        <div className="reportbars">
          {[
            ["Bookings", 82],
            ["Listings", 66],
            ["Users", 90],
            ["Reports resolved", 58],
          ].map(([n, v]) => (
            <div className="barrow" key={n}>
              <span>{n}</span>
              <div className="bar">
                <i style={{ width: v + "%" }} />
              </div>
              <b>{v}%</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
