// 引入 mysql2 的 promise 版本（支持 async/await）
const mysql = require('mysql2/promise');
// 加载 .env 文件中的环境变量
require('dotenv').config();

// 创建数据库连接池（推荐使用连接池，性能更好）
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,      // 最大连接数
  queueLimit: 0
});

// 编写一个测试连接的函数，方便排查问题
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功！');
    connection.release(); // 释放连接回连接池
  } catch (error) {
    console.error('❌ 数据库连接失败：', error.message);
  }
}

// 导出连接池和测试函数
module.exports = { pool, testConnection };