const express = require('express');
const { Pool } = require('pg'); // Αλλάξαμε τη βιβλιοθήκη σε PostgreSQL (pg)
const path = require('path');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname))); 

// ==========================================================
// ΣΥΝΔΕΣΗ ΜΕ ΤΗ ΝΕΑ LIVE ΒΑΣΗ ΣΟΥ ΣΤΟ RENDER
// ==========================================================
// Εδώ, μέσα στα μονά εισαγωγικά '', κάνε επικόλληση (Paste) 
// το δικό σου Internal Database URL που πήρες από το Render!
const connectionString = 'postgresql://my_game_db_zekt_user:dMVmfpMkLD78lRjbxWnWBhbGvlyS1jjo@dpg-d8g3nv3tqb8s73ci7k5g-a/my_game_db_zekt';

const pool = new Pool({
    connectionString: connectionString,
});

pool.connect((err) => {
    if (err) {
        console.error('Σφάλμα σύνδεσης στη βάση του Render:', err.message);
        return;
    }
    console.log('Connected to Render PostgreSQL Database successfully! 🎉');
    
    // Αυτόματη δημιουργία του πίνακα "users" αν δεν υπάρχει ήδη στη νέα βάση
    const createTableQuery = 
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
    ;
    pool.query(createTableQuery, (err) => {
        if (err) console.error('Σφάλμα κατά τη δημιουργία του πίνακα:', err.message);
    });
});

// Το Route για το όνομα
app.post('/add-name', (req, res) => {
    const userName = req.body.name;
    
    const query = 'INSERT INTO users (name) VALUES ($1)'; // Στην pg βάζουμε $1 αντί για ?
    pool.query(query, [userName], (err, result) => {
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

// Keep-alive για να μην κοιμάται ο server
setInterval(() => {
    const SITE_URL = 'https://namef.onrender.com'; 
    axios.get(SITE_URL)
        .then(() => {
            console.log('Auto-Ping: Ο Server κράτησε τον εαυτό του ξύπνιο!');
        })
        .catch((err) => {
            console.error('Auto-Ping Error:', err.message);
        });
}, 600000);
