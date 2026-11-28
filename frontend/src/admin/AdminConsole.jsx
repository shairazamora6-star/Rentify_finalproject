import { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Clock,
  DollarSign,
  Star,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Search,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { adminKpis, adminMonthlyChart, adminCategorySeries, adminRentals, adminUsers, adminItems, statusBadge } from './mockAdminData';

// --- Components ---

const StatTile = ({ label, value, delta, unit, icon: IconName }) => {
  const isPositive = delta > 0;
  const isNeutral = delta === 0;

  const formattedValue = typeof value === 'number'
    ? (value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value)
    : value;

  const icons = {
    users: Users,
    clock: Clock,
    dollar: DollarSign,
    star: Star
  };
  const Icon = icons[IconName] || AlertCircle;

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{label}</span>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3978D5'
        }}>
          <Icon size={18} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'proportional-nums' }}>
          {unit}{formattedValue}
        </span>
        {!isNeutral && (
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: isPositive ? '#059669' : '#DC2626',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
    </div>
  );
};

const AdminBarChart = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxValue = Math.max(...data.map(d => d.total));
  const chartHeight = 180;

  return (
    <div className="viz-root" style={{ width: '100%', paddingTop: '10px' }}>
      <div style={{
        height: `${chartHeight}px`,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        paddingBottom: '24px',
        borderBottom: '1px solid #E2E8F0',
        position: 'relative'
      }}>
        {/* Y-axis gridlines (recessive hairlines) */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => (
          <div key={p} style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${p * (chartHeight - 24) + 24}px`,
            height: '1px',
            background: '#F1F5F9',
            zIndex: 0
          }} />
        ))}

        {data.map((d, i) => {
          const height = (d.total / maxValue) * (chartHeight - 24);
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={d.id}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: `${height + 32}px`,
                  background: '#1E293B',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontWeight: 600 }}>{d.label}</div>
                  <div style={{ opacity: 0.9 }}>{d.total} bookings</div>
                  <div style={{
                    position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)',
                    width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
                    borderTop: '4px solid #1E293B'
                  }} />
                </div>
              )}

              <div style={{
                width: '100%',
                maxWidth: '24px',
                height: `${height}px`,
                background: d.color,
                borderRadius: '4px 4px 0 0',
                transition: 'opacity 0.2s',
                opacity: hoveredIdx === null || isHovered ? 1 : 0.6,
                cursor: 'pointer'
              }} />

              <div style={{
                position: 'absolute',
                top: `${chartHeight - 20}px`,
                fontSize: '10px',
                color: '#64748B',
                fontWeight: 500,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%'
              }}>
                {d.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table view twin for accessibility */}
      <table className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        <caption>Bookings by Category</caption>
        <thead>
          <tr><th>Category</th><th>Bookings</th></tr>
        </thead>
        <tbody>
          {data.map(d => <tr key={d.id}><td>{d.label}</td><td>{d.total}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
};

const AdminTable = ({ title, data, columns }) => {
  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{title}</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Filter
          </button>
          <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px' }}>
            {data.map((row, i) => (
              <tr key={i} style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '16px 20px', color: '#334155' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Pages ---

const Dashboard = () => {
  // Take top 3 + merge others for a 4-slot accessible chart
  const processedSeries = useMemo(() => {
    const sorted = [...adminCategorySeries].sort((a, b) => b.total - a.total);
    const top3 = sorted.slice(0, 3);
    const others = sorted.slice(3).reduce((acc, curr) => acc + curr.total, 0);
    return [
      ...top3,
      { id: 'others', label: 'Others', total: others, color: '#64748B' }
    ];
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {adminKpis.map(kpi => <StatTile key={kpi.id} {...kpi} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Top Rental Categories</h3>
            <p style={{ fontSize: '13px', color: '#64748B' }}>Number of bookings in the last 30 days</p>
          </div>
          <AdminBarChart data={processedSeries} />
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Revenue Overview</h3>
              <p style={{ fontSize: '13px', color: '#64748B' }}>Monthly revenue trend</p>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#3978D5' }}>$41.2K</div>
          </div>
          {/* Simple sparkline-style trend line */}
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
            {adminMonthlyChart.categories.map((c, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  height: `${(c.revenue / 45000) * 150}px`,
                  background: i === adminMonthlyChart.categories.length - 1 ? '#3978D5' : '#E2E8F0',
                  borderRadius: '2px'
                }} />
                <span style={{ fontSize: '9px', color: '#94A3B8', transform: 'rotate(-45deg)', marginTop: '8px', whiteSpace: 'nowrap' }}>
                  {c.label.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdminTable
        title="Recent Rentals"
        data={adminRentals.slice(0, 5)}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'item', label: 'Item' },
          { key: 'customer', label: 'Customer' },
          { key: 'total', label: 'Total', render: val => `$${val}` },
          { key: 'status', label: 'Status', render: val => (
            <span style={{
              padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
              background: val === 'active' ? '#EAF3FF' : val === 'completed' ? '#ECFDF5' : val === 'pending' ? '#FEF3C7' : '#F1F5F9',
              color: val === 'active' ? '#3978D5' : val === 'completed' ? '#059669' : val === 'pending' ? '#D97706' : '#64748B'
            }}>
              {statusBadge[val] || val}
            </span>
          )}
        ]}
      />
    </div>
  );
};

export default function AdminConsole() {
  const [activeView, setActiveView] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rentals', label: 'Rentals', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'items', label: 'Listing Items', icon: Star },
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard />;
      case 'rentals': return (
        <AdminTable
          title="All Rentals"
          data={adminRentals}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'item', label: 'Item' },
            { key: 'customer', label: 'Customer' },
            { key: 'dates', label: 'Dates' },
            { key: 'total', label: 'Total', render: val => `$${val}` },
            { key: 'status', label: 'Status', render: val => (
              <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                background: val === 'active' ? '#EAF3FF' : val === 'completed' ? '#ECFDF5' : val === 'pending' ? '#FEF3C7' : '#F1F5F9',
                color: val === 'active' ? '#3978D5' : val === 'completed' ? '#059669' : val === 'pending' ? '#D97706' : '#64748B'
              }}>
                {statusBadge[val] || val}
              </span>
            )}
          ]}
        />
      );
      case 'users': return (
        <AdminTable
          title="Platform Users"
          data={adminUsers}
          columns={[
            { key: 'name', label: 'User' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'joined', label: 'Joined' },
            { key: 'status', label: 'Status', render: val => (
              <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                background: val === 'Active' ? '#ECFDF5' : '#FEF2F2',
                color: val === 'Active' ? '#059669' : '#DC2626'
              }}>
                {val}
              </span>
            )}
          ]}
        />
      );
      case 'items': return (
        <AdminTable
          title="Catalog Items"
          data={adminItems}
          columns={[
            { key: 'title', label: 'Item' },
            { key: 'owner', label: 'Owner' },
            { key: 'price', label: 'Price/Day', render: val => `$${val}` },
            { key: 'bookings', label: 'Total Bookings' },
            { key: 'status', label: 'Status', render: val => (
              <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                background: val === 'Active' ? '#ECFDF5' : '#F1F5F9',
                color: val === 'Active' ? '#059669' : '#64748B'
              }}>
                {val}
              </span>
            )}
          ]}
        />
      );
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'white',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        zIndex: 100
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', background: '#3978D5',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              fontWeight: 800, fontSize: '18px'
            }}>R</div>
            <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em' }}>Rentify Admin</span>
          </div>
        </div>

        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? '#EAF3FF' : 'transparent',
                  color: isActive ? '#3978D5' : '#64748B',
                  transition: 'all 0.15s',
                  border: 'none',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3978D5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>AD</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Admin User</span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
              {menuItems.find(i => i.id === activeView)?.label}
            </h1>
            <p style={{ color: '#64748B', fontSize: '14px' }}>Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={16} />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  padding: '10px 16px 10px 36px', borderRadius: '10px', border: '1px solid #E2E8F0',
                  background: 'white', fontSize: '14px', width: '240px'
                }}
              />
            </div>
            <button style={{
              padding: '10px 16px', borderRadius: '10px', background: '#3978D5', color: 'white',
              fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Calendar size={16} /> Today
            </button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
