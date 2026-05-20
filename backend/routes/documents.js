const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Получить документы (доступ: если роль admin/chairman - все, если resident - только своего поселка, guest - недоступно)
router.get('/', auth, (req, res) => {
  const settlement = req.query.settlement;
  if (!settlement) return res.status(400).json({ message: 'Укажите settlement' });
  // Проверка прав: resident видит только свой поселок
  if (req.user.role === 'resident' && req.user.settlement !== settlement) {
    return res.status(403).json({ message: 'Нет доступа к документам другого поселка' });
  }
  Document.getAll(settlement, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    res.json(rows);
  });
});

// Создать документ (admin, chairman)
router.post('/', auth, roleCheck('admin', 'chairman'), (req, res) => {
  const { title, description, fileUrl, settlement } = req.body;
  if (!title || !fileUrl || !settlement) {
    return res.status(400).json({ message: 'Заполните обязательные поля' });
  }
  Document.create({ title, description, fileUrl, settlement }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка создания' });
    res.status(201).json({ message: 'Документ создан' });
  });
});

// Обновить документ
router.put('/:id', auth, roleCheck('admin', 'chairman'), (req, res) => {
  const { title, description, fileUrl } = req.body;
  Document.update(req.params.id, { title, description, fileUrl }, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка обновления' });
    res.json({ message: 'Документ обновлен' });
  });
});

// Удалить документ
router.delete('/:id', auth, roleCheck('admin', 'chairman'), (req, res) => {
  Document.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Ошибка удаления' });
    res.json({ message: 'Документ удален' });
  });
});

module.exports = router;