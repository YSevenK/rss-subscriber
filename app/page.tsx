// app/page.tsx

"use client"

import { useState } from 'react';

const Home = () => {
  const [rssLink, setRssLink] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // 新增加载状态

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 开始加载
    setMessage(''); // 清空之前的消息

    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rssLink, email }),
    });

    if (response.ok) {
      setMessage('订阅成功！');
      setRssLink(''); // 清空 RSS 链接输入框
      setEmail(''); // 清空邮箱输入框
    } else {
      const errorData = await response.json(); // 解析错误消息
      setMessage(errorData.error || '订阅失败，请重试。'); // 显示具体的错误消息
    }

    setLoading(false); // 结束加载
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">欢迎来到 RSS 订阅器</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <input
          type="url"
          className="border p-2 w-full mb-4"
          placeholder="输入 RSS 链接"
          value={rssLink}
          onChange={(e) => setRssLink(e.target.value)}
          required
        />
        <input
          type="email"
          className="border p-2 w-full mb-4"
          placeholder="输入邮箱地址"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading} // 提交时禁用按钮
        >
          {loading ? '正在订阅...' : '订阅'}
        </button>
      </form>
      {message && <p className="text-center mt-4">{message}</p>}
    </div>
  );
};

export default Home;
