import React from "react";
import {
  Users,
  Package,
  CalendarCheck,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
const activity = [
  ["Mika Santos", "Camera listing", "Pending"],
  ["John Reyes", "Bike rental", "Approved"],
  ["Aira Cruz", "Tent listing", "Pending"],
  ["Mark Dela", "Laptop listing", "Approved"],
];
export default function Dashboard() {
  return (
    <section className="page">
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of Rentify.</p>
        </div>
        <button className="primary">+ Add listing</button>
      </div>
      <div className="stats">
        <StatCard
          title="Total Users"
          value="1,248"
          change="+12% this month"
          Icon={Users}
          color="#6366f1"
        />
        <StatCard
          title="Rental Listings"
          value="356"
          change="+8% this month"
          Icon={Package}
          color="#0d9488"
        />
        <StatCard
          title="Bookings"
          value="892"
          change="+16% this month"
          Icon={CalendarCheck}
          color="#f59e0b"
        />
        <StatCard
          title="Revenue"
          value="₱48,250"
          change="+10% this month"
          Icon={Wallet}
          color="#ec4899"
        />
      </div>
      <div className="content-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Rental activity</h3>
              <p>Overview of recent platform activity</p>
            </div>
            <span className="tag">This month</span>
          </div>
          <div className="chart">
            <div className="chart-y">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            <div className="chart-area">
              <div className="gridlines"></div>
              <svg viewBox="0 0 700 230" preserveAspectRatio="none">
                <polyline
                  points="0,190 90,160 170,175 260,115 350,140 440,75 530,105 620,42 700,65"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="0,205 90,190 170,145 260,165 350,105 440,120 530,70 620,100 700,35"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="chart-x">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </div>
          <div className="legend">
            <span>
              <i className="dot teal"></i>Bookings
            </span>
            <span>
              <i className="dot purple"></i>Listings
            </span>
          </div>
        </div>
        <div className="panel">
          <div className="panel-heading">
            <h3>Quick overview</h3>
          </div>
          <div className="quick">
            <div>
              <span>Pending listings</span>
              <strong>18</strong>
            </div>
            <div>
              <span>Active users</span>
              <strong>1,102</strong>
            </div>
            <div>
              <span>Open reports</span>
              <strong>6</strong>
            </div>
            <div>
              <span>Completed bookings</span>
              <strong>724</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h3>Recent activity</h3>
            <p>Latest rental listing activity</p>
          </div>
          <button className="textbtn">
            View all <ArrowUpRight size={15} />
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Listing</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td>
                <td>{r[1]}</td>
                <td>
                  <span className={`status ${r[2].toLowerCase()}`}>{r[2]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
