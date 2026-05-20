const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Отправить сообщение (публично)
router.post('/', (req, res) => {
  const { name, email, message, settlement } = req.body;
  if (!name || !email || !message || !settlement) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }
  Contact.create({ name, email, message, settlement }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка сохранения' });
    // Здесь можно отправить email уведомление председателю
    res.status(201).json({ message: 'Сообщение отправлено' });
  });
});

// Просмотр сообщений (только admin и chairman своего посёлка)
router.get('/', auth, roleCheck('admin', 'chairman'), (req, res) => {
  if (req.user.role === 'chairman') {
    // Председатель видит только сообщения своего посёлка
    db.all('SELECT * FROM contacts WHERE settlement = ? ORDER BY createdAt DESC', [req.user.settlement], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Ошибка БД' });
      res.json(rows);
    });
  } else {
    Contact.getAll((err, rows) => {
      if (err) return res.status(500).json({ message: 'Ошибка БД' });
      res.json(rows);
    });
  }
});

module.exports = router;