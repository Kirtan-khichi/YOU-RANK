const express = require('express');
const { Pool } = require('pg');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'yourankdatabase',
  password: '0509',
  port: 5432,
});

app.use(express.json());

// Multer configuration for file upload
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure 'uploads' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        fs.unlinkSync(filePath);

        try {
          await pool.query('DELETE FROM rankings');

          for (const row of results) {
            const queryText = `INSERT INTO rankings (original_rank, new_rank, change, college, fees, faculty, ss, fsr, fqe, fru, pu, qp, ipr, fppp, gph, gue, gms, gphd, rd, wd, escs, pcs, pr, total, your_score) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`;
            const values = [
              row['Original Rank'],
              row['New Rank'],
              row['Change'],
              row['College'],
              row['Fees'],
              row['Faculty'],
              row['SS'],
              row['FSR'],
              row['FQE'],
              row['FRU'],
              row['PU'],
              row['QP'],
              row['IPR'],
              row['FPPP'],
              row['GPH'],
              row['GUE'],
              row['GMS'],
              row['GPHD'],
              row['RD'],
              row['WD'],
              row['ESCS'],
              row['PCS'],
              row['PR'],
              row['Total'],
              row['your_score'] // Assuming 'Your Score' is the new column
            ];

            await pool.query(queryText, values);
          }

          res.status(200).json({ message: 'Data inserted successfully.' });
        } catch (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ message: 'Failed to insert data into database.' });
        }
      });
  } catch (error) {
    console.error('Error processing file upload:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Route handler for fetching rankings
app.get('/api/rankings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rankings');
    const rankings = result.rows;
    res.status(200).json(rankings);
  } catch (error) {
    console.error('Error fetching rankings:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
