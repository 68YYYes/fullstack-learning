/**
 * 阶段1第1周：Node.js fs 模块练习
 * 功能：演示同步写/读 与 异步（Promise + async/await）写/读文件
 */
// 1. 引入 fs 模块（Node.js 内置模块，无需安装）
const fs = require('fs'); 
// ========== 同步方式（Sync） ==========
console.log('=== 同步文件操作开始 ===');
// 写入文件（如果文件不存在会自动创建，存在则覆盖）
fs.writeFileSync('./test.txt', 'hello world!');
console.log('同步写入完成: 已将 "hello world!" 写入 test.txt');

// 读取文件
const syncData = fs.readFileSync('./test.txt', 'utf8');
console.log(`同步读取内容：${syncData}`);

console.log('=== 同步文件操作结束 ===\n');

// ========== 异步方式（Promise + async/await） ==========
// 2. 使用 fs.promises API（Node.js v10.0.0 以上支持）
const fsPromises = require('fs').promises;

// 定义一个异步函数来执行文件操作
async function asyncFileOperations() {
    console.log('=== 异步文件操作开始 ===');
    try {
        // 异步写入文件
        await fsPromises.writeFile('./test_async.txt', 'hello async world!');
        console.log('异步写入完成: 已将 "hello async world!" 写入 test_async.txt');
        // 异步读取文件
        const asyncData = await fsPromises.readFile('./test_async.txt', 'utf8');
        console.log(`异步读取内容：${asyncData}`);
        //附加练习：追加内容到文件（不覆盖）
        await fsPromises.appendFile('./test_async.txt', '\nThis is an appended line.');
        const appendedData = await fsPromises.readFile('./test_async.txt', 'utf8');
        console.log(`追加后内容：\n${appendedData}`);
    } catch (error) {
        console.error('异步文件操作出错:', error.message);
    }
    console.log('=== 异步文件操作结束 ===');
}
// 调用异步函数（注意：async 函数返回 Promise，这里直接调用）
asyncFileOperations().then(() => {
    console.log('所有文件操作完成');
});