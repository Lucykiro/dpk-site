const db = require('../database');

const Contact = {
  create: (data, callback) => {
    db.run(
      `INSERT INTO contacts (name, email, message, settlement) VALUES (?, ?, ?, ?)`,
      [data.name, data.email, data.message, data.settlement],
      callback
    );
  },
  getAll: (callback) => {
    db.all('SELECT * FROM contacts ORDER BY createdAt DESC', callback);
  }
};

module.exports = Contact;