const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const nodemailer = require('nodemailer');
const multer = require ('multer');
const path = require('path');
const User = require('./models/User');  // Import User model
const fs = require('fs');

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use('/api', productRoutes);
app.use('/api/users', userRoutes);  // Menggunakan router user

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log('MongoDB connection error:', error));

// Tambah pengguna baru
app.post('/users', async (req, res) => {
    const { name, fullname, email, password } = req.body;  // fullname ditambahkan
  
    try {
      const newUser = new User({
        name,
        fullname,
        email,
        password,
      });
  
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: 'Gagal menambahkan pengguna', error });
    }
  });

// Konfigurasi transporter Nodemailer untuk Gmail (atau layanan lain)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Ganti dengan email kamu
    pass: 'your-email-password',   // Ganti dengan password kamu atau gunakan App Password jika 2FA aktif
  },
});

// Endpoint untuk mengirim email
app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  // Konfigurasi email
  const mailOptions = {
    from: 'your-email@gmail.com',  // Ganti dengan email pengirim
    to: to,  // Email penerima
    subject: subject,  // Subjek email
    text: text,  // Isi teks email
  };

  // Mengirim email menggunakan Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Gagal mengirim email', error });
    }
    res.status(200).json({ message: 'Email berhasil dikirim', info });
  });
});

// Cek apakah folder uploads sudah ada, jika belum buat foldernya
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Upload Images menggunakan Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));  // Path yang benar
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json(req.file);
});

const PORT = process.env.PORT || 3000;  // Hapus duplikasi PORT

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
