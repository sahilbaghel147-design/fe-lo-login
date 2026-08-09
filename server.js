const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// /collect endpoint to receive data
app.post('/collect', (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  // Save data to a file or database
  res.status(200).send("Data collected successfully!");
});

// /no_think endpoint to make it look like a normal website
app.get('/no_think', (req, res) => {
  res.status(200).send("This is a normal website. No data is being collected.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
