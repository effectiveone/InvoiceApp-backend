const express = require('express');
const router = express.Router();
const daneFirmyController = require('../controllers/daneFirmy/daneFirmyController');

// POST /api/company - tworzenie lub aktualizacja danych firmy
router.post('/', daneFirmyController.createOrUpdate);

// POST /api/company/read - pobieranie danych firmy (używa POST bo potrzebuje userEmail w body)
router.post('/read', daneFirmyController.read);

// PUT /api/company - aktualizacja danych firmy
router.put('/', daneFirmyController.update);

// DELETE /api/company - usuwanie danych firmy
router.delete('/', daneFirmyController.delete);

module.exports = router;
