const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Регистрация (только для resident, председатели и админы создаются через админку)
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').notEmpty(),
  body('settlement').isIn(['zapovednoe', 'kolosok'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, fullName, settlement } = req.body;
  try {
    User.findByEmail(email, async (err, user) => {
      if (err) return res.status(500).json({ message: 'Ошибка БД' });
      if (user) return res.status(400).json({ message: 'Email уже используется' });
      const hash = await bcrypt.hash(password, 10);
      User.create({ email, password: hash, fullName, role: 'resident', settlement }, (err, result) => {
        if (err) return res.status(500).json({ message: 'Ошибка создания пользователя' });
        res.status(201).json({ message: 'Регистрация успешна' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Серверная ошибка' });
  }
});

// Логин
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  User.findByEmail(email, async (err, user) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    if (!user) return res.status(401).json({ message: 'Неверный email или пароль' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Неверный email или пароль' });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, settlement: user.settlement, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, settlement: user.settlement } });
  });
});

// Получение текущего пользователя (проверка токена)
router.get('/me', require('../middleware/auth'), (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) return res.status(500).json({ message: 'Ошибка БД' });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  });
});

module.exports = router;