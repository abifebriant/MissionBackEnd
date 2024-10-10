const bcrypt = require('bcrypt');
const User = require('./userModel');  // Import User model

class UserService {
    // Fungsi untuk menambahkan user baru ke database
    static async createUser(data) {
        const { name, fullname, password, email } = data;

        // Hash password menggunakan bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Membuat user baru dan menyimpannya di MongoDB
        const newUser = new User({
            name,
            fullname,
            email,
            password: hashedPassword,  // Simpan password yang sudah di-hash
        });

        // Simpan user ke database dan return hasilnya
        return newUser.save();
    }
}

module.exports = UserService;
