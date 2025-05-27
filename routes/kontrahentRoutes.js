const express = require('express');
const router = express.Router();
const kontrahentController = require('../controllers/kontrahenci/kontrahenciController');

// POST /api/kontrahent - tworzenie nowego kontrahenta
router.post('/', kontrahentController.create);

// POST /api/kontrahent/list - pobieranie kontrahentów (używa POST bo potrzebuje userEmail w body)
router.post('/list', kontrahentController.read);

// PUT /api/kontrahent/:id - aktualizacja kontrahenta
router.put('/:id', kontrahentController.update);

// DELETE /api/kontrahent/:id - usuwanie kontrahenta
router.delete('/:id', kontrahentController.delete);

module.exports = router;
