const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');  // 密碼加密

const app = express();
const port = 3000;

// 設定解析 JSON 格式的請求體
app.use(bodyParser.json());

// MySQL 連接配置
const db = mysql.createConnection({
    host: 'localhost', // MySQL 主機
    user: 'root',      // MySQL 使用者名稱
    password: '',      // MySQL 密碼
    database: 'test_db' // 資料庫名稱
});

// 連接到 MySQL 資料庫
db.connect((err) => {
    if (err) {
        console.error('無法連接到資料庫: ', err);
        return;
    }
    console.log('成功連接到資料庫');
});

// 註冊 API
app.post('/register', (req, res) => {
    const { email, username, password, dob } = req.body;

    // 密碼加密
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ success: false, message: '密碼加密失敗' });
        }

        // 檢查使用者是否已經註冊過
        const checkUserQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
        db.query(checkUserQuery, [email, username], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: '檢查使用者失敗' });
            }
            if (results.length > 0) {
                return res.status(400).json({ success: false, message: '電子郵件或使用者名稱已經被註冊' });
            }

            // 插入新使用者資料
            const insertQuery = 'INSERT INTO users (email, username, password, dob) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [email, username, hashedPassword, dob], (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: '註冊資料插入失敗' });
                }
                res.status(201).json({ success: true, message: '註冊成功' });
            });
        });
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器正在運行在 http://localhost:${port}`);
});
