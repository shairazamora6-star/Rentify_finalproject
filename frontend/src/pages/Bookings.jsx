import React from 'react';

const rows = [
  ['BK001', 'Mika Santos', 'Camera', 'Nov 25, 2026', 'Confirmed'],
  ['BK002', 'John Reyes', 'Bike', 'Nov 24, 2026', 'Completed'],
  ['BK003', 'Aira Cruz', 'Tent', 'Nov 23, 2026', 'Pending'],
  ['BK004', 'Mark Dela', 'Laptop', 'Nov 22, 2026', 'Cancelled']
];

export default function Bookings() {
  return (
    <section className="page">
      <div className="page-title">
        <div>
          <h1>Bookings</h1>
          <p>Track and manage rental transactions.</p>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="toolbar">
          <input placeholder="Search bookings..." />
        </div>

        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Renter</th>
              <th>Item</th>
              <th>Date</th>
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
                      <span className={`status ${v.toLowerCase()}`}>
                        {v}
                      </span>
                    ) : (
                      v
                    )}
                  </td>
                ))}
                <td>
                  <button className="textbtn">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}