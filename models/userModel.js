const mongoose = require('mongoose');

// Skema User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },  // Email harus unik
    password: { type: String, required: true },  // Harus disimpan dalam bentuk hash
}, { timestamps: true });  // Untuk menyimpan waktu create dan update

const User = mongoose.model('User', userSchema);

module.exports = User;
