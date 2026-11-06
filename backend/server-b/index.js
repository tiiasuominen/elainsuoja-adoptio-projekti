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

app.post('/adoptions', async (req, res) => {
  const { animal_id, applicant_name, email, phone, message } = req.body;

  if (!animal_id || !applicant_name || !email) {
    return res.status(400).json({ error: 'animal_id, applicant_name ja email vaaditaan' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Päivitys onnistuu vain, jos eläin on vielä vapaa
    const upd = await client.query(
      "UPDATE animals SET status = 'adopted' WHERE id = $1 AND status = 'available' RETURNING id, name",
      [animal_id]
    );

    if (upd.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Eläin on jo adoptoitu tai sitä ei löydy' });
    }

    const ins = await client.query(
      `INSERT INTO adoptions (animal_id, applicant_name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [animal_id, applicant_name, email, phone || null, message || null]
    );

    await client.query('COMMIT');
    res.status(201).json({
      success: true,
      adoption_id: ins.rows[0].id,
      animal_name: upd.rows[0].name,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Tietokantavirhe' });
  } finally {
    client.release();
  }
});

app.listen(3001, () => {
  console.log('Server B käynnissä portissa 3001');
});