const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  user: 'shelter',
  password: 'shelter',
  database: 'shelter',
});

// Kaikki eläimet
app.get('/animals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animals ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Tietokantavirhe' });
  }
});

// Yksi eläin
app.get('/animals/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animals WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Eläintä ei löytynyt' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Tietokantavirhe' });
  }
});

// Adoptiohakemus: välitetään Server B:lle
app.post('/animals/:id/adopt', async (req, res) => {
  const { applicant_name, email, phone, message } = req.body;

  if (!applicant_name || !email) {
    return res.status(400).json({ error: 'Nimi ja sähköposti vaaditaan' });
  }

  try {
    const result = await pool.query('SELECT status FROM animals WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Eläintä ei löytynyt' });
    }
    if (result.rows[0].status !== 'available') {
      return res.status(409).json({ error: 'Eläin on jo adoptoitu' });
    }

    const bUrl = process.env.SERVER_B_URL || 'http://localhost:3001';
    let response;
    try {
      response = await fetch(`${bUrl}/adoptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animal_id: Number(req.params.id),
          applicant_name,
          email,
          phone,
          message,
        }),
      });
    } catch (err) {
      console.error('Server B ei vastaa:', err.message);
      return res.status(502).json({ error: 'Adoptiopalvelin ei ole saatavilla' });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Palvelinvirhe' });
  }
});

app.listen(3000, () => {
  console.log('Palvelin käynnissä portissa 3000');
});