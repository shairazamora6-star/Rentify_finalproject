import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Plus,
  TrendingUp,
  Package,
  Clock,
  Wallet,
  ChevronRight,
  Eye,
  Filter,
  BarChart2,
  Star,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  MapPin,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  Camera,
  Wind,
  Navigation,
} from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'
import './AdminOverview.css'

// ─── Mock Data ──────────────────────────────────────────────
const RENTAL_REQUESTS = [
  {
    id: 1,
    customer: 'Mia Reyes',
    avatar: 'MR',
    avatarColor: '#6366F1',
    item: 'Sony Alpha 7 III Camera',
    category: 'Cameras',
    date: 'Nov 29 – Dec 3, 2026',
    duration: '5 days',
    message: 'Hi! I need this for a family portrait session this weekend. Will handle with care.',
    price: 2225,
    status: 'pending',
    timeAgo: '12m ago',
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
  },
]

const LISTINGS = [
  {
    id: 1,
    name: 'Sony Alpha 7 III Camera',
    category: 'Cameras',
    price: 445,
    status: 'active',
    image: null,
    color: '#6366F1',
    icon: 'camera',
  },
  {
    id: 2,
    name: 'Canon EOS R5',
    category: 'Cameras',
    price: 520,
    status: 'active',
    image: null,
    color: '#0EA5E9',
    icon: 'camera',
  },
  {
    id: 3,
    name: 'Fujifilm X-T4',
    category: 'Cameras',
    price: 390,
    status: 'paused',
    image: null,
    color: '#F59E0B',
    icon: 'camera',
  },
  {
    id: 4,
    name: 'DJI Mini 3 Pro Drone',
    category: 'Drones',
    price: 400,
    status: 'active',
    image: null,
    color: '#10B981',
    icon: 'drone',
  },
  {
    id: 5,
    name: 'Coleman Sundome Tent',
    category: 'Outdoor',
    price: 200,
    status: 'pending',
    image: null,
    color: '#EC4899',
    icon: 'outdoor',
  },
]

const EARNINGS_DATA = {
  '7days': [
    { label: 'Mon', value: 4200 },
    { label: 'Tue', value: 6800 },
    { label: 'Wed', value: 3900 },
    { label: 'Thu', value: 7200 },
    { label: 'Fri', value: 8900 },
    { label: 'Sat', value: 5600 },
    { label: 'Sun', value: 5750 },
  ],
  '30days': [
    { label: 'W1', value: 9400 },
    { label: 'W2', value: 11200 },
    { label: 'W3', value: 8700 },
    { label: 'W4', value: 13050 },
  ],
  '90days': [
    { label: 'Oct', value: 32000 },
    { label: 'Nov', value: 38500 },
    { label: 'Dec', value: 42350 },
  ],
}

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'booking',
    icon: CheckCircle2,
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
    title: 'Booking confirmed',
    desc: 'Sony Alpha 7 III – Mia Reyes',
    time: '12 min ago',
  },
  {
    id: 2,
    type: 'payment',
    icon: CreditCard,
    iconColor: '#2563EB',
    iconBg: '#DBEAFE',
    title: 'Payment received',
    desc: '₱2,225 · DJI Mini 3 Pro',
    time: '1 hr ago',
  },
  {
    id: 3,
    type: 'return',
    icon: AlertCircle,
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    title: 'Return due tomorrow',
    desc: 'Canon EOS R5 · Paolo Cruz',
    time: '3 hr ago',
  },
  {
    id: 4,
    type: 'review',
    icon: Star,
    iconColor: '#F59E0B',
    iconBg: '#FEF9C3',
    title: 'New 5-star review',
    desc: '"Excellent condition, smooth transaction!"',
    time: 'Yesterday',
  },
]

// ─── Helpers ────────────────────────────────────────────────
function formatPHP(n) {
  return '₱' + n.toLocaleString()
}

