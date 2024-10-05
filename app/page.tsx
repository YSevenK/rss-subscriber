// app/page.tsx

"use client"; // 使用客户端组件

import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 顶部导航栏，包含登录按钮 */}
      <header className="flex justify-end p-4 bg-white shadow-md">
        <Link href="/login">
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
            Login
          </button>
        </Link>
      </header>

      {/* 主内容区域 */}
      <main className="flex flex-grow items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to RSS Subscriber</h1>
          <p className="text-gray-600 mb-6">
            Manage your RSS subscriptions easily by registering an account.
          </p>

          {/* 注册按钮 */}
          <Link href="/register">
            <button className="px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
              Register Now
            </button>
          </Link>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="p-4 text-center text-gray-500">
        &copy; 2024 RSS Subscriber. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
