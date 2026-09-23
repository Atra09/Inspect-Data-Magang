const express = require('express');
const router = express.Router();
const { Manifest } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/manifest
router.get('/', authMiddleware, async (req, res) => {
  try {
    const manifests = await Manifest.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: manifests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/manifest
router.post('/', authMiddleware, async (req, res) => {
  try {
    const manifest = await Manifest.create(req.body);
    res.status(201).json({ success: true, data: manifest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
