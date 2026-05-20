const db = require('../database');

const Gallery = {
  getAll: (settlement, callback) => {
    db.all('SELECT * FROM gallery WHERE settlement = ? ORDER BY createdAt DESC', [settlement], callback);
  },
  getById: (id, callback) => {
    db.get('SELECT * FROM gallery WHERE id = ?', [id], callback);
  },
  create: (item, callback) => {
    db.run(
      `INSERT INTO gallery (title, imageUrl, type, settlement) VALUES (?, ?, ?, ?)`,
      [item.title, item.imageUrl, item.type, item.settlement],
      callback
    );
  },
  delete: (id, callback) => {
    db.run('DELETE FROM gallery WHERE id = ?', [id], callback);
  }
};

module.exports = Gallery;