const express = require('express');
const Upload = require('../models/Upload');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's upload history
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const uploads = await Upload.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-userId');

    const total = await Upload.countDocuments({ userId: req.userId });

    res.json({
      uploads,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalUploads: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
});

// Get specific upload details
router.get('/:uploadId', authenticateToken, async (req, res) => {
  try {
    const upload = await Upload.findOne({
      _id: req.params.uploadId,
      userId: req.userId
    });

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    res.json(upload);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch upload details', error: error.message });
  }
});

module.exports = router;