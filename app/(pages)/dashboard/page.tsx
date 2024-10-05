// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';

interface Subscription {
    _id: string;
    rssLink: string;
    email: string;
    user: string;
}

const DashboardPage = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [rssLink, setRssLink] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 从后端获取订阅
    const fetchSubscriptions = async () => {
        if (!email) return; // 如果没有邮箱，则不获取订阅

        setLoading(true); // 设置加载状态
        setError(null); // 清除错误状态

        try {
            const response = await fetch(`/api/subscribe?email=${encodeURIComponent(email)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch subscriptions');
            }

            setSubscriptions(data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setError('Failed to fetch subscriptions');
            setSubscriptions([]); // 清空订阅列表
        } finally {
            setLoading(false); // 清除加载状态
        }
    };

    // 处理添加订阅
    const handleAddSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true); // 设置加载状态
        setError(null); // 清除错误状态

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rssLink, email, user: '6700d09b45dfe34f64611cd3' }), // 用户 ID 需替换为实际的用户 ID
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add subscription');
            }

            fetchSubscriptions(); // 重新获取订阅列表
            setRssLink(''); // 清空 RSS Link 输入框
        } catch (error) {
            console.error('Failed to add subscription:', error);
            setError('Failed to add subscription');
        } finally {
            setLoading(false); // 清除加载状态
        }
    };

    // 处理删除订阅
    const handleDeleteSubscription = async (id: string) => {
        setLoading(true); // 设置加载状态
        setError(null); // 清除错误状态

        try {
            const response = await fetch('/api/subscribe', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete subscription');
            }

            fetchSubscriptions(); // 重新获取订阅列表
        } catch (error) {
            console.error('Failed to delete subscription:', error);
            setError('Failed to delete subscription');
        } finally {
            setLoading(false); // 清除加载状态
        }
    };

    useEffect(() => {
        fetchSubscriptions(); // 初次加载时获取订阅
    }, [email]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">RSS Subscriptions</h1>
            <form onSubmit={handleAddSubscription} className="my-4">
                <input
                    type="text"
                    placeholder="RSS Link"
                    value={rssLink}
                    onChange={(e) => setRssLink(e.target.value)}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 mr-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Subscription'}
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-xl">Your Subscriptions:</h2>
            {loading ? (
                <p>Loading subscriptions...</p>
            ) : subscriptions.length > 0 ? (
                <ul>
                    {subscriptions.map((subscription) => (
                        <li key={subscription._id} className="flex justify-between">
                            <span>{subscription.rssLink}</span>
                            <button
                                onClick={() => handleDeleteSubscription(subscription._id)}
                                className="bg-red-500 text-white p-1"
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No subscriptions found.</p>
            )}
        </div>
    );
};

export default DashboardPage;
