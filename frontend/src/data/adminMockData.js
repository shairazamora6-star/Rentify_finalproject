// ============================================================
// ADMIN SAMPLE DATA (DEMO ONLY)
// This is fake data for the frontend demo. It is NOT secure and
// is NOT connected to a database. Replace it with real API calls
// when a backend is added.
// ============================================================

// Demo admin account. Visible in the browser code, so NEVER reuse
// a real password here. A real backend must replace this check.
export const demoAdmin = {
  id: 'admin-1',
  name: 'Rentify Admin',
  email: 'admin@rentify.demo',
  password: 'admin123',
  role: 'admin',
  avatar: 'RA',
};

export const adminUsers = [
  { id: 1, name: 'Marcus Chen', email: 'marcus.chen@email.com', location: 'San Francisco, CA', joined: '2024-01-12', status: 'active', listings: 3, rentals: 14 },
  { id: 2, name: 'Sarah Kim', email: 'sarah.kim@email.com', location: 'Los Angeles, CA', joined: '2024-02-03', status: 'active', listings: 2, rentals: 9 },
  { id: 3, name: 'James Wilson', email: 'james.wilson@email.com', location: 'Austin, TX', joined: '2024-02-21', status: 'active', listings: 1, rentals: 5 },
  { id: 4, name: 'Priya Patel', email: 'priya.patel@email.com', location: 'Seattle, WA', joined: '2024-03-15', status: 'suspended', listings: 0, rentals: 2 },
  { id: 5, name: 'Daniel Brooks', email: 'daniel.brooks@email.com', location: 'Portland, OR', joined: '2024-04-02', status: 'active', listings: 4, rentals: 21 },
  { id: 6, name: 'Elena Rossi', email: 'elena.rossi@email.com', location: 'Brooklyn, NY', joined: '2024-04-28', status: 'pending', listings: 0, rentals: 0 },
  { id: 7, name: 'Tom Nguyen', email: 'tom.nguyen@email.com', location: 'Chicago, IL', joined: '2024-05-19', status: 'active', listings: 2, rentals: 7 },
  { id: 8, name: 'Aisha Khan', email: 'aisha.khan@email.com', location: 'Denver, CO', joined: '2024-06-07', status: 'banned', listings: 1, rentals: 3 },
];

export const adminListings = [
  { id: 1, title: 'Canon EOS R5 Camera', category: 'cameras', owner: 'Marcus Chen', price: 45, location: 'San Francisco, CA', status: 'approved', submitted: '2024-05-02' },
  { id: 2, title: 'PlayStation 5 Console', category: 'gaming', owner: 'Sarah Kim', price: 25, location: 'Los Angeles, CA', status: 'approved', submitted: '2024-05-10' },
  { id: 3, title: 'DeWalt Drill Set', category: 'tools', owner: 'James Wilson', price: 15, location: 'Austin, TX', status: 'approved', submitted: '2024-05-14' },
  { id: 4, title: 'DJI Mini 3 Pro Drone', category: 'electronics', owner: 'Daniel Brooks', price: 35, location: 'Portland, OR', status: 'pending', submitted: '2024-06-01' },
  { id: 5, title: 'Yoga Mat Premium', category: 'sports', owner: 'Tom Nguyen', price: 12, location: 'Chicago, IL', status: 'approved', submitted: '2024-06-03' },
  { id: 6, title: 'Vintage Film Camera', category: 'cameras', owner: 'Marcus Chen', price: 20, location: 'San Francisco, CA', status: 'pending', submitted: '2024-06-09' },
  { id: 7, title: 'MacBook Pro M3', category: 'electronics', owner: 'Daniel Brooks', price: 55, location: 'Portland, OR', status: 'approved', submitted: '2024-06-11' },
  { id: 8, title: 'Nintendo Switch OLED', category: 'gaming', owner: 'Aisha Khan', price: 18, location: 'Denver, CO', status: 'rejected', submitted: '2024-06-15' },
];

export const adminBookings = [
  { id: 'BK-1001', item: 'Canon EOS R5 Camera', renter: 'Tom Nguyen', owner: 'Marcus Chen', startDate: '2024-11-28', endDate: '2024-12-02', total: 225, status: 'active', payment: 'paid' },
  { id: 'BK-1002', item: 'PlayStation 5 Console', renter: 'Daniel Brooks', owner: 'Sarah Kim', startDate: '2024-11-25', endDate: '2024-12-01', total: 150, status: 'active', payment: 'paid' },
  { id: 'BK-1003', item: 'DJI Mini 3 Pro Drone', renter: 'Sarah Kim', owner: 'Daniel Brooks', startDate: '2024-12-05', endDate: '2024-12-10', total: 175, status: 'upcoming', payment: 'paid' },
  { id: 'BK-1004', item: 'MacBook Pro M3', renter: 'Marcus Chen', owner: 'Daniel Brooks', startDate: '2024-11-15', endDate: '2024-11-20', total: 275, status: 'completed', payment: 'paid' },
  { id: 'BK-1005', item: 'Yoga Mat Premium', renter: 'James Wilson', owner: 'Tom Nguyen', startDate: '2024-11-10', endDate: '2024-11-12', total: 24, status: 'completed', payment: 'paid' },
  { id: 'BK-1006', item: 'DeWalt Drill Set', renter: 'Elena Rossi', owner: 'James Wilson', startDate: '2024-12-12', endDate: '2024-12-14', total: 30, status: 'cancelled', payment: 'refunded' },
  { id: 'BK-1007', item: 'Vintage Film Camera', renter: 'Priya Patel', owner: 'Marcus Chen', startDate: '2024-12-18', endDate: '2024-12-20', total: 40, status: 'upcoming', payment: 'pending' },
  { id: 'BK-1008', item: 'Canon EOS R5 Camera', renter: 'Sarah Kim', owner: 'Marcus Chen', startDate: '2024-10-20', endDate: '2024-10-23', total: 135, status: 'completed', payment: 'paid' },
];

export const adminReviews = [
  { id: 1, item: 'Canon EOS R5 Camera', reviewer: 'Sarah Kim', rating: 5, comment: 'Amazing camera, owner was very helpful.', date: '2024-10-24', status: 'published' },
  { id: 2, item: 'MacBook Pro M3', reviewer: 'Marcus Chen', rating: 4, comment: 'Worked great. Battery a little worn.', date: '2024-11-21', status: 'published' },
  { id: 3, item: 'Yoga Mat Premium', reviewer: 'James Wilson', rating: 2, comment: 'Mat was dirty when I picked it up.', date: '2024-11-13', status: 'flagged' },
  { id: 4, item: 'PlayStation 5 Console', reviewer: 'Daniel Brooks', rating: 1, comment: 'Inappropriate language removed by reporter.', date: '2024-11-14', status: 'flagged' },
  { id: 5, item: 'DeWalt Drill Set', reviewer: 'Tom Nguyen', rating: 5, comment: 'Powerful drill, easy pickup.', date: '2024-11-02', status: 'published' },
  { id: 6, item: 'Vintage Film Camera', reviewer: 'Elena Rossi', rating: 3, comment: 'Okay, but the lens had some dust.', date: '2024-11-05', status: 'hidden' },
];

export const adminComplaints = [
  { id: 'CP-201', type: 'Item not as described', reporter: 'James Wilson', against: 'Tom Nguyen', related: 'BK-1005', date: '2024-11-13', priority: 'medium', status: 'open' },
  { id: 'CP-202', type: 'Late return', reporter: 'Marcus Chen', against: 'Priya Patel', related: 'BK-1007', date: '2024-11-16', priority: 'high', status: 'investigating' },
  { id: 'CP-203', type: 'Payment issue', reporter: 'Elena Rossi', against: 'Rentify', related: 'BK-1006', date: '2024-11-17', priority: 'medium', status: 'open' },
  { id: 'CP-204', type: 'Inappropriate behavior', reporter: 'Sarah Kim', against: 'Aisha Khan', related: 'BK-1002', date: '2024-11-18', priority: 'high', status: 'resolved' },
  { id: 'CP-205', type: 'Damaged item', reporter: 'Daniel Brooks', against: 'Sarah Kim', related: 'BK-1003', date: '2024-11-20', priority: 'low', status: 'resolved' },
];

// Monthly numbers for the Reports and Analytics page
export const adminMonthlyStats = [
  { month: 'Jul', revenue: 1850, bookings: 42, newUsers: 18 },
  { month: 'Aug', revenue: 2300, bookings: 51, newUsers: 24 },
  { month: 'Sep', revenue: 2750, bookings: 63, newUsers: 29 },
  { month: 'Oct', revenue: 3400, bookings: 77, newUsers: 35 },
  { month: 'Nov', revenue: 4100, bookings: 92, newUsers: 41 },
];