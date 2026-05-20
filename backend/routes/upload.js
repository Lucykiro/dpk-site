const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB

router.post('/', auth, roleCheck('admin', 'chairman'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Файл не загружен' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

module.exports = router;