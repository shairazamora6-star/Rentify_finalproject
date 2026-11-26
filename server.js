import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import sql from 'mssql/msnodesqlv8.js';
import nodemailer from 'nodemailer';
import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

dotenv.config({ path: '.env.local' });
dotenv.config();

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

class ExternalApiError extends Error {}

async function requestExternalJson(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) throw new ExternalApiError(`External API returned HTTP ${response.status}`);
    try {
      return await response.json();
    } catch {
      throw new ExternalApiError('External API returned invalid JSON');
    }
  } catch (error) {
    if (error instanceof ExternalApiError) throw error;
    console.error('External API request failed:', error.message);
    throw new ExternalApiError('External API request failed');
  } finally {
    clearTimeout(timeout);
  }
}

function getHttpUrl(value, providerName) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new ExternalApiError(`${providerName} API URL is invalid`);
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new ExternalApiError(`${providerName} API URL must use HTTP or HTTPS`);
  }
  return url;
}

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

IF OBJECT_ID(N'dbo.password_reset_tokens', N'U') IS NULL
CREATE TABLE dbo.password_reset_tokens (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME2 NOT NULL,
  used_at DATETIME2 NULL
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

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
const mailer = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    })
  : null;

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

const listingCityCenters = [
  { city: 'San Francisco', state: 'CA', latitude: 37.7749, longitude: -122.4194, zipPrefixes: ['941'] },
  { city: 'Los Angeles', state: 'CA', latitude: 34.0522, longitude: -118.2437, zipPrefixes: ['900', '901', '902', '903', '904', '905', '906', '907', '908', '910', '911', '912', '913', '914', '915', '916', '917', '918'] },
  { city: 'Austin', state: 'TX', latitude: 30.2672, longitude: -97.7431, zipPrefixes: ['733', '787'] },
  { city: 'Seattle', state: 'WA', latitude: 47.6062, longitude: -122.3321, zipPrefixes: ['981'] },
  { city: 'Portland', state: 'OR', latitude: 45.5152, longitude: -122.6784, zipPrefixes: ['972'] },
  { city: 'Brooklyn', state: 'NY', latitude: 40.6782, longitude: -73.9442, zipPrefixes: ['112'] },
  { city: 'Chicago', state: 'IL', latitude: 41.8781, longitude: -87.6298, zipPrefixes: ['606'] },
  { city: 'Denver', state: 'CO', latitude: 39.7392, longitude: -104.9903, zipPrefixes: ['802'] },
];

function getCityCenter(location) {
  const query = location.trim().toLowerCase();
  const zip = query.match(/^\d{5}$/);
  if (zip) return listingCityCenters.find(city => city.zipPrefixes.some(prefix => zip[0].startsWith(prefix)));
  return listingCityCenters.find(city =>
    query === city.city.toLowerCase() ||
    query === `${city.city.toLowerCase()}, ${city.state.toLowerCase()}` ||
    query === city.state.toLowerCase()
  );
}

function distanceInMiles(fromLat, fromLon, toLat, toLon) {
  const radians = value => value * Math.PI / 180;
  const latitudeDelta = radians(toLat - fromLat);
  const longitudeDelta = radians(toLon - fromLon);
  const a = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(fromLat)) * Math.cos(radians(toLat)) *
    Math.sin(longitudeDelta / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

app.get('/api/nearby', async (req, res, next) => {
  const hasCoordinates = req.query.lat !== undefined || req.query.lon !== undefined;
  let origin;
  try {
    if (hasCoordinates) {
      const latitude = Number(req.query.lat);
      const longitude = Number(req.query.lon);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
          latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({ error: 'Valid latitude and longitude are required' });
      }
      origin = { latitude, longitude, label: 'your selected location' };
    } else if (typeof req.query.location === 'string' && req.query.location.trim()) {
      const locationQuery = req.query.location.trim();
      const locationApiUrl = (process.env.LOCATION_API_URL || '').trim();
      const locationApiKey = (process.env.LOCATION_API_KEY || '').trim();
      if (locationApiUrl || locationApiKey) {
        if (!locationApiUrl || !locationApiKey) {
          return res.status(503).json({ error: 'Set both LOCATION_API_URL and LOCATION_API_KEY to enable external location lookup.' });
        }
        const url = getHttpUrl(locationApiUrl, 'Location');
        url.searchParams.set('q', locationQuery);
        const data = await requestExternalJson(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${locationApiKey}`,
          },
        });
        if (!data || typeof data !== 'object') {
          throw new ExternalApiError('Location API response was invalid');
        }
        const latitude = Number(data.latitude);
        const longitude = Number(data.longitude);
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
            !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
          throw new ExternalApiError('Location API returned invalid coordinates');
        }
        origin = {
          latitude,
          longitude,
          label: typeof data.label === 'string' && data.label.trim() ? data.label.trim() : locationQuery,
        };
      } else {
        const city = getCityCenter(locationQuery);
        if (!city) {
          return res.status(422).json({
            error: 'We could not match that city or ZIP code to a supported listing area.',
          });
        }
        origin = {
          latitude: city.latitude,
          longitude: city.longitude,
          label: `${city.city}, ${city.state}`,
        };
      }
    } else {
      return res.status(400).json({ error: 'Choose a city or provide device coordinates' });
    }

    const result = await pool.request().query('SELECT * FROM dbo.items WHERE available = 1');
    const items = result.recordset
      .map(row => {
        const city = getCityCenter(row.location || '');
        if (!city) return null;
        const approximateDistance = distanceInMiles(origin.latitude, origin.longitude, city.latitude, city.longitude);
        return {
          ...getItem(row),
          approximateDistance: Math.round(approximateDistance * 10) / 10,
        };
      })
      .filter(Boolean)
      .filter(item => item.approximateDistance <= 100)
      .sort((a, b) => a.approximateDistance - b.approximateDistance);
    for (const item of items) {
      item.distance = `~${item.approximateDistance} mi`;
    }
    res.json({ location: origin.label, approximate: true, items });
  } catch (error) { next(error); }
});

app.post('/api/assistant/recommendations', async (req, res, next) => {
  const message = typeof req.body.message === 'string' ? req.body.message.trim().slice(0, 500) : '';
  if (!message) return res.status(400).json({ error: 'Tell us what you are looking to rent' });

  try {
    const result = await pool.request().query('SELECT * FROM dbo.items WHERE available = 1');
    const chatbotApiUrl = (process.env.CHATBOT_API_URL || '').trim();
    const chatbotApiKey = (process.env.CHATBOT_API_KEY || '').trim();
    if (chatbotApiUrl || chatbotApiKey) {
      if (!chatbotApiUrl || !chatbotApiKey) {
        return res.status(503).json({ error: 'Set both CHATBOT_API_URL and CHATBOT_API_KEY to enable the chatbot API.' });
      }
      const data = await requestExternalJson(getHttpUrl(chatbotApiUrl, 'Chatbot'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${chatbotApiKey}`,
        },
        body: JSON.stringify({
          message,
          listings: result.recordset.map(row => ({
            id: row.id,
            title: row.title,
            category: row.category,
            description: row.description,
            price: Number(row.price),
            pricePeriod: row.price_period,
            location: row.location,
          })),
        }),
      });
      if (!data || typeof data.reply !== 'string' || !Array.isArray(data.itemIds)) {
        throw new ExternalApiError('Chatbot API response did not match the configured contract');
      }
      const requestedIds = new Set(data.itemIds.map(Number).filter(Number.isInteger));
      const items = result.recordset.filter(row => requestedIds.has(row.id)).map(getItem);
      return res.json({
        reply: data.reply.slice(0, 1000),
        items,
        external: true,
      });
    }

    const terms = message.toLowerCase().match(/[a-z0-9]+/g) || [];
    const stopWords = new Set(['a', 'an', 'and', 'for', 'i', 'in', 'is', 'it', 'looking', 'need', 'of', 'or', 'rent', 'the', 'to', 'want', 'with']);
    const keywords = terms.filter(term => !stopWords.has(term));
    const budget = message.match(/(?:under|below|less than)\s*\$?(\d+)/i);
    const maxPrice = budget ? Number(budget[1]) : null;
    const ranked = result.recordset
      .map(row => {
        const searchable = `${row.title} ${row.category} ${row.description}`.toLowerCase();
        const score = keywords.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
        return { row, score };
      })
      .filter(({ row, score }) => score > 0 && (maxPrice === null || Number(row.price) <= maxPrice))
      .sort((a, b) => b.score - a.score || Number(b.row.featured) - Number(a.row.featured))
      .slice(0, 3);
    const suggestions = (ranked.length ? ranked.map(({ row }) => row) : result.recordset
      .filter(row => maxPrice === null || Number(row.price) <= maxPrice)
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .slice(0, 3)).map(getItem);
    res.json({
      reply: ranked.length ? 'Here are a few listings that may fit what you need.' : 'I could not find an exact match, but these popular rentals may help.',
      items: suggestions,
      external: false,
    });
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

app.post('/api/auth/forgot-password', async (req, res, next) => {
  if (!mailer) return res.status(503).json({ error: 'Password recovery email is not configured on this server.' });
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!email) return res.status(400).json({ error: 'Email address is required' });

  try {
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id,email FROM dbo.users WHERE LOWER(email)=@email');
    const user = result.recordset[0];
    if (user) {
      const token = randomBytes(32).toString('hex');
      const tokenHash = createHash('sha256').update(token).digest('hex');
      await pool.request()
        .input('userId', sql.Int, user.id)
        .query('UPDATE dbo.password_reset_tokens SET used_at=SYSUTCDATETIME() WHERE user_id=@userId AND used_at IS NULL');
      await pool.request()
        .input('userId', sql.Int, user.id)
        .input('tokenHash', sql.Char(64), tokenHash)
        .query(`INSERT INTO dbo.password_reset_tokens (user_id,token_hash,expires_at)
          VALUES (@userId,@tokenHash,DATEADD(MINUTE,30,SYSUTCDATETIME()))`);
      const baseUrl = (process.env.APP_BASE_URL || 'http://localhost:5173').replace(/\/+$/, '');
      try {
        await mailer.sendMail({
          from: process.env.SMTP_FROM,
          to: user.email,
          subject: 'Reset your Rentify password',
          text: `Use this link within 30 minutes to reset your Rentify password: ${baseUrl}/reset-password?token=${token}`,
          html: `<p>Use the link below within 30 minutes to reset your Rentify password.</p><p><a href="${baseUrl}/reset-password?token=${token}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
        });
      } catch (mailError) {
        await pool.request().input('tokenHash', sql.Char(64), tokenHash)
          .query('UPDATE dbo.password_reset_tokens SET used_at=SYSUTCDATETIME() WHERE token_hash=@tokenHash');
        console.error('Password recovery email delivery failed:', mailError);
        return res.status(503).json({ error: 'We could not send a recovery email right now. Please try again later.' });
      }
    }
    res.json({ message: 'If an account exists for that email, password reset instructions have been sent.' });
  } catch (error) { next(error); }
});

app.post('/api/auth/reset-password', async (req, res, next) => {
  const { token, password } = req.body;
  if (typeof token !== 'string' || !token || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'A valid reset link and a password of at least 6 characters are required.' });
  }
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const transaction = new sql.Transaction(pool);
  let transactionActive = false;
  try {
    await transaction.begin();
    transactionActive = true;
    const tokenResult = await transaction.request()
      .input('tokenHash', sql.Char(64), tokenHash)
      .query(`UPDATE dbo.password_reset_tokens
        SET used_at=SYSUTCDATETIME()
        OUTPUT INSERTED.user_id
        WHERE token_hash=@tokenHash AND used_at IS NULL AND expires_at > SYSUTCDATETIME()`);
    const userId = tokenResult.recordset[0]?.user_id;
    if (!userId) {
      await transaction.rollback();
      transactionActive = false;
      return res.status(400).json({ error: 'This reset link is invalid or has expired. Request a new one.' });
    }
    await transaction.request()
      .input('userId', sql.Int, userId)
      .input('password', sql.NVarChar, hashPassword(password))
      .query('UPDATE dbo.users SET password=@password WHERE id=@userId');
    await transaction.commit();
    transactionActive = false;
    res.json({ message: 'Your password has been updated. You can now sign in.' });
  } catch (error) {
    if (transactionActive) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Password reset transaction rollback failed:', rollbackError);
      }
    }
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
  if (error instanceof ExternalApiError) {
    return res.status(502).json({ error: 'A configured external API request failed.' });
  }
  res.status(500).json({ error: 'SQL Server operation failed' });
});

const port = Number(process.env.PORT || 5175);
app.listen(port, '127.0.0.1', () => {
  console.log(`Rentify API listening on http://localhost:${port}`);
  console.log(`Connected to SQL Server: ${sqlConfig.server}/${sqlConfig.database}`);
});
