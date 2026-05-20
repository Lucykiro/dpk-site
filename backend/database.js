const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Инициализация таблиц
db.serialize(() => {
  // Таблица пользователей
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'chairman', 'resident', 'guest')),
      settlement TEXT CHECK(settlement IN ('zapovednoe', 'kolosok', NULL)),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица новостей
  db.run(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      settlement TEXT NOT NULL CHECK(settlement IN ('zapovednoe', 'kolosok')),
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица документов
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      fileUrl TEXT NOT NULL,
      settlement TEXT NOT NULL CHECK(settlement IN ('zapovednoe', 'kolosok')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица участков
  db.run(`
    CREATE TABLE IF NOT EXISTS plots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT NOT NULL,
      area REAL NOT NULL,
      price REAL,
      status TEXT DEFAULT 'available' CHECK(status IN ('available', 'sold', 'reserved')),
      description TEXT,
      settlement TEXT NOT NULL CHECK(settlement IN ('zapovednoe', 'kolosok')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица инфраструктуры
  db.run(`
    CREATE TABLE IF NOT EXISTS infrastructure (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      settlement TEXT NOT NULL CHECK(settlement IN ('zapovednoe', 'kolosok'))
    )
  `);

  // Таблица галереи
  db.run(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      imageUrl TEXT NOT NULL,
      type TEXT DEFAULT 'photo' CHECK(type IN ('photo', 'video')),
      settlement TEXT NOT NULL CHECK(settlement IN ('zapovednoe', 'kolosok')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Создание тестового администратора (если нет пользователей)
  db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
    if (err) return console.error(err);
    if (row.count === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      db.run(
        `INSERT INTO users (email, password, fullName, role, settlement) VALUES (?, ?, ?, ?, ?)`,
        ['admin@dpk.ru', hash, 'Администратор', 'admin', null],
        (err) => { if (err) console.error(err); else console.log('Admin user created'); }
      );
      // Председатель заповедное
      const hashChair = bcrypt.hashSync('chair123', 10);
      db.run(
        `INSERT INTO users (email, password, fullName, role, settlement) VALUES (?, ?, ?, ?, ?)`,
        ['chair@zapovednoe.ru', hashChair, 'Председатель Заповедное', 'chairman', 'zapovednoe'],
        (err) => { if (err) console.error(err); else console.log('Chairman user created'); }
      );
      // Житель колосок
      const hashRes = bcrypt.hashSync('resident123', 10);
      db.run(
        `INSERT INTO users (email, password, fullName, role, settlement) VALUES (?, ?, ?, ?, ?)`,
        ['resident@kolosok.ru', hashRes, 'Житель Колосок', 'resident', 'kolosok'],
        (err) => { if (err) console.error(err); else console.log('Resident user created'); }
      );
    }
  });
});

module.exports = db;