// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();                 // 加载环境变量

const JWT_SECRET = process.env.JWT_SECRET;  // 从 .env 中读取密钥

function authenticate(req, res, next) {
  // 1. 获取请求头中的 Authorization 字段
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '没有提供 token' });
  }

  // 2. 解析 Bearer <token> 格式
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'token 格式错误' });
  }

  const token = parts[1];

  try {
    // 3. 验证 token 并解码
    const decoded = jwt.verify(token, JWT_SECRET);
    // 解码后包含 userId, username, iat, exp 等字段（与签发时一致）

    // 4. 将用户信息挂载到 req 对象上，方便后续路由使用
    req.user = decoded;

    // 5. 调用 next() 进入下一个处理函数
    next();
  } catch (err) {
    // token 无效（伪造、过期、签名错误等）
    return res.status(401).json({ message: 'token 无效或已过期' });
  }
}

module.exports = authenticate;