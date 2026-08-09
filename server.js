const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/collect', (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  res.status(200).send("Data collected successfully!");
});

app.get('/no_think', (req, res) => {
  res.status(200).send("This is a normal website. No data is being collected.");
});

app.get('/download', (req, res) => {
  res.download('collected_data.json', 'collected_data.json', (err) => {
    if (err) {
      console.error("Error sending file:", err);
    }
  });
});

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

module.exports = app;
