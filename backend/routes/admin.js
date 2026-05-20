const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Получить пользователей (admin – всех, chairman – только своего посёлка)
router.get('/users', auth, (req, res) => {
  if (req.user.role === 'admin') {
    db.all('SELECT id, email, fullName, role, settlement, createdAt FROM users', (err, rows) => {
      if (err) return res.status(500).json({ message: 'Ошибка БД' });
      res.json(rows);
    });
  } else if (req.user.role === 'chairman') {
    db.all(
      'SELECT id, email, fullName, role, settlement, createdAt FROM users WHERE settlement = ?',
      [req.user.settlement],
      (err, rows) => {
        if (err) return res.status(500).json({ message: 'Ошибка БД' });
        res.json(rows);
      }
    );
  } else {
    res.status(403).json({ message: 'Недостаточно прав' });
  }
});

// Обновить роль (admin – любую, chairman – только resident/guest своего посёлка)
router.put('/users/:id/role', auth, (req, res) => {
  const { role } = req.body;
  const { id } = req.params;
  const allowedRoles = ['resident', 'guest'];
  if (req.user.role === 'admin') {
    // админ может назначить любую роль
    if (!['admin', 'chairman', 'resident', 'guest'].includes(role)) {
      return res.status(400).json({ message: 'Недопустимая роль' });
    }
    db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], function(err) {
      if (err) return res.status(500).json({ message: 'Ошибка обновления' });
      if (this.changes === 0) return res.status(404).json({ message: 'Пользователь не найден' });
      res.json({ message: 'Роль обновлена' });
    });
  } else if (req.user.role === 'chairman') {
    // председатель может менять роль только resident/guest и только для своего посёлка
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Председатель может назначить только жителя или гостя' });
    }
    db.run(
      'UPDATE users SET role = ? WHERE id = ? AND settlement = ?',
      [role, id, req.user.settlement],
      function(err) {
        if (err) return res.status(500).json({ message: 'Ошибка обновления' });
        if (this.changes === 0) return res.status(404).json({ message: 'Пользователь не найден или не из вашего посёлка' });
        res.json({ message: 'Роль обновлена' });
      }
    );
  } else {
    res.status(403).json({ message: 'Недостаточно прав' });
  }
});

module.exports = router;