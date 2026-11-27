import React from 'react';

const rows = [
  ['CP001', 'Mika Santos', 'Incorrect item details', 'Open'],
  ['CP002', 'John Reyes', 'Late return', 'Reviewing'],
  ['CP003', 'Aira Cruz', 'User conduct', 'Resolved']
];

export default function Complaints() {
  return (
    <section className="page">
      <div className="page-title">
        <div>
          <h1>Complaints & Reports</h1>
          <p>Review reports submitted by users.</p>
        </div>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Reported by</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((v, j) => (
                  <td key={j}>
                    {j === 3 ? (
                      <span className={`status ${v.toLowerCase()}`}>
                        {v}
                      </span>
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