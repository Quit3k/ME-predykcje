const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT, password TEXT)");
});

app.post('/register', (req, res) => {
    const { login, password } = req.body;
    db.run(`INSERT INTO users(login, password) VALUES(?, ?)`, [login, password], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Rejestracja nieudana' });
        }
        res.json({ success: true, userId: this.lastID });
    });
});

app.post('/login', (req, res) => {
    const { login, password } = req.body;
    db.get(`SELECT * FROM users WHERE login = ? AND password = ?`, [login, password], (err, row) => {
        if (err || !row) {
            return res.status(401).json({ success: false, message: 'Błędny login lub hasło' });
        }
        res.json({ success: true, userId: row.id });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
