/**
 * 阶段1第1周：Node.js fs 模块高级练习
 * 练习1：故意制造错误，对比同步与异步的错误捕获
 * 练习2：读写 JSON 文件
 * 练习3：Promise.all 批量操作与顺序 await 的耗时对比
 */

const fs = require('fs');
const fsPromises = require('fs').promises;

// ========== 练习1：故意制造错误 ==========
console.log('📌 练习1：同步与异步错误捕获对比\n');

// 同步方式：读取一个不存在的文件
try {
  const data = fs.readFileSync('./nonexistent-sync.txt', 'utf8');
  console.log(data);
} catch (error) {
  console.log('❌ 同步读取错误被捕获：', error.message);
  // 典型错误：ENOENT: no such file or directory, open './nonexistent-sync.txt'
}

// 异步方式：读取一个不存在的文件
async function readNonexistentAsync() {
  try {
    const data = await fsPromises.readFile('./nonexistent-async.txt', 'utf8');
    console.log(data);
  } catch (error) {
    console.log('❌ 异步读取错误被捕获：', error.message);
  }
}
readNonexistentAsync();

// 关键区别：
// - 同步错误必须用 try...catch 包裹，否则程序会直接崩溃退出。
// - 异步错误如果不 catch，会导致 Promise rejection，程序不会立即崩溃但会打印警告。
// 你可以尝试注释掉上面的 try...catch 看看效果。

console.log('----------------------------------\n');


// ========== 练习2：读写 JSON 文件 ==========
console.log('📌 练习2：JSON 文件读写\n');

const userObject = {
  name: '李四',
  age: 25,
  hobbies: ['coding', 'reading', 'gaming'],
  address: {
    city: '上海',
    street: '南京路'
  }
};

async function jsonFileDemo() {
  // 将对象转为 JSON 字符串并写入文件
  const jsonString = JSON.stringify(userObject, null, 2); // 第三个参数美化缩进
  await fsPromises.writeFile('./user.json', jsonString);
  console.log('✅ 已写入 JSON 文件：user.json');

  // 读取文件内容并解析回对象
  const fileContent = await fsPromises.readFile('./user.json', 'utf8');
  const parsedObject = JSON.parse(fileContent);
  console.log('📖 从文件读取并解析的对象：', parsedObject);

  // 验证数据一致性
  console.log('姓名：', parsedObject.name);
  console.log('爱好：', parsedObject.hobbies.join(', '));
}
jsonFileDemo();

console.log('----------------------------------\n');


// ========== 练习3：Promise.all 批量操作 vs 顺序 await 耗时对比 ==========
console.log('📌 练习3：批量操作性能对比\n');

// 辅助函数：模拟一个耗时的文件写入操作（比如写入大文件）
async function writeLargeFile(filename, content) {
  // 用 setTimeout 模拟耗时 I/O 操作，延迟 1 秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  await fsPromises.writeFile(filename, content);
  return `${filename} 写入完成`;
}

// 方法A：顺序 await（串行）
async function sequentialWrite() {
  console.log('⏳ 顺序写入开始...');
  const start = Date.now();

  const result1 = await writeLargeFile('./file1.txt', '内容1');
  console.log(result1);
  const result2 = await writeLargeFile('./file2.txt', '内容2');
  console.log(result2);
  const result3 = await writeLargeFile('./file3.txt', '内容3');
  console.log(result3);

  const end = Date.now();
  console.log(`⏱️ 顺序写入总耗时：${end - start} ms (预计约3000ms)`);
}

// 方法B：Promise.all 并发执行
async function parallelWrite() {
  console.log('⏳ 并发写入开始...');
  const start = Date.now();

  const results = await Promise.all([
    writeLargeFile('./file1.txt', '内容1'),
    writeLargeFile('./file2.txt', '内容2'),
    writeLargeFile('./file3.txt', '内容3')
  ]);

  results.forEach(r => console.log(r));
  const end = Date.now();
  console.log(`⏱️ 并发写入总耗时：${end - start} ms (预计约1000ms)`);
}

// 执行对比（由于异步并发，需要按顺序执行两个测试，先串行再并发）
async function runBenchmark() {
  await sequentialWrite();
  console.log('---');
  await parallelWrite();
  console.log('✅ 对比完成：并发执行效率明显高于顺序执行。');
}

// 稍微延迟执行，让前面的练习先输出
setTimeout(runBenchmark, 100);