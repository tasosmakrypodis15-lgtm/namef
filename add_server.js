const express = require('express');
const mysql = require('mysql');
const path = require('path');
const axios = require('axios'); // Åäþ âÜëáìå ôï axios ãéá ôï áõôüìáôï ping

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname))); // Óåñâßñåé ôï html óïõ

// Óýíäåóç ìå ôç âÜóç óïõ
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // ÂÜëå ôïí êùäéêü óïõ
    database: 'mygame_db' // ÂÜëå ôï üíïìá ôçò âÜóçò óïõ
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database!');
});

// Ôï Route ðïõ ðáßñíåé ÌÏÍÏ ôï üíïìá êáé ôï âÜæåé óôç âÜóç
app.post('/add-name', (req, res) => {
    const userName = req.body.name;
    
    const query = 'INSERT INTO users (name) VALUES (?)'; 
    db.query(query, [userName], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.status(200).send('Name saved successfully');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log("Server running on port " + PORT);
});

// ==========================================
// ÊÏËÐÏ ÊÅÅP-ALIVE: Ãéá íá ìçí êïéìÜôáé ï Server óôï Render
// ==========================================
setInterval(() => {
    // Åäþ, üôáí ðÜñåéò ôï Ýôïéìï link áðü ôï Render, èá áíôéêáôáóôÞóåéò 
    // ôï "ôï-äéêü-óïõ-site.onrender.com" ìå ôï ðñáãìáôéêü óïõ link!
    const SITE_URL = ''; 
    
    axios.get(SITE_URL)
        .then(() => {
            console.log('Auto-Ping: Ï Server êñÜôçóå ôïí åáõôü ôïõ îýðíéï!');
        })
        .catch((err) => {
            console.error('Auto-Ping Error:', err.message);
        });
}, 600000); // 600.000 milliseconds = 10 ëåðôÜ
