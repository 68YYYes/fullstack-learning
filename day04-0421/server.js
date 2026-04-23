const express = require('express');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// --- 中间件配置 ---
// 解析 JSON 格式的请求体（必须！否则 req.body 是 undefined）
app.use(express.json());
// 解析 URL 编码的表单数据（虽然不是必须，但建议加上）
app.use(express.urlencoded({ extended: false }));

// 自定义日志中间件：打印每次请求的方法和路径
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next(); // 记得调用 next，否则请求会一直挂起
});

// --- 路由挂载 ---
// 引入用户路由
const userRouter = require('./routes/user');
// 挂载到 /api/user 前缀下
app.use('/api/user', userRouter);

// --- 启动服务器 ---
app.listen(PORT, () => {
  console.log(`🚀 服务器启动成功，监听端口 ${PORT}`);
  console.log(`📮 注册接口地址：http://localhost:${PORT}/api/user/register`);
});

// 可选：测试数据库连接（启动时检查一下）
const { testConnection } = require('./config/db');
testConnection();