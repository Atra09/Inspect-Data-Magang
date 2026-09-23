const express = require('express');
const router = express.Router();
const { Inspection, Manifest, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/stats
router.get('/', authMiddleware, async (req, res) => {
  try {
    const totalClearance = await Inspection.count({ where: { status: 'Disetujui' } });
    const inInspection = await Inspection.count({ where: { status: 'Dalam Inspeksi' } });
    const pendingAudit = await Inspection.count({ where: { status: 'Pending Audit' } });
    const totalInspections = await Inspection.count();

    const validManifests = await Manifest.count({ where: { status: 'Valid' } });
    const mismatchManifests = await Manifest.count({ where: { status: 'Mismatch' } });
    const totalPassengers = await Manifest.count();

    const passRate = totalInspections > 0
      ? ((totalClearance / totalInspections) * 100).toFixed(1) + '%'
      : '100%';

    res.json({
      success: true,
      data: {
        totalClearance,
        inInspection,
        pendingAudit,
        totalInspections,
        validManifests,
        mismatchManifests,
        totalPassengers,
        passRate,
      },
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
