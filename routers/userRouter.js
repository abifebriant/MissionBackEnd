const express = require('express');
const UserController = require('./userController');  // Import UserController

const router = express.Router();

// Route untuk menambahkan user baru
router.post('/adduser', UserController.insertUser);

module.exports = router;
