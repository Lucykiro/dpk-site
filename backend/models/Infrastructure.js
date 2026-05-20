const db = require('../database');

const Infrastructure = {
  getAll: (settlement, callback) => {
    db.all('SELECT * FROM infrastructure WHERE settlement = ?', [settlement], callback);
  },
  getById: (id, callback) => {
    db.get('SELECT * FROM infrastructure WHERE id = ?', [id], callback);
  },
  create: (item, callback) => {
    db.run(
      `INSERT INTO infrastructure (title, description, icon, settlement) VALUES (?, ?, ?, ?)`,
      [item.title, item.description, item.icon, item.settlement],
      callback
    );
  },
  update: (id, item, callback) => {
    db.run(
      `UPDATE infrastructure SET title = ?, description = ?, icon = ? WHERE id = ?`,
      [item.title, item.description, item.icon, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.run('DELETE FROM infrastructure WHERE id = ?', [id], callback);
  }
};

module.exports = Infrastructure;