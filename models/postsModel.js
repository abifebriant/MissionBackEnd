const express = require('express');
const mongoose = require('mongoose');
const User = require('./userModel');  // Import model user

const app = express();

// Middleware untuk parsing JSON body
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,  // Untuk mendukung email unik
});

// Route untuk menambahkan user baru
app.post('/adduser', async (req, res) => {
  const { name, fullname, password, email } = req.body;

  // Validasi data input
  if (!name || !fullname || !password || !email) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  try {
    // Buat user baru dan simpan ke database
    const newUser = new User({ name, fullname, password, email });
    await newUser.save();
    res.status(201).json({ message: 'User berhasil ditambahkan', user: newUser });
  } catch (error) {
    if (error.code === 11000) {  // Cek jika email sudah digunakan
      res.status(400).json({ message: 'Email sudah terdaftar' });
    } else {
      res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan user' });
    }
  }
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
