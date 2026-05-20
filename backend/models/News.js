const db = require('../database');

const News = {
  getAll: (settlement, callback) => {
    let sql = 'SELECT * FROM news';
    const params = [];
    if (settlement) {
      sql += ' WHERE settlement = ?';
      params.push(settlement);
    }
    sql += ' ORDER BY createdAt DESC';
    db.all(sql, params, callback);
  },
  getById: (id, callback) => {
    db.get('SELECT * FROM news WHERE id = ?', [id], callback);
  },
  create: (news, callback) => {
    db.run(
      `INSERT INTO news (title, content, settlement, image) VALUES (?, ?, ?, ?)`,
      [news.title, news.content, news.settlement, news.image],
      callback
    );
  },
  update: (id, news, callback) => {
    db.run(
      `UPDATE news SET title = ?, content = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [news.title, news.content, news.image, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.run('DELETE FROM news WHERE id = ?', [id], callback);
  }
};

module.exports = News;