const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save', (req, res) => {
  const newData = req.body;
  fs.readFile('data.json', (err, data) => {
    let arr = [];
    if (!err && data.length > 0) {
      arr = JSON.parse(data);
    }
    arr.push(newData);
    fs.writeFile('data.json', JSON.stringify(arr, null, 2), () => {
      res.sendStatus(200);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});