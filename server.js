const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Позволяет обслуживать статические файлы

// Подключение к базе данных SQLite
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Подключение к базе данных установлено.');
    }
});

// Регулярное выражение для проверки имени пользователя
const usernameRegex = /^[a-zA-Z0-9]+$/; // Только буквы и цифры

// Пример API для регистрации пользователей
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    // Проверка на допустимость имени пользователя
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: 'Имя пользователя должно содержать только буквы и цифры.' });
    }

    // Проверка на существование пользователя
    const checkUserSql = 'SELECT * FROM users WHERE username = ?';
    db.get(checkUserSql, [username], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'Пользователь с таким именем уже существует.' });
        }

        // Регистрация нового пользователя
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.run(sql, [username, password], function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID });
        });
    });
});

// Пример API для авторизации пользователей
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (row) {
            res.json({ message: 'Успешный вход', user: row });
        } else {
            res.status(401).json({ message: 'Неверные учетные данные' });
        }
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
