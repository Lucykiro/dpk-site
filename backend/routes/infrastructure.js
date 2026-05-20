const express = require('express');
const router = express.Router();
const Infrastructure = require('../models/Infrastructure');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Получить инфраструктуру (публично)
router.get('/', (req, res) => {
  const settlement = req.query.settlement;
  if (!settlement) return res.status(400).json({ message: 'Укажите settlement' });
  Infrastructure.getAll(settlement, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    res.json(rows);
  });
});

// Создать (admin, chairman)
router.post('/', auth, roleCheck('admin', 'chairman'), (req, res) => {
  const { title, description, icon, settlement } = req.body;
  if (!title || !settlement) return res.status(400).json({ message: 'Заполните обязательные поля' });
  Infrastructure.create({ title, description, icon, settlement }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка создания' });
    res.status(201).json({ message: 'Объект инфраструктуры создан' });
  });
});

// Обновить
router.put('/:id', auth, roleCheck('admin', 'chairman'), (req, res) => {
  const { title, description, icon } = req.body;
  Infrastructure.update(req.params.id, { title, description, icon }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка обновления' });
    res.json({ message: 'Обновлено' });
  });
});

// Удалить
router.delete('/:id', auth, roleCheck('admin', 'chairman'), (req, res) => {
  Infrastructure.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка удаления' });
    res.json({ message: 'Удалено' });
  });
});

module.exports = router;