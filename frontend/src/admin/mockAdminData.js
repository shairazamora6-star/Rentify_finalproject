// Sample data for the Rentify Admin console (demo — same approach as the customer mock data).

export const adminKpis = [
  { id: 'users', label: 'Total users', value: 1284, delta: 12.4, unit: '', icon: 'users' },
  { id: 'rentals', label: 'Active rentals', value: 231, delta: 8.2, unit: '', icon: 'clock' },
  { id: 'revenue', label: 'Monthly revenue', value: 48200, delta: 5.6, unit: '$', icon: 'dollar' },
  { id: 'rating', label: 'Average rating', value: 4.8, delta: -0.1, unit: '', icon: 'star' },
];

// Bookings & revenue for the last six months (Nov 2025 – Apr 2026).
export const adminMonthlyChart = {
  categories: [
    { label: 'Nov 2025', bookings: 312, revenue: 24800 },
    { label: 'Dec 2025', bookings: 389, revenue: 33200 },
    { label: 'Jan 2026', bookings: 264, revenue: 19900 },
    { label: 'Feb 2026', bookings: 298, revenue: 22400 },
    { label: 'Mar 2026', bookings: 341, revenue: 27600 },
    { label: 'Apr 2026', bookings: 407, revenue: 41200 },
  ],
};

// Monthly rentals by category, Apr 2026 (407 bookings). One hue per category, fixed order.
export const adminCategorySeries = [
  { id: 'electronics', label: 'Electronics', total: 128, color: '#3978D5' },
  { id: 'cameras', label: 'Cameras', total: 84, color: '#0E8F5B' },
  { id: 'gaming', label: 'Gaming', total: 67, color: '#D97706' },
  { id: 'tools', label: 'Tools', total: 48, color: '#D9410C' },
  { id: 'sports', label: 'Sports', total: 39, color: '#7C3AED' },
  { id: 'home', label: 'Home', total: 41, color: '#0E8BA8' },
];

const statusBadge = { active: 'Active', upcoming: 'Upcoming', completed: 'Completed', cancelled: 'Cancelled', pending: 'Pending' };

export const adminRentals = [
  { id: 'R-1042', item: 'Canon EOS R5 Camera', customer: 'John Mitchell', dates: 'Nov 28 – Dec 2, 2026', total: 225, status: 'active' },
  { id: 'R-1041', item: 'PlayStation 5 Console', customer: 'Linda Park', dates: 'Nov 25 – Dec 1, 2026', total: 150, status: 'active' },
  { id: 'R-1040', item: 'DJI Mini 3 Pro Drone', customer: 'Omar Haddad', dates: 'Dec 5 – Dec 10, 2026', total: 175, status: 'upcoming' },
  { id: 'R-1039', item: 'MacBook Pro M3', customer: 'Priya Nair', dates: 'Nov 15 – Nov 20, 2026', total: 275, status: 'completed' },
  { id: 'R-1038', item: 'DeWalt Drill Set', customer: 'Tom Baker', dates: 'Nov 12 – Nov 14, 2026', total: 30, status: 'completed' },
  { id: 'R-1037', item: 'Yoga Mat Premium', customer: 'Emma Davis', dates: 'Nov 10 – Nov 12, 2026', total: 24, status: 'cancelled' },
  { id: 'R-1036', item: 'Nintendo Switch OLED', customer: 'Ryan Lee', dates: 'Nov 28 – Nov 30, 2026', total: 40, status: 'active' },
  { id: 'R-1035', item: 'Vintage Film Camera', customer: 'Sofia Reyes', dates: 'Nov 20 – Nov 22, 2026', total: 40, status: 'pending' },
];

export const adminUsers = [
  { id: 'U-01', name: 'John Mitchell', email: 'john.mitchell@email.com', joined: 'Jan 2024', role: 'Customer', status: 'Active', rentals: 12, rating: 4.8 },
  { id: 'U-02', name: 'Marcus Chen', email: 'marcus.chen@email.com', joined: 'Mar 2023', role: 'Owner', status: 'Active', rentals: 41, rating: 4.9 },
  { id: 'U-03', name: 'Sarah Kim', email: 'sarah.kim@email.com', joined: 'Jun 2023', role: 'Owner', status: 'Active', rentals: 58, rating: 4.8 },
  { id: 'U-04', name: 'Linda Park', email: 'linda.park@email.com', joined: 'Sep 2024', role: 'Customer', status: 'Active', rentals: 6, rating: 4.7 },
  { id: 'U-05', name: 'Alex Rivera', email: 'alex.rivera@email.com', joined: 'Feb 2024', role: 'Owner', status: 'Suspended', rentals: 23, rating: 4.4 },
  { id: 'U-06', name: 'Priya Nair', email: 'priya.nair@email.com', joined: 'Nov 2024', role: 'Customer', status: 'Active', rentals: 4, rating: 5.0 },
  { id: 'U-07', name: 'James Wilson', email: 'james.wilson@email.com', joined: 'Jul 2023', role: 'Owner', status: 'Active', rentals: 37, rating: 4.6 },
  { id: 'U-08', name: 'Omar Haddad', email: 'omar.haddad@email.com', joined: 'Apr 2025', role: 'Customer', status: 'Pending review', rentals: 0, rating: null },
];

export const adminItems = [
  { id: 'I-1', title: 'Canon EOS R5 Camera', owner: 'Marcus Chen', price: 45, location: 'San Francisco, CA', status: 'Active', bookings: 128 },
  { id: 'I-2', title: 'PlayStation 5 Console', owner: 'Sarah Kim', price: 25, location: 'Los Angeles, CA', status: 'Active', bookings: 96 },
  { id: 'I-3', title: 'DJI Mini 3 Pro Drone', owner: 'Alex Rivera', price: 35, location: 'Seattle, WA', status: 'Suspended', bookings: 84 },
  { id: 'I-4', title: 'MacBook Pro M3', owner: 'Nina Patel', price: 55, location: 'Chicago, IL', status: 'Active', bookings: 77 },
  { id: 'I-5', title: 'DeWalt Drill Set', owner: 'James Wilson', price: 15, location: 'Austin, TX', status: 'Pending review', bookings: 48 },
  { id: 'I-6', title: 'Yoga Mat Premium', owner: 'Emma Davis', price: 8, location: 'Portland, OR', status: 'Active', bookings: 39 },
  { id: 'I-7', title: 'Nintendo Switch OLED', owner: 'Ryan Lee', price: 20, location: 'Denver, CO', status: 'Active', bookings: 67 },
  { id: 'I-8', title: 'Vintage Film Camera', owner: 'Tom Baker', price: 20, location: 'Brooklyn, NY', status: 'Hidden', bookings: 15 },
];

export { statusBadge };
