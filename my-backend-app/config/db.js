const mysql = require('mysql2/promise'); // 使用支持 Promise 的版本
require('dotenv').config();

// 创建连接池，这是一种推荐的管理连接的方式，效率更高
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // 限制连接池的最大连接数
  queueLimit: 0
});

// 测试数据库连接是否成功的函数
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功！');
    connection.release(); // 释放连接回连接池
  } catch (error) {
    console.error('❌ 数据库连接失败：', error.message);
  }
}

// 导出连接池和测试函数，以便在其他文件中使用
module.exports = { pool, testConnection };