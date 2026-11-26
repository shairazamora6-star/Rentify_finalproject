import express from 'express';
import cors from 'cors';
import sql from 'mssql/msnodesqlv8.js';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

const sqlConfig = {
  server: process.env.SQL_SERVER || 'YURICHIEE\\SQL_VER2',
  database: process.env.SQL_DATABASE || 'RentifyDB',
  dialect: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

const pool = await sql.connect(sqlConfig);

await pool.request().batch(`
IF OBJECT_ID(N'dbo.users', N'U') IS NULL
CREATE TABLE dbo.users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  email NVARCHAR(255) NOT NULL UNIQUE,
  password NVARCHAR(255) NOT NULL,
  location NVARCHAR(255) DEFAULT 'San Francisco, CA',
  avatar NVARCHAR(10)
);

IF OBJECT_ID(N'dbo.items', N'U') IS NULL
CREATE TABLE dbo.items (
  id INT PRIMARY KEY,
  title NVARCHAR(255) NOT NULL,
  category NVARCHAR(50) NOT NULL,
  image NVARCHAR(1000) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  price_period NVARCHAR(20) NOT NULL DEFAULT 'day',
  rating DECIMAL(3,1) DEFAULT 0,
  reviews INT DEFAULT 0,
  owner_name NVARCHAR(100),
  owner_avatar NVARCHAR(10),
  location NVARCHAR(255),
  distance NVARCHAR(50),
  featured BIT DEFAULT 0,
  description NVARCHAR(MAX),
  features NVARCHAR(MAX),
  available BIT DEFAULT 1
);

IF OBJECT_ID(N'dbo.rentals', N'U') IS NULL
CREATE TABLE dbo.rentals (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  start_date DATETIME2,
  end_date DATETIME2,
  total DECIMAL(10,2) NOT NULL,
  status NVARCHAR(20) DEFAULT 'upcoming',
  created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

IF OBJECT_ID(N'dbo.favorites', N'U') IS NULL
CREATE TABLE dbo.favorites (
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  PRIMARY KEY (user_id, item_id)
);
`);

const seedItems = [
  [1,'Canon EOS R5 Camera','cameras','https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',45,'Marcus Chen','MC','San Francisco, CA','2.3 mi',1,'Professional mirrorless camera with 8K video capability.',['8K Video','45MP Sensor','IBIS','Dual Card Slots']],
  [2,'PlayStation 5 Console','gaming','https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop',25,'Sarah Kim','SK','Los Angeles, CA','5.1 mi',1,'Next-gen gaming console with stunning graphics.',['4K Gaming','825GB SSD','Ray Tracing','HDMI 2.1']],
  [3,'DeWalt Drill Set','tools','https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',15,'James Wilson','JW','Austin, TX','1.8 mi',0,'Heavy-duty cordless drill with bit set.',['20V MAX','Brushless Motor','2-Bit Set','Carrying Case']],
  [4,'DJI Mini 3 Pro Drone','electronics','https://images.unsplash.com/photo-1473968512647-3e4de7cec8ac?w=800&h=600&fit=crop',35,'Alex Rivera','AR','Seattle, WA','3.2 mi',1,'Compact drone with 4K HDR video.',['4K HDR','34min Flight','Obstacle Avoidance','Foldable']],
  [5,'Yoga Mat Premium','sports','https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=600&fit=crop',8,'Emma Davis','ED','Portland, OR','4.5 mi',0,'Extra thick non-slip yoga mat.',['6mm Thick','Non-slip','ECO Material','Carry Strap']],
  [6,'Vintage Film Camera','cameras','https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',20,'Tom Baker','TB','Brooklyn, NY','6.0 mi',0,'Classic 35mm film camera in excellent condition.',['35mm Film','Fixed Lens','Light Meter','Hard Case']],
  [7,'MacBook Pro M3','electronics','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',55,'Nina Patel','NP','Chicago, IL','1.2 mi',1,'Latest MacBook Pro with M3 chip.',['M3 Chip','16GB RAM','512GB SSD','14 inch Display']],
  [8,'Nintendo Switch OLED','gaming','https://images.unsplash.com/photo-1578303512597-81e6cccb5e37?w=800&h=600&fit=crop',20,'Ryan Lee','RL','Denver, CO','3.7 mi',0,'OLED model with vibrant screen.',['7 inch OLED','64GB Storage','Enhanced Audio','Wide Stand']],
];

const itemCount = await pool.request().query('SELECT COUNT(*) AS count FROM dbo.items');
if (itemCount.recordset[0].count === 0) {
  for (const item of seedItems) {
    const [id,title,category,image,price,ownerName,ownerAvatar,location,distance,featured,description,features] = item;
    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, title)
      .input('category', sql.NVarChar, category)
      .input('image', sql.NVarChar, image)
      .input('price', sql.Decimal(10,2), price)
      .input('ownerName', sql.NVarChar, ownerName)
      .input('ownerAvatar', sql.NVarChar, ownerAvatar)
      .input('location', sql.NVarChar, location)
      .input('distance', sql.NVarChar, distance)
      .input('featured', sql.Bit, featured)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('features', sql.NVarChar(sql.MAX), JSON.stringify(features))
      .query(`INSERT INTO dbo.items
        (id,title,category,image,price,price_period,rating,reviews,owner_name,owner_avatar,location,distance,featured,description,features)
        VALUES (@id,@title,@category,@image,@price,'day',4.8,20,@ownerName,@ownerAvatar,@location,@distance,@featured,@description,@features)`);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored?.includes(':')) return false;
  const [salt, storedHash] = stored.split(':');
  const actual = pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const expected = Buffer.from(storedHash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function getItem(row) {
  if (!row) return row;
  let features = [];
  try { features = JSON.parse(row.features || '[]'); } catch { features = []; }
  return {
    ...row,
    price: Number(row.price),
    rating: Number(row.rating),
    pricePeriod: row.price_period,
    owner: {
      name: row.owner_name,
      avatar: row.owner_avatar,
      verified: true,
      memberSince: '2023',
      responseRate: '98%',
    },
    ownerAvatar: row.owner_avatar,
    featured: Boolean(row.featured),
    available: Boolean(row.available),
    features,
  };
}

app.get('/api/health', (_req, res) => res.json({ ok: true, database: 'SQL Server', name: 'RentifyDB' }));

app.get('/api/items', async (_req, res, next) => {
  try {
    const result = await pool.request().query('SELECT * FROM dbo.items ORDER BY featured DESC, id');
    res.json(result.recordset.map(getItem));
  } catch (error) { next(error); }
});

app.get('/api/items/:id', async (req, res, next) => {
  try {
    const result = await pool.request().input('id', sql.Int, req.params.id)
      .query('SELECT * FROM dbo.items WHERE id = @id');
    if (!result.recordset[0]) return res.status(404).json({ error: 'Item not found' });
    res.json(getItem(result.recordset[0]));
  } catch (error) { next(error); }
});

app.post('/api/auth/register', async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
  try {
    const avatar = name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email.toLowerCase())
      .input('password', sql.NVarChar, hashPassword(password))
      .input('avatar', sql.NVarChar, avatar)
      .query(`INSERT INTO dbo.users (name,email,password,avatar)
        OUTPUT INSERTED.id,INSERTED.name,INSERTED.email,INSERTED.location,INSERTED.avatar
        VALUES (@name,@email,@password,@avatar)`);
    res.status(201).json({ user: result.recordset[0] });
  } catch (error) {
    if (error.number === 2627 || error.number === 2601) return res.status(409).json({ error: 'An account with this email already exists' });
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await pool.request()
      .input('email', sql.NVarChar, (email || '').toLowerCase())
      .query(`SELECT id,name,email,location,avatar,password
        FROM dbo.users WHERE LOWER(email)=@email`);
    const stored = result.recordset[0];
    if (!stored || !verifyPassword(password || '', stored.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const { password: _password, ...user } = stored;
    res.json({ user });
  } catch (error) { next(error); }
});

app.get('/api/rentals/:userId', async (req, res, next) => {
  try {
    const result = await pool.request().input('userId', sql.Int, req.params.userId).query(`
      SELECT rentals.*, items.title, items.image, items.price
      FROM dbo.rentals rentals
      JOIN dbo.items items ON items.id = rentals.item_id
      WHERE rentals.user_id = @userId
      ORDER BY rentals.created_at DESC`);
    res.json(result.recordset);
  } catch (error) { next(error); }
});

app.post('/api/rentals', async (req, res, next) => {
  try {
    const { userId, itemId, startDate, endDate, total } = req.body;
    if (!userId || !itemId || !startDate || !endDate) return res.status(400).json({ error: 'Incomplete rental details' });
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('itemId', sql.Int, itemId)
      .input('startDate', sql.DateTime2, new Date(startDate))
      .input('endDate', sql.DateTime2, new Date(endDate))
      .input('total', sql.Decimal(10,2), total)
      .query(`INSERT INTO dbo.rentals (user_id,item_id,start_date,end_date,total,status)
        OUTPUT INSERTED.*
        VALUES (@userId,@itemId,@startDate,@endDate,@total,'upcoming')`);
    res.status(201).json(result.recordset[0]);
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'SQL Server operation failed' });
});

const port = Number(process.env.PORT || 5175);
app.listen(port, '127.0.0.1', () => {
  console.log(`Rentify API listening on http://localhost:${port}`);
  console.log(`Connected to SQL Server: ${sqlConfig.server}/${sqlConfig.database}`);
});
