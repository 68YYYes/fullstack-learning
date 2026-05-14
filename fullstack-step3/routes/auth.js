// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');
require('dotenv').config();
const authenticate = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

// 注册接口（简单版，仅用于创建测试用户）
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // 简单校验
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  try {
    // 检查用户名是否已存在
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ message: '用户名已被占用' });
    }

    // 直接存储明文密码（生产环境必须 hash！）
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.status(201).json({ message: '注册成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  try {
    // 1. 根据用户名查找用户
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    // 2. 用户不存在
    if (rows.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const user = rows[0];

    // 3. 比对密码（此处为明文比对，后续会升级为 bcrypt）
    if (user.password !== password) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 4. 生成 JWT，负载（payload）中放入用户信息
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 5. 返回 token
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/// ==================== 受保护的个人信息 ====================
router.get('/me', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    const user = rows[0];
    res.json({
      message: '这是你的个人信息',
      userId: user.id,
      username: user.username,
      createdAt: user.created_at
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;