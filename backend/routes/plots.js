const express = require('express');
const router = express.Router();
const Plot = require('../models/Plot');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Получить участки (публично, с фильтрами)
router.get('/', (req, res) => {
  const settlement = req.query.settlement;
  if (!settlement) return res.status(400).json({ message: 'Укажите settlement' });
  const filters = {
    minArea: req.query.minArea,
    maxArea: req.query.maxArea,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    status: req.query.status
  };
  Plot.getAll(settlement, filters, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    res.json(rows);
  });
});

// Получить один участок
router.get('/:id', (req, res) => {
  Plot.getById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    if (!row) return res.status(404).json({ message: 'Участок не найден' });
    res.json(row);
  });
});

// Создать участок (admin, chairman)
router.post('/', auth, roleCheck('admin', 'chairman'), (req, res) => {
  const { number, area, price, status, description, settlement } = req.body;
  if (!number || !area || !settlement) {
    return res.status(400).json({ message: 'Заполните обязательные поля' });
  }
  Plot.create({ number, area, price, status, description, settlement }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка создания' });
    res.status(201).json({ message: 'Участок создан' });
  });
});

// Обновить участок
router.put('/:id', auth, roleCheck('admin', 'chairman'), (req, res) => {
  const { number, area, price, status, description } = req.body;
  Plot.update(req.params.id, { number, area, price, status, description }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка обновления' });
    res.json({ message: 'Участок обновлен' });
  });
});

// Удалить участок
router.delete('/:id', auth, roleCheck('admin', 'chairman'), (req, res) => {
  Plot.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка удаления' });
    res.json({ message: 'Участок удален' });
  });
});

module.exports = router;