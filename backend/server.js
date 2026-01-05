import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:168',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database initialization
let db;

async function initializeDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      nickname TEXT NOT NULL,
      password_hash TEXT,
      avatar TEXT,
      provider TEXT DEFAULT 'local',
      google_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create lessons progress table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id TEXT NOT NULL,
      status TEXT DEFAULT 'not-started',
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      UNIQUE(user_id, lesson_id)
    )
  `);

  console.log('Database initialized successfully');
}

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, nickname, password } = req.body;

    if (!email || !nickname || !password) {
      return res
        .status(400)
        .json({ error: 'Email, nickname, and password are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [
      email,
    ]);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await db.run(
      'INSERT INTO users (email, nickname, password_hash, provider) VALUES (?, ?, ?, ?)',
      [email, nickname, passwordHash, 'local']
    );

    const user = await db.get(
      'SELECT id, email, nickname, avatar, provider, created_at FROM users WHERE id = ?',
      [result.lastID]
    );

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        provider: user.provider,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        provider: user.provider,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google OAuth registration/login
app.post('/api/auth/google', async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body;

    if (!googleId || !email) {
      return res
        .status(400)
        .json({ error: 'Google ID and email are required' });
    }

    // Check if user exists with Google ID
    let user = await db.get('SELECT * FROM users WHERE google_id = ?', [
      googleId,
    ]);

    if (!user) {
      // Check if user exists with email (for migration)
      user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

      if (user) {
        // Update existing user with Google ID
        await db.run(
          'UPDATE users SET google_id = ?, avatar = ?, provider = ? WHERE id = ?',
          [googleId, picture, 'google', user.id]
        );
      } else {
        // Create new user
        const result = await db.run(
          'INSERT INTO users (email, nickname, avatar, provider, google_id) VALUES (?, ?, ?, ?, ?)',
          [email, name || 'Google User', picture, 'google', googleId]
        );
        user = await db.get('SELECT * FROM users WHERE id = ?', [
          result.lastID,
        ]);
      }
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        provider: user.provider,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, email, nickname, avatar, provider, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update lesson progress
app.post('/api/lessons/progress', authenticateToken, async (req, res) => {
  try {
    const { lessonId, status } = req.body;

    if (!lessonId || !status) {
      return res
        .status(400)
        .json({ error: 'Lesson ID and status are required' });
    }

    const validStatuses = ['not-started', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.run(
      `
      INSERT INTO user_lessons (user_id, lesson_id, status, completed_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, lesson_id) 
      DO UPDATE SET status = ?, completed_at = ?
    `,
      [
        req.user.id,
        lessonId,
        status,
        status === 'completed' ? new Date().toISOString() : null,
        status,
        status === 'completed' ? new Date().toISOString() : null,
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user lessons progress
app.get('/api/lessons/progress', authenticateToken, async (req, res) => {
  try {
    const lessons = await db.all(
      'SELECT lesson_id, status, completed_at FROM user_lessons WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ lessons });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
