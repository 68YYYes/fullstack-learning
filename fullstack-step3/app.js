// app.js
const express = require('express');
const cors = require('cors');          // 引入 cors
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用 CORS（开发阶段允许所有来源）
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 挂载路由
app.use('/api', authRoutes);

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '内部服务器错误' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});