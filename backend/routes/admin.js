const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Получить всех пользователей (только admin)
router.get('/users', auth, roleCheck('admin'), (req, res) => {
  db.all('SELECT id, email, fullName, role, settlement, createdAt FROM users', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    res.json(rows);
  });
});

// Обновить роль пользователя
router.put('/users/:id/role', auth, roleCheck('admin'), (req, res) => {
  const { role } = req.body;
  const { id } = req.params;
  if (!['admin', 'chairman', 'resident', 'guest'].includes(role)) {
    return res.status(400).json({ message: 'Недопустимая роль' });
  }
  db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], function(err) {
    if (err) return res.status(500).json({ message: 'Ошибка обновления' });
    if (this.changes === 0) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json({ message: 'Роль обновлена' });
  });
});

module.exports = router;