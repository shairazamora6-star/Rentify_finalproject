import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Package,
  Tag,
  User,
  CalendarCheck,
  Navigation,
} from 'lucide-react'
import './AdminRentalRequests.css'

// ── Sample Data ─────────────────────────────────────────────
const ALL_REQUESTS = [
  {
    id: 1,
    customer: 'Mia Reyes',
    avatar: 'MR',
    avatarColor: '#6366F1',
    item: 'Sony Alpha 7 III Camera',
    category: 'Cameras',
    date: 'Nov 29 �� Dec 3, 2026',
    duration: '5 days',
    message: 'Hi! I need this for a family portrait session this weekend. Will handle with care.',
    price: 2225,
    status: 'pending',
    timeAgo: '12m ago',
    location: 'Quezon City',
  },
  {
    id: 2,
    customer: 'Paolo Cruz',
    avatar: 'PC',
    avatarColor: '#0EA5E9',
    item: 'DJI Mini 3 Pro Drone',
    category: 'Drones',
    date: 'Nov 30 – Dec 2, 2026',
    duration: '3 days',
    message: 'Need this for an aerial photography project. I have experience with DJI drones.',
    price: 1200,
    status: 'pending',
    timeAgo: '45m ago',
    location: 'Makati City',
  },
  {
    id: 3,
    customer: 'Ana Lim',
    avatar: 'AL',
    avatarColor: '#10B981',
    item: 'Coleman Sundome Tent',
    category: 'Outdoor',
    date: 'Dec 5 – Dec 8, 2026',
    duration: '4 days',
    message: 'Going on a camping trip with friends. Need a reliable 4-person tent for the weekend.',
    price: 800,
    status: 'pending',
    timeAgo: '2h ago',
    location: 'Pasig City',
  },
  {
    id: 4,
    customer: 'Marco Santos',
    avatar: 'MS',
    avatarColor: '#F97316',
    item: 'Canon EOS R5',
    category: 'Cameras',
    date: 'Dec 1 – Dec 4, 2026',
    duration: '4 days',
    message: 'Wedding photography shoot. Will return promptly and in good condition.',
    price: 2080,
    status: 'accepted',
    timeAgo: '1d ago',
    location: 'Taguig City',
  },
  {
    id: 5,
    customer: 'Lea Garcia',
    avatar: 'LG',
    avatarColor: '#7C3AED',
    item: 'Fujifilm X-T4',
    category: 'Cameras',
    date: 'Nov 28 – Nov 30, 2026',
    duration: '3 days',
    message: 'Street photography workshop. Already familiar with Fujifilm systems.',
    price: 1170,
    status: 'accepted',
    timeAgo: '2d ago',
    location: 'Mandaluyong',
  },
  {
    id: 6,
    customer: 'Ben Torres',
    avatar: 'BT',
    avatarColor: '#EF4444',
    item: 'DJI Mini 3 Pro Drone',
    category: 'Drones',
    date: 'Nov 25 – Nov 26, 2026',
    duration: '2 days',
    message: 'Real estate video. Cancelled because project was postponed.',
    price: 800,
    status: 'declined',
    timeAgo: '3d ago',
    location: 'Pasay City',
  },
]

const TAB_COUNTS = {
  pending:  ALL_REQUESTS.filter(r => r.status === 'pending').length,
  accepted: ALL_REQUESTS.filter(r => r.status === 'accepted').length,
  declined: ALL_REQUESTS.filter(r => r.status === 'declined').length,
}

// ── Helpers ─────────────────────────────────────────────────
function formatPHP(n) {
  return '₱' + n.toLocaleString()
}

