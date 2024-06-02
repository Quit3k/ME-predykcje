const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  // Import cors
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  // Use cors middleware
app.use(bodyParser.json());

let db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT, password TEXT)");
});

app.post('/api/register', (req, res) => {
    console.log('Received /api/register request');
    const { login, password } = req.body;
    db.run(`INSERT INTO users(login, password) VALUES(?, ?)`, [login, password], function(err) {
        if (err) {
            console.error('Error during registration:', err);
            return res.status(500).json({ success: false, message: 'Rejestracja nieudana' });
        }
        console.log('User registered:', { login, userId: this.lastID });
        res.json({ success: true, userId: this.lastID });
    });
});

app.post('/api/login', (req, res) => {
    console.log('Received /api/login request');
    const { login, password } = req.body;
    db.get(`SELECT * FROM users WHERE login = ? AND password = ?`, [login, password], (err, row) => {
        if (err || !row) {
            console.error('Login failed:', err || 'User not found');
            return res.status(401).json({ success: false, message: 'Błędny login lub hasło' });
        }
        console.log('User logged in:', { login, userId: row.id });
        res.json({ success: true, userId: row.id });
    });
});

app.get('/api/test', (req, res) => {
    res.send('API is working');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