function today() {
  return new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="ov-bar-chart">
      {data.map((d) => (
        <div key={d.label} className="ov-bar-col">
          <div className="ov-bar-wrap">
            <div
              className="ov-bar-fill"
              style={{ height: `${Math.round((d.value / max) * 100)}%` }}
              title={formatPHP(d.value)}
            />
          </div>
          <span className="ov-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function ListingIcon({ type, color }) {
  const style = { color }
  if (type === 'drone') return <Wind size={16} style={style} />
  if (type === 'outdoor') return <Navigation size={16} style={style} />
  return <Camera size={16} style={style} />
}

// ─── Main Component ─────────────────────────────────────────
export default function AdminOverview() {
  const navigate = useNavigate()
  const { admin } = useAdmin()

  const [requestTab, setRequestTab] = useState('pending')
  const [listingTab, setListingTab] = useState('all')
  const [earningsRange, setEarningsRange] = useState('7days')
  const [searchQuery, setSearchQuery] = useState('')
  const [listingSearch, setListingSearch] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  const pendingRequests = RENTAL_REQUESTS.filter((r) => r.status === 'pending')

  const filteredListings = useMemo(() => {
    return LISTINGS.filter((l) => {
      const matchTab =
        listingTab === 'all' ||
        l.status === listingTab
      const matchSearch = l.name.toLowerCase().includes(listingSearch.toLowerCase())
      return matchTab && matchSearch
    })
  }, [listingTab, listingSearch])

  const earningsData = EARNINGS_DATA[earningsRange]

  return (
    <div className="ov-root">
      {/* ── Header ── */}
      <div className="ov-header">
        <div className="ov-header-left">
          <h1 className="ov-title">Marketplace Overview</h1>
          <p className="ov-subtitle">Monitor rentals, inventory and customer demand.</p>
        </div>
        <div className="ov-header-right">
          <div className="ov-search-wrap">
            <Search size={15} className="ov-search-icon" />
            <input
              className="ov-search"
              placeholder="Search bookings, items…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ov-notif-wrap">
            <button
              className="ov-notif-btn"
              onClick={() => setNotifOpen((p) => !p)}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="ov-notif-dot" />
            </button>
            {notifOpen && (
              <div className="ov-notif-dropdown">
                <p className="ov-notif-heading">Notifications</p>
                {RECENT_ACTIVITY.slice(0, 3).map((a) => (
                  <div key={a.id} className="ov-notif-item">
                    <span className="ov-notif-item-icon" style={{ background: a.iconBg }}>
                      <a.icon size={14} color={a.iconColor} />
                    </span>
                    <div>
                      <p className="ov-notif-item-title">{a.title}</p>
                      <p className="ov-notif-item-desc">{a.desc}</p>
                    </div>
                  </div>
                ))}
                <button
                  className="ov-notif-view-all"
                  onClick={() => { setNotifOpen(false); navigate('/admin/notifications') }}
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
          <span className="ov-date">{today()}</span>
          <button className="ov-add-btn" onClick={() => navigate('/admin/listings/new')}>
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="ov-stats">
        <div className="ov-stat-card">
          <div className="ov-stat-top">
            <span className="ov-stat-label">Total Earnings</span>
            <span className="ov-stat-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
              <Wallet size={18} />
            </span>
          </div>
          <div className="ov-stat-value">₱12,450</div>
          <div className="ov-stat-change positive">
            <TrendingUp size={13} />
            +12% this month
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-top">
            <span className="ov-stat-label">Active Rentals</span>
            <span className="ov-stat-icon" style={{ background: '#D1FAE5', color: '#059669' }}>
              <Package size={18} />
            </span>
          </div>
          <div className="ov-stat-value">3 Items</div>
          <div className="ov-stat-change muted">
            <ArrowUpRight size={13} />
            2 returns this week
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-top">
            <span className="ov-stat-label">Listed Items</span>
            <span className="ov-stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <BarChart2 size={18} />
            </span>
          </div>
          <div className="ov-stat-value">8 Listings</div>
          <div className="ov-stat-change muted">
            6 active · 1 pending
          </div>
        </div>

        <div className="ov-stat-card">
          <div className="ov-stat-top">
            <span className="ov-stat-label">Pending Requests</span>
            <span className="ov-stat-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
              <Clock size={18} />
            </span>
          </div>
          <div className="ov-stat-value">5 Requests</div>
          <div className="ov-stat-change warning">
            <Clock size={13} />
            Oldest waiting 2h
          </div>
        </div>
      </div>

      {/* ── Mid Row: Requests + Listings ── */}
      <div className="ov-mid-grid">
        {/* Rental Requests */}
        <div className="ov-card ov-requests-card">
          <div className="ov-card-header">
            <h2 className="ov-card-title">Rental Requests</h2>
          </div>
          <div className="ov-tabs">
            <button
              className={`ov-tab ${requestTab === 'pending' ? 'active' : ''}`}
              onClick={() => setRequestTab('pending')}
            >
              Pending
              <span className="ov-tab-badge">5</span>
            </button>
            <button
              className={`ov-tab ${requestTab === 'accepted' ? 'active' : ''}`}
              onClick={() => setRequestTab('accepted')}
            >
              Accepted
            </button>
            <button
              className={`ov-tab ${requestTab === 'declined' ? 'active' : ''}`}
              onClick={() => setRequestTab('declined')}
            >
              Declined
            </button>
          </div>

          <div className="ov-requests-list">
            {requestTab === 'pending' ? (
              pendingRequests.map((req) => (
                <div key={req.id} className="ov-request-item">
                  <div className="ov-request-top">
                    <div className="ov-request-customer">
                      <span
                        className="ov-avatar"
                        style={{ background: req.avatarColor }}
                      >
                        {req.avatar}
                      </span>
                      <div>
                        <p className="ov-request-name">{req.customer}</p>
                        <p className="ov-request-item-name">{req.item}</p>
                      </div>
                    </div>
                    <div className="ov-request-meta">
                      <span className="ov-request-price">{formatPHP(req.price)}</span>
                      <span className="ov-request-time">{req.timeAgo}</span>
                    </div>
                  </div>
                  <div className="ov-request-details">
                    <span className="ov-request-detail-chip">
                      <Calendar size={12} />
                      {req.date}
                    </span>
                    <span className="ov-request-detail-chip">
                      <Clock size={12} />
                      {req.duration}
                    </span>
                    <span className="ov-request-detail-chip">
                      <MapPin size={12} />
                      {req.category}
                    </span>
                  </div>
                  <p className="ov-request-message">"{req.message}"</p>
                  <div className="ov-request-actions">
                    <button
                      className="ov-btn-decline"
                      onClick={() => navigate('/admin/rental-requests')}
                    >
                      Decline
                    </button>
                    <button
                      className="ov-btn-review"
                      onClick={() => navigate('/admin/rental-requests')}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="ov-empty-state">
                <CheckCircle2 size={32} color="#D1D5DB" />
                <p>No {requestTab} requests</p>
              </div>
            )}
          </div>

          <button
            className="ov-view-all-link"
            onClick={() => navigate('/admin/rental-requests')}
          >
            View all rental requests
            <ChevronRight size={15} />
          </button>
        </div>

        {/* My Listings */}
        <div className="ov-card ov-listings-card">
          <div className="ov-card-header">
            <h2 className="ov-card-title">My Listings</h2>
            <button
              className="ov-manage-link"
              onClick={() => navigate('/admin/listings')}
            >
              Manage
            </button>
          </div>
          <div className="ov-tabs">
            {['all', 'active', 'paused', 'pending'].map((t) => (
              <button
                key={t}
                className={`ov-tab ${listingTab === t ? 'active' : ''}`}
                onClick={() => setListingTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="ov-listing-search-wrap">
            <Search size={13} className="ov-listing-search-icon" />
            <input
              className="ov-listing-search"
              placeholder="Search listings…"
              value={listingSearch}
              onChange={(e) => setListingSearch(e.target.value)}
            />
            <button className="ov-listing-filter-btn" title="Filter">
              <Filter size={14} />
            </button>
          </div>

          <div className="ov-listings-list">
            {filteredListings.length === 0 ? (
              <div className="ov-empty-state">
                <Package size={32} color="#D1D5DB" />
                <p>No listings found</p>
              </div>
            ) : (
              filteredListings.map((listing) => (
                <div key={listing.id} className="ov-listing-item">
                  <div
                    className="ov-listing-thumb"
                    style={{ background: listing.color + '20' }}
                  >
                    <ListingIcon type={listing.icon} color={listing.color} />
                  </div>
                  <div className="ov-listing-info">
                    <p className="ov-listing-name">{listing.name}</p>
                    <p className="ov-listing-price">{formatPHP(listing.price)}/day</p>
                  </div>
                  <span className={`ov-listing-status ov-ls-${listing.status}`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>

          <button
            className="ov-add-listing-btn"
            onClick={() => navigate('/admin/listings/new')}
          >
            <Plus size={15} />
            Add new item
          </button>
        </div>
      </div>

      {/* ── Bottom Row: Earnings + Activity ── */}
      <div className="ov-bottom-grid">
        {/* Earnings & Performance */}
        <div className="ov-card ov-earnings-card">
          <div className="ov-card-header">
            <div>
              <h2 className="ov-card-title">Earnings &amp; Performance</h2>
              <p className="ov-card-subtitle">12% increase in October</p>
            </div>
            <div className="ov-earnings-total">
              <span className="ov-earnings-value">₱42,350</span>
              <span className="ov-earnings-label">Total earnings</span>
            </div>
          </div>

          <div className="ov-range-tabs">
            {[['7days', '7 days'], ['30days', '30 days'], ['90days', '90 days']].map(([v, l]) => (
              <button
                key={v}
                className={`ov-range-tab ${earningsRange === v ? 'active' : ''}`}
                onClick={() => setEarningsRange(v)}
              >
                {l}
              </button>
            ))}
          </div>

          <BarChart data={earningsData} />

          <div className="ov-performance-row">
            <div className="ov-perf-item">
              <span className="ov-perf-value">1,247</span>
              <span className="ov-perf-label">Total Views</span>
            </div>
            <div className="ov-perf-divider" />
            <div className="ov-perf-item">
              <span className="ov-perf-value">34</span>
              <span className="ov-perf-label">Inquiries</span>
            </div>
            <div className="ov-perf-divider" />
            <div className="ov-perf-item">
              <span className="ov-perf-value">8.2%</span>
              <span className="ov-perf-label">Conversion</span>
            </div>
          </div>

          <div className="ov-category-row">
            <p className="ov-category-heading">Revenue by category</p>
            <div className="ov-categories">
              {[
                { label: 'Cameras', pct: 60, color: '#2563EB' },
                { label: 'Outdoor', pct: 25, color: '#10B981' },
                { label: 'Drones', pct: 15, color: '#F59E0B' },
              ].map((c) => (
                <div key={c.label} className="ov-cat-item">
                  <div className="ov-cat-label-row">
                    <span className="ov-cat-dot" style={{ background: c.color }} />
                    <span className="ov-cat-label">{c.label}</span>
                    <span className="ov-cat-pct">{c.pct}%</span>
                  </div>
                  <div className="ov-cat-bar">
                    <div
                      className="ov-cat-bar-fill"
                      style={{ width: `${c.pct}%`, background: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="ov-view-all-link"
            onClick={() => navigate('/admin/earnings')}
          >
            View transaction history
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="ov-card ov-activity-card">
          <div className="ov-card-header">
            <h2 className="ov-card-title">Recent Activity</h2>
            <button className="ov-icon-btn" title="More options">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="ov-activity-list">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.id} className="ov-activity-item">
                <span
                  className="ov-activity-icon"
                  style={{ background: a.iconBg }}
                >
                  <a.icon size={16} color={a.iconColor} />
                </span>
                <div className="ov-activity-info">
                  <p className="ov-activity-title">{a.title}</p>
                  <p className="ov-activity-desc">{a.desc}</p>
                </div>
                <span className="ov-activity-time">{a.time}</span>
              </div>
            ))}
          </div>

          {/* Upcoming Return Notification */}
          <div className="ov-upcoming-return">
            <div className="ov-upcoming-top">
              <span className="ov-upcoming-badge">
                <AlertCircle size={13} />
                Upcoming Return
              </span>
            </div>
            <div className="ov-upcoming-body">
              <div className="ov-upcoming-info">
                <p className="ov-upcoming-name">Sony Alpha 7 III</p>
                <p className="ov-upcoming-time">
                  <Clock size={12} />
                  Tomorrow, 10:00 AM
                </p>
              </div>
              <button
                className="ov-track-btn"
                onClick={() => navigate('/admin/active-tracking')}
              >
                Track
              </button>
            </div>
          </div>

          <button
            className="ov-view-all-link"
            onClick={() => navigate('/admin/notifications')}
          >
            View all activity
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
