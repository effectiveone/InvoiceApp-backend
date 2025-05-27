const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/products/productsController');

// POST /api/products - tworzenie nowego produktu
router.post('/', createProduct);

// POST /api/products/list - pobieranie produktów (używa POST bo potrzebuje userEmail w body)
router.post('/list', getProducts);

// GET /api/products/:id - pobieranie produktu po ID
router.get('/:id', getProductById);

// PUT /api/products/:id - aktualizacja produktu
router.put('/:id', updateProduct);

// DELETE /api/products/:id - usuwanie produktu
router.delete('/:id', deleteProduct);

module.exports = router;
