// index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const quizRouter = require('./routes/quiz');

const app = express();
app.use(bodyParser.json());

app.use('/api', quizRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3500;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
