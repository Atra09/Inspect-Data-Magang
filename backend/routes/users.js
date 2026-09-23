const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/users
router.post('/', authMiddleware, async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { name, username, password, role, nip } = req.body;
    const hashedPassword = await bcrypt.hash(password || '123456', 10);
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      role: role || 'Petugas KSOP',
      nip,
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
