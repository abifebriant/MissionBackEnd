const express = require('express');
const Product = require('../models/productModel');

const router = express.Router();

// Route untuk menampilkan produk dengan fitur filter, sort, dan search
router.get('/products', async (req, res) => {
  try {
    let query = {};
    
    // SEARCH: Mencari produk berdasarkan nama
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' }; // 'i' untuk case-insensitive
    }

    // FILTER: Filter berdasarkan kategori atau harga minimum & maksimum
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
    }

    // SORT: Urutkan produk berdasarkan harga atau rating
    let sort = {};
    if (req.query.sortByPrice) {
      sort.price = req.query.sortByPrice === 'asc' ? 1 : -1;
    }
    if (req.query.sortByRating) {
      sort.rating = req.query.sortByRating === 'asc' ? 1 : -1;
    }

    // PAGINATION: Batasi jumlah produk yang ditampilkan
    const limit = parseInt(req.query.limit) || 10;  // Default limit 10
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Eksekusi query ke database
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
