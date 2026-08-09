const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/collect', (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  // Save data to a file or database
  res.status(200).send("Data collected successfully!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});