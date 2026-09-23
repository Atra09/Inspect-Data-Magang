const express = require('express');
const router = express.Router();
const { Inspection, Manifest, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/logs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const inspections = await Inspection.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const manifests = await Manifest.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const logs = [];

    inspections.forEach((insp) => {
      logs.push({
        id: `insp-${insp.id}`,
        user: insp.officerName || 'Capt. Hendra Gunawan, M.Mar.',
        action: `Pemeriksaan SPB: ${insp.spbNumber}`,
        detail: `Kapal ${insp.vessel} - Status: ${insp.status} (Agen: ${insp.agent || 'Pelayaran'})`,
        time: insp.inspectionTime || insp.createdAt.toLocaleTimeString('id-ID'),
        type: insp.status === 'Disetujui' ? 'success' : 'warning',
        createdAt: insp.createdAt,
      });
    });

    manifests.forEach((m) => {
      logs.push({
        id: `man-${m.id}`,
        user: 'Petugas Gangway Dermaga',
        action: `Audit Manifest: ${m.passengerName}`,
        detail: `Pencocokan NIK ${m.nik} pada ${m.shipName} (${m.status})`,
        time: m.createdAt ? m.createdAt.toLocaleTimeString('id-ID') : '08:00 WIB',
        type: m.status === 'Valid' ? 'info' : 'warning',
        createdAt: m.createdAt,
      });
    });

    // Sort by createdAt descending
    logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Logs fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