// ── Main Component ───────────────────────────────────────────
export default function AdminRentalRequests() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('pending')
  const [search, setSearch]       = useState('')
  const [requests, setRequests]   = useState(ALL_REQUESTS)

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchTab    = r.status === activeTab
      const matchSearch = search === '' ||
        r.customer.toLowerCase().includes(search.toLowerCase()) ||
        r.item.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })
  }, [requests, activeTab, search])

  function approve(id) {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r)
    )
  }

  function decline(id) {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'declined' } : r)
    )
  }

  // Live counts from local state
  const counts = {
    pending:  requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    declined: requests.filter(r => r.status === 'declined').length,
  }

  return (
    <div className="rr-root">

      {/* ── Page Header ── */}
      <div className="rr-page-header">
        <div>
          <h1 className="rr-page-title">Rental Requests</h1>
          <p className="rr-page-subtitle">Review and manage incoming rental requests from customers.</p>
        </div>
        <div className="rr-header-controls">
          <div className="rr-search-wrap">
            <Search size={15} className="rr-search-icon" />
            <input
              className="rr-search"
              placeholder="Search by customer, item, or category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="rr-filter-btn">
            <Filter size={15} />
            Filter
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="rr-summary-cards">
        <div className="rr-summary-card rr-sc-pending">
          <span className="rr-sc-icon"><Clock size={20} /></span>
          <div>
            <p className="rr-sc-label">Pending</p>
            <p className="rr-sc-value">{counts.pending}</p>
          </div>
        </div>
        <div className="rr-summary-card rr-sc-accepted">
          <span className="rr-sc-icon"><CheckCircle2 size={20} /></span>
          <div>
            <p className="rr-sc-label">Accepted</p>
            <p className="rr-sc-value">{counts.accepted}</p>
          </div>
        </div>
        <div className="rr-summary-card rr-sc-declined">
          <span className="rr-sc-icon"><XCircle size={20} /></span>
          <div>
            <p className="rr-sc-label">Declined</p>
            <p className="rr-sc-value">{counts.declined}</p>
          </div>
        </div>
        <div className="rr-summary-card rr-sc-total">
          <span className="rr-sc-icon"><Package size={20} /></span>
          <div>
            <p className="rr-sc-label">Total Requests</p>
            <p className="rr-sc-value">{requests.length}</p>
          </div>
        </div>
      </div>

      {/* ── Main Card ── */}
      <div className="rr-main-card">
        <div className="rr-card-header">
          <div>
            <h2 className="rr-card-title">Rental Requests Management</h2>
            <p className="rr-card-subtitle">Review customer requests and take action.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="rr-tabs-bar">
          {[
            { key: 'pending',  label: 'Pending',  color: 'orange' },
            { key: 'accepted', label: 'Accepted', color: 'green'  },
            { key: 'declined', label: 'Declined', color: 'red'    },
          ].map(t => (
            <button
              key={t.key}
              className={`rr-tab ${activeTab === t.key ? 'rr-tab-active' : ''}`}
              onClick={() => setActiveTab(t.key)}
              data-color={t.color}
            >
              {t.label}
              <span className={`rr-tab-count rr-tc-${t.color}`}>{counts[t.key]}</span>
            </button>
          ))}
        </div>

        {/* Request list — each item is its own card */}
        <div className="rr-list">
          {filtered.length === 0 ? (
            <div className="rr-empty">
              <CheckCircle2 size={36} color="#CBD5E1" />
              <p>No {activeTab} requests</p>
            </div>
          ) : (
            filtered.map(req => (
              <div key={req.id} className="rr-request-card">

                {/* Top row */}
                <div className="rr-item-top">
                  <div className="rr-customer">
                    <span className="rr-avatar" style={{ background: req.avatarColor }}>
                      {req.avatar}
                    </span>
                    <div className="rr-customer-info">
                      <p className="rr-customer-name">{req.customer}</p>
                      <p className="rr-item-name">{req.item}</p>
                    </div>
                  </div>
                  <div className="rr-meta-right">
                    <span className="rr-price">{formatPHP(req.price)}</span>
                    <span className={`rr-status-badge rr-status-${req.status}`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                    <span className="rr-time-ago">{req.timeAgo}</span>
                  </div>
                </div>

                {/* Detail chips — blue theme */}
                <div className="rr-chips">
                  <span className="rr-chip rr-chip-blue">
                    <Calendar size={12} />
                    {req.date}
                  </span>
                  <span className="rr-chip rr-chip-blue">
                    <Clock size={12} />
                    {req.duration}
                  </span>
                  <span className="rr-chip rr-chip-blue">
                    <Tag size={12} />
                    {req.category}
                  </span>
                  <span className="rr-chip rr-chip-blue">
                    <MapPin size={12} />
                    {req.location}
                  </span>
                </div>

                {/* Customer note */}
                <p className="rr-note">"{req.message}"</p>

                {/* Actions */}
                {req.status === 'pending' && (
                  <div className="rr-actions">
                    <button
                      className="rr-btn-decline"
                      onClick={() => decline(req.id)}
                    >
                      <XCircle size={14} />
                      Decline
                    </button>
                    <button
                      className="rr-btn-approve"
                      onClick={() => approve(req.id)}
                    >
                      <CheckCircle2 size={14} />
                      Approve
                    </button>
                  </div>
                )}

                {req.status === 'accepted' && (
                  <div className="rr-actions">
                    <span className="rr-accepted-note">
                      <CheckCircle2 size={14} color="#059669" />
                      Request approved — booking confirmed
                    </span>
                    <button
                      className="rr-btn-view"
                      onClick={() => navigate('/admin/bookings')}
                    >
                      View Booking
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}

                {req.status === 'declined' && (
                  <div className="rr-actions">
                    <span className="rr-declined-note">
                      <XCircle size={14} color="#DC2626" />
                      Request declined
                    </span>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Bottom two panels: Bookings + Active Tracking ── */}
      <div className="rr-bottom-grid">

        {/* Bookings quick panel */}
        <div className="rr-info-card">
          <div className="rr-info-header">
            <div className="rr-info-icon rr-info-blue">
              <CalendarCheck size={18} />
            </div>
            <div>
              <h3 className="rr-info-title">Bookings</h3>
              <p className="rr-info-sub">Confirmed rentals in progress</p>
            </div>
          </div>
          <div className="rr-info-stats">
            <div className="rr-info-stat">
              <span className="rr-info-stat-value">4</span>
              <span className="rr-info-stat-label">Active</span>
            </div>
            <div className="rr-info-stat-div" />
            <div className="rr-info-stat">
              <span className="rr-info-stat-value">2</span>
              <span className="rr-info-stat-label">Upcoming</span>
            </div>
            <div className="rr-info-stat-div" />
            <div className="rr-info-stat">
              <span className="rr-info-stat-value">12</span>
              <span className="rr-info-stat-label">Completed</span>
            </div>
          </div>
          <button
            className="rr-info-link"
            onClick={() => navigate('/admin/bookings')}
          >
            View all bookings <ChevronRight size={14} />
          </button>
        </div>

        {/* Active Tracking quick panel */}
        <div className="rr-info-card">
          <div className="rr-info-header">
            <div className="rr-info-icon rr-info-violet">
              <Navigation size={18} />
            </div>
            <div>
              <h3 className="rr-info-title">Active Tracking</h3>
              <p className="rr-info-sub">Items currently on rental</p>
            </div>
          </div>
          <div className="rr-tracking-list">
            {[
              { item: 'Sony Alpha 7 III Camera', due: 'Dec 3, 2026', color: '#6366F1' },
              { item: 'Canon EOS R5',            due: 'Dec 4, 2026', color: '#0EA5E9' },
              { item: 'DJI Mini 3 Pro Drone',    due: 'Dec 2, 2026', color: '#10B981' },
            ].map(t => (
              <div key={t.item} className="rr-tracking-item">
                <span className="rr-tracking-dot" style={{ background: t.color }} />
                <div className="rr-tracking-info">
                  <p className="rr-tracking-name">{t.item}</p>
                  <p className="rr-tracking-due">Due: {t.due}</p>
                </div>
                <button
                  className="rr-track-btn"
                  onClick={() => navigate('/admin/active-tracking')}
                >
                  Track
                </button>
              </div>
            ))}
          </div>
          <button
            className="rr-info-link"
            onClick={() => navigate('/admin/active-tracking')}
          >
            View active tracking <ChevronRight size={14} />
          </button>
        </div>

      </div>
    </div>
  )
}
