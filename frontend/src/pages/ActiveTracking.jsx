
import { useState } from 'react'
import './ActiveTracking.css'
import {
  MapPin,
  Package,
  Clock,
  CheckCircle,
  Search,
} from 'lucide-react'

export default function ActiveTracking() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const trackingData = [
    {
      id: 1,
      customer: 'John Smith',
      item: 'Sony Alpha 7 III',
      startDate: 'Nov 27, 2026',
      endDate: 'Nov 30, 2026',
      status: 'Ongoing',
    },
    {
      id: 2,
      customer: 'Maria Santos',
      item: 'Camping Tent',
      startDate: 'Nov 26, 2026',
      endDate: 'Nov 29, 2026',
      status: 'Due Soon',
    },
    {
      id: 3,
      customer: 'Alex Cruz',
      item: 'Heavy Duty Drill',
      startDate: 'Nov 24, 2026',
      endDate: 'Nov 27, 2026',
      status: 'Completed',
    },
  ]

  const filteredData = trackingData.filter((rental) => {
    const matchesSearch =
      rental.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.item.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      activeFilter === 'All' || rental.status === activeFilter

    return matchesSearch && matchesFilter
  })

  const ongoingCount = trackingData.filter(
    (rental) => rental.status === 'Ongoing'
  ).length

  const dueSoonCount = trackingData.filter(
    (rental) => rental.status === 'Due Soon'
  ).length

  const completedCount = trackingData.filter(
    (rental) => rental.status === 'Completed'
  ).length

  return (
    <div className="at-page">
      <div className="at-header">
        <div>
          <h1>Active Tracking</h1>
          <p>Monitor rental activities and track item return schedules.</p>
        </div>
      </div>

      <div className="at-summary">
        <div className="at-summary-card">
          <div className="at-summary-icon ongoing">
            <MapPin size={20} />
          </div>
          <div>
            <p>Ongoing Rentals</p>
            <h2>{ongoingCount}</h2>
          </div>
        </div>

        <div className="at-summary-card">
          <div className="at-summary-icon due">
            <Clock size={20} />
          </div>
          <div>
            <p>Due Soon</p>
            <h2>{dueSoonCount}</h2>
          </div>
        </div>

        <div className="at-summary-card">
          <div className="at-summary-icon completed">
            <CheckCircle size={20} />
          </div>
          <div>
            <p>Completed Rentals</p>
            <h2>{completedCount}</h2>
          </div>
        </div>
      </div>

      <div className="at-content">
        <div className="at-content-header">
          <div>
            <h2>Rental Activities</h2>
            <p>View and monitor current rental records.</p>
          </div>
        </div>

        <div className="at-toolbar">
          <div className="at-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search customer or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="at-table-wrapper">
          <table className="at-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rental Item</th>
                <th>Start Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((rental) => (
                  <tr key={rental.id}>
                    <td>{rental.customer}</td>
                    <td>
                      <Package size={15} />
                      {rental.item}
                    </td>
                    <td>{rental.startDate}</td>
                    <td>{rental.endDate}</td>
                    <td>
                      <span className={`at-status ${rental.status.toLowerCase().replace(' ', '-')}`}>
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="at-empty">
                    No rental activities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
