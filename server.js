const express = require('express');
const app = express();
const PORT = 3000;

//根路径，返回纯文本
app.get('/', (req, res) => {
  res.send('Hello, 全栈之路!');
});

//自定义API路径，返回JSON数据
app.get('/api/data', (req, res) => {
 res.json({ message: '你好，全栈开发者'});
});

//解析JSON请求体
app.use(express.json());

//处理POST请求，接收JSON数据并返回  
app.post('/api/echo', (req, res) => {
    console.log('Received data:', req.body);
    res.json({ 
        received: true,
        data: req.body
    });
});

//启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});