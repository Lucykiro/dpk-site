const express = require('express');
const router = express.Router();
const News = require('../models/News');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Получить новости (публично, с фильтром по settlement)
router.get('/', (req, res) => {
  const settlement = req.query.settlement;
  if (!settlement) return res.status(400).json({ message: 'Укажите settlement' });
  News.getAll(settlement, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    res.json(rows);
  });
});

// Получить одну новость
router.get('/:id', (req, res) => {
  News.getById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    if (!row) return res.status(404).json({ message: 'Новость не найдена' });
    res.json(row);
  });
});

// Создать новость (admin, chairman)
router.post('/', auth, roleCheck('admin', 'chairman'), (req, res) => {
  const { title, content, settlement, image } = req.body;
  if (!title || !content || !settlement) {
    return res.status(400).json({ message: 'Заполните обязательные поля' });
  }
  News.create({ title, content, settlement, image }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка создания' });
    res.status(201).json({ message: 'Новость создана' });
  });
});

// Обновить новость
router.put('/:id', auth, roleCheck('admin', 'chairman'), (req, res) => {
  const { title, content, image } = req.body;
  News.update(req.params.id, { title, content, image }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка обновления' });
    res.json({ message: 'Новость обновлена' });
  });
});

// Удалить новость
router.delete('/:id', auth, roleCheck('admin', 'chairman'), (req, res) => {
  News.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка удаления' });
    res.json({ message: 'Новость удалена' });
  });
});

module.exports = router;