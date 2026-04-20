const express = require('express');
const app = express();
const PORT = 3000;

// ========== 中间件注册区（注意顺序很重要！）==========

// 1. 解析 JSON 请求体（必须！否则 req.body 为 undefined）
app.use(express.json());

// 2. 解析 URL 编码的表单数据（用于传统 HTML 表单提交）
app.use(express.urlencoded({ extended: false }));

/// 3. 自定义日志中间件（全局生效，记录每次请求的信息）
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.path}`);
  // 必须调用 next()，让请求继续往后走
  next();
});

// 4. 模拟认证中间件（仅供学习，挂载在特定路由前缀下）
const fakeAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    // 如果没有 token，直接返回 401 错误，并终止请求（不调用 next）
    return res.status(401).json({ error: '没有提供 token，拒绝访问' });
  }
  console.log('token 验证通过，继续处理请求...');
  // 验证通过，放行
  next();
};

// 将认证中间件只应用于以 /api/protected 开头的路由
app.use('/api/protected', fakeAuthMiddleware);

// ========== 受保护的路由（需要 token） ==========
app.get('/api/protected/users', (req, res) => {
  res.json({ users: ['张三', '李四', '王五'] });
});

// ========== 公开的 POST 测试接口 ==========
app.post('/api/echo', (req, res) => {
  console.log('收到的请求体：', req.body);
  res.json({
    message: '收到你的数据了！',
    data: req.body
  });
});

// ========== 测试路由 ==========

app.get('/', (req, res) => {
  res.send('中间件测试服务器已启动！');
});

// 稍后我们在这里添加 POST 测试接口

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});