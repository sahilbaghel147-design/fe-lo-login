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
app.get('/download', async (req, res) => {
  try {
    await connectDB();
    const allData = await CollectedData.find({});
    res.status(200).json(allData);
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
