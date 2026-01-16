/**
 * Vulnerable Payment API
 * WARNING: This application contains intentional security vulnerabilities
 * for testing purposes only. DO NOT use in production.
 */

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// VULNERABILITY: Hardcoded secret key
const JWT_SECRET = 'super_secret_key_12345';
const API_KEY = 'FAKE_API_KEY_abc123xyz789';

// VULNERABILITY: Hardcoded database credentials
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'payments'
};

// VULNERABILITY: SQL Injection
app.get('/api/users', (req, res) => {
  const userId = req.query.id;
  // BAD: Direct string concatenation in SQL query
  const query = `SELECT * FROM users WHERE id = '${userId}'`;

  const connection = mysql.createConnection(dbConfig);
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// VULNERABILITY: Command Injection
app.post('/api/process', (req, res) => {
  const { filename } = req.body;
  // BAD: User input directly in shell command
  const exec = require('child_process').exec;
  exec(`cat /data/${filename}`, (error, stdout) => {
    res.send(stdout);
  });
});

// VULNERABILITY: Path Traversal
app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  // BAD: No path sanitization
  const fs = require('fs');
  const filepath = `/uploads/${filename}`;
  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.status(404).send('File not found');
      return;
    }
    res.send(data);
  });
});

// VULNERABILITY: XSS - Reflected
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  // BAD: Unsanitized user input in HTML response
  res.send(`<html><body>Search results for: ${query}</body></html>`);
});

// VULNERABILITY: Insecure JWT verification
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // BAD: Weak password comparison
  if (username === 'admin' && password === 'password123') {
    // BAD: No algorithm specified, weak secret
    const token = jwt.sign({ user: username, role: 'admin' }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// VULNERABILITY: Insecure random number generation
app.get('/api/token', (req, res) => {
  // BAD: Math.random() is not cryptographically secure
  const token = Math.random().toString(36).substring(2);
  res.json({ token });
});

// VULNERABILITY: Weak cryptography
app.post('/api/encrypt', (req, res) => {
  const { data } = req.body;
  // BAD: MD5 is cryptographically broken
  const hash = crypto.createHash('md5').update(data).digest('hex');
  // BAD: DES is weak encryption
  const cipher = crypto.createCipher('des', 'weak_key');
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  res.json({ hash, encrypted });
});

// VULNERABILITY: Open redirect
app.get('/api/redirect', (req, res) => {
  const url = req.query.url;
  // BAD: Unvalidated redirect
  res.redirect(url);
});

// VULNERABILITY: Information disclosure
app.use((err, req, res, next) => {
  // BAD: Exposing stack traces to users
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    config: dbConfig
  });
});

// VULNERABILITY: No rate limiting, CORS wide open
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // BAD: Logging sensitive info
  console.log(`Database password: ${dbConfig.password}`);
  console.log(`API Key: ${API_KEY}`);
});

module.exports = app;
