// routes/quiz.js
const express = require('express');
const router = express.Router();

// Since we are using an online database, we don't need the local Question model anymore

// Remove the routes that interact with the local database
// You can add routes that interact with the online database if needed

module.exports = router;
