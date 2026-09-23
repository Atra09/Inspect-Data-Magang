const express = require('express');
const router = express.Router();
const { Inspection } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/inspection
router.get('/', authMiddleware, async (req, res) => {
  try {
    const inspections = await Inspection.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: inspections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/inspection
router.post('/', authMiddleware, async (req, res) => {
  try {
    const inspection = await Inspection.create(req.body);
    res.status(201).json({ success: true, data: inspection });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/inspection/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const inspection = await Inspection.findByPk(req.params.id);
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Data inspeksi tidak ditemukan.' });
    }
    await inspection.update(req.body);
    res.json({ success: true, data: inspection });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
