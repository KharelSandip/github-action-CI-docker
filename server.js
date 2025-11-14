const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/feedback', express.static('feedback'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'feedback.html'));
});

app.get('/exists', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'exists.html'));
});

app.post('/create', async (req, res) => {
  const title = req.body.title;
  const content = req.body.text;
  const adjTitle = title.toLowerCase();

  const finalFilePath = path.join(__dirname, 'feedback', adjTitle + '.txt');

  try {
    await fs.access(finalFilePath); // if exists, redirect
    return res.redirect('/exists');
  } catch (err) {
    // file does not exist → create
    await fs.writeFile(finalFilePath, content);
    return res.redirect('/');
  }
});

app.listen(80);
