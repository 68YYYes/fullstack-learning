const jwt = require('jsonwebtoken');

const secret = 'mysecret123';
const payload = { userId: 1, username: 'alice' };

// 签发 token（默认算法 HS256）
const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log('Token:', token);

// 验证 token
try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded:', decoded);
} catch (err) {
  console.error('Invalid token:', err.message);
}