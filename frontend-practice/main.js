// ==========================================
// 1. 工具函数：将结果显示在页面上
// ==========================================
function showOutput(message) {
  const outputEl = document.getElementById('output');
  outputEl.textContent = typeof message === 'object' 
    ? JSON.stringify(message, null, 2) 
    : message;
}

// ==========================================
// 2. 演示常用的 console 调试方法（页面加载时立即执行）
// ==========================================
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

console.log('📋 普通输出 users 数组：', users);
console.table(users);   // 表格形式，适合查看数组对象

console.group('🔍 演示：分组输出');
console.log('这条日志在分组内');
console.log('这条也是');
console.groupEnd();

// ==========================================
// 3. 注册按钮点击事件（已修复结构，只绑定一次）
// ==========================================
document.getElementById('testRegisterBtn').addEventListener('click', async () => {
  // 清空上次结果，显示等待提示
  showOutput('⏳ 正在请求注册接口...');

  // 开始分组记录注册流程
  console.group('📝 注册流程调试');
  
  try {
    // 生成唯一用户名（避免重复）
    const uniqueUsername = 'testuser_' + Date.now();
    console.log('步骤1：生成唯一用户名 →', uniqueUsername);

    console.log('步骤2：准备发送 POST 请求到 http://localhost:3000/api/user/register');
    console.log('请求体数据：', {
      username: uniqueUsername,
      password: '123456',
      email: `${uniqueUsername}@example.com`
    });

    // 开启计时器，测量 fetch 耗时
    console.time('⏱️ fetch 耗时');

    const response = await fetch('http://localhost:3000/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: uniqueUsername,
        password: '123456',
        email: `${uniqueUsername}@example.com`
      })
    });

    // 结束计时并输出耗时
    console.timeEnd('⏱️ fetch 耗时');

    // 断言：检查响应是否正常（仅在失败时打印错误信息）
    console.assert(response.ok, `❌ 响应状态不正常，状态码：${response.status}`);

    // 手动处理 HTTP 错误状态码
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log('步骤3：注册成功，服务器返回数据 →', data);
    showOutput(`✅ 注册成功！\n用户ID: ${data.userId}\n用户名: ${uniqueUsername}`);
  } catch (error) {
    console.error('❌ 请求失败：', error);
    showOutput(`❌ 请求失败：${error.message}`);
  } finally {
    // 结束分组（无论成功或失败都会执行）
    console.groupEnd();
  }
});