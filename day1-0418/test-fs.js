const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('Created data directory: ', dataDir);
}

const filePath = path.join(dataDir, 'hello.txt');
fs.writeFileSync(filePath, 'Hello, 全栈之路!','utf-8');
console.log('File written successfully: ', filePath);

const content = fs.readFileSync(filePath, 'utf-8');
console.log('File content: ', content);

fs.appendFileSync(filePath, '\n这是append的内容!','utf-8');
const newContent = fs.readFileSync(filePath, 'utf-8');
console.log('New file content: ', newContent);

fs.unlinkSync(filePath);
console.log('File deleted: ', filePath);