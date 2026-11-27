import React from "react";
const rows = [
  ["RL001", "Digital Camera", "Mika Santos", "₱500/day", "Pending"],
  ["RL002", "Mountain Bike", "John Reyes", "₱350/day", "Approved"],
  ["RL003", "Camping Tent", "Aira Cruz", "₱250/day", "Pending"],
  ["RL004", "Laptop", "Mark Dela", "₱800/day", "Approved"],
  ["RL005", "Projector", "Nina Flores", "₱600/day", "Rejected"],
];
export default function Rentals() {
  return (
    <section className="page">
      <div className="page-title">
        <div>
          <h1>Rental Listings</h1>
          <p>Review and manage items listed for rent.</p>
        </div>
        <button className="primary">+ Add listing</button>
      </div>
      <div className="panel table-panel">
        <div className="toolbar">
          <input placeholder="Search listings..." />
          <select>
            <option>All statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Owner</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((v, j) => (
                  <td key={j}>
                    {j === 4 ? (
                      <span className={`status ${v.toLowerCase()}`}>{v}</span>
                    ) : (
                      v
                    )}
                  </td>
                ))}
                <td>
                  <button className="textbtn">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
