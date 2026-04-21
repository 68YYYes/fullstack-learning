const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

//POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    //1. 基本验证
    if (!username || !password ) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    //2. 检查用户名是否已存在
    const [existing] = await pool.query(
        'SELECT id FROM users WHERE username = ?', 
        [username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    //3. 插入新用户(注意：目前密码为明码，后续会加bcrypt存储)
    const [result] = await pool.query(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)', 
        [username, password, email || null]
    );

    //4. 返回成功响应
    res.status(201).json({ 
      message: '注册成功', 
      userId: result.insertId 
    });
  } catch (error) {
    console.error('注册用户失败:', error);
    res.status(500).json({ error: '服务器错误，请稍后再试' });
  }
});

module.exports = router;