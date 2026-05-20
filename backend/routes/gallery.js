const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Получить галерею (публично)
router.get('/', (req, res) => {
  const settlement = req.query.settlement;
  if (!settlement) return res.status(400).json({ message: 'Укажите settlement' });
  Gallery.getAll(settlement, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    res.json(rows);
  });
});

// Добавить (admin, chairman)
router.post('/', auth, roleCheck('admin', 'chairman'), (req, res) => {
  const { title, imageUrl, type, settlement } = req.body;
  if (!imageUrl || !settlement) return res.status(400).json({ message: 'Заполните обязательные поля' });
  Gallery.create({ title, imageUrl, type: type || 'photo', settlement }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка создания' });
    res.status(201).json({ message: 'Элемент добавлен' });
  });
});

// Удалить
router.delete('/:id', auth, roleCheck('admin', 'chairman'), (req, res) => {
  Gallery.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка удаления' });
    res.json({ message: 'Удалено' });
  });
});

module.exports = router;