const express = require('express');
const mysql = require('mysql');
const path = require('path');
const axios = require('axios'); // Εδώ βάλαμε το axios για το αυτόματο ping

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname))); // Σερβίρει το html σου

// Σύνδεση με τη βάση σου
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Βάλε τον κωδικό σου
    database: 'mygame_db' // Βάλε το όνομα της βάσης σου
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database!');
});

// Το Route που παίρνει ΜΟΝΟ το όνομα και το βάζει στη βάση
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
    console.log(Server running on port ${PORT});
});

// ==========================================
// ΚΟΛΠΟ ΚΕΕP-ALIVE: Για να μην κοιμάται ο Server στο Render
// ==========================================
setInterval(() => {
    // Εδώ, όταν πάρεις το έτοιμο link από το Render, θα αντικαταστήσεις 
    // το "το-δικό-σου-site.onrender.com" με το πραγματικό σου link!
    const SITE_URL = ''; 
    
    axios.get(SITE_URL)
        .then(() => {
            console.log('Auto-Ping: Ο Server κράτησε τον εαυτό του ξύπνιο!');
        })
        .catch((err) => {
            console.error('Auto-Ping Error:', err.message);
        });
}, 600000); // 600.000 milliseconds = 10 λεπτά