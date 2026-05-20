const db = require('../database');

const User = {
  findByEmail: (email, callback) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  },
  create: (user, callback) => {
    db.run(
      `INSERT INTO users (email, password, fullName, role, settlement) VALUES (?, ?, ?, ?, ?)`,
      [user.email, user.password, user.fullName, user.role || 'resident', user.settlement],
      callback
    );
  },
  findById: (id, callback) => {
    db.get('SELECT id, email, fullName, role, settlement, createdAt FROM users WHERE id = ?', [id], callback);
  },
  updateRole: (id, role, callback) => {
    db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], callback);
  },
  getAll: (callback) => {
    db.all('SELECT id, email, fullName, role, settlement, createdAt FROM users', callback);
  }
};

module.exports = User;