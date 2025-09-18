const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Upload = require('../models/Upload');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'crop-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Dummy AI diagnosis function
const generateDummyDiagnosis = () => {
  const diseases = [
    { name: 'Leaf Spot', severity: 'warning' },
    { name: 'Powdery Mildew', severity: 'infected' },
    { name: 'Rust', severity: 'infected' },
    { name: 'Healthy Plant', severity: 'healthy' },
    { name: 'Bacterial Blight', severity: 'infected' },
    { name: 'Viral Mosaic', severity: 'warning' }
  ];

  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-99% confidence

  const recommendations = {
    healthy: ['Continue current care practices', 'Monitor regularly'],
    warning: ['Apply organic fungicide', 'Improve air circulation', 'Monitor closely'],
    infected: ['Remove affected leaves', 'Apply recommended treatment', 'Isolate plant if necessary', 'Consult agricultural expert']
  };

  return {
    disease: randomDisease.name,
    confidence,
    severity: randomDisease.severity,
    recommendations: recommendations[randomDisease.severity]
  };
};

// Upload crop image
router.post('/', authenticateToken, upload.single('cropImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { notes, cropType, latitude, longitude, address } = req.body;

    // Generate dummy AI diagnosis
    const diagnosis = generateDummyDiagnosis();

    // Create upload record
    const uploadRecord = new Upload({
      userId: req.userId,
      imagePath: req.file.filename,
      imageUrl: `/uploads/${req.file.filename}`,
      notes,
      cropType,
      diagnosis,
      location: {
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        address
      },
      processed: true
    });

    await uploadRecord.save();

    res.status(201).json({
      message: 'Image uploaded and analyzed successfully',
      upload: uploadRecord,
      diagnosis
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;