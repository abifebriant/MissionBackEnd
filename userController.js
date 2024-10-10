const UserService = require('./userService');  // Import UserService

class UserController {
    // Fungsi untuk menangani HTTP request menambah user
    static async insertUser(req, res) {
        const { name, fullname, password, email } = req.body;

        // Validasi input
        if (!name || !fullname || !password || !email) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        try {
            // Memanggil service untuk membuat user baru
            const newUser = await UserService.createUser({ name, fullname, password, email });
            return res.status(201).json({ message: 'User berhasil ditambahkan', user: newUser });
        } catch (error) {
            // Cek apakah email sudah digunakan
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Email sudah terdaftar' });
            }
            return res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan user', error });
        }
    }
}

module.exports = UserController;
