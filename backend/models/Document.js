const db = require('../database');

const Document = {
  getAll: (settlement, callback) => {
    let sql = 'SELECT * FROM documents';
    const params = [];
    if (settlement) {
      sql += ' WHERE settlement = ?';
      params.push(settlement);
    }
    db.all(sql, params, callback);
  },
  getById: (id, callback) => {
    db.get('SELECT * FROM documents WHERE id = ?', [id], callback);
  },
  create: (doc, callback) => {
    db.run(
      `INSERT INTO documents (title, description, fileUrl, settlement) VALUES (?, ?, ?, ?)`,
      [doc.title, doc.description, doc.fileUrl, doc.settlement],
      callback
    );
  },
  update: (id, doc, callback) => {
    db.run(
      `UPDATE documents SET title = ?, description = ?, fileUrl = ? WHERE id = ?`,
      [doc.title, doc.description, doc.fileUrl, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.run('DELETE FROM documents WHERE id = ?', [id], callback);
  }
};

module.exports = Document;