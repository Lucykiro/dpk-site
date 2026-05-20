const db = require('../database');

const Plot = {
  getAll: (settlement, filters, callback) => {
    let sql = 'SELECT * FROM plots WHERE settlement = ?';
    const params = [settlement];
    if (filters.minArea) {
      sql += ' AND area >= ?';
      params.push(filters.minArea);
    }
    if (filters.maxArea) {
      sql += ' AND area <= ?';
      params.push(filters.maxArea);
    }
    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.minPrice) {
      sql += ' AND price >= ?';
      params.push(filters.minPrice);
    }
    if (filters.maxPrice) {
      sql += ' AND price <= ?';
      params.push(filters.maxPrice);
    }
    db.all(sql, params, callback);
  },
  getById: (id, callback) => {
    db.get('SELECT * FROM plots WHERE id = ?', [id], callback);
  },
  create: (plot, callback) => {
    db.run(
      `INSERT INTO plots (number, area, price, status, description, settlement) VALUES (?, ?, ?, ?, ?, ?)`,
      [plot.number, plot.area, plot.price, plot.status, plot.description, plot.settlement],
      callback
    );
  },
  update: (id, plot, callback) => {
    db.run(
      `UPDATE plots SET number = ?, area = ?, price = ?, status = ?, description = ? WHERE id = ?`,
      [plot.number, plot.area, plot.price, plot.status, plot.description, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.run('DELETE FROM plots WHERE id = ?', [id], callback);
  }
};

module.exports = Plot;