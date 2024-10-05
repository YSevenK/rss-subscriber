// app/dashboard/page.tsx

"use client";

import React, { useEffect, useState } from "react";

const DashboardPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 模拟获取用户订阅的RSS链接
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const res = await fetch('/api/subscribe');
                const data = await res.json();
                setSubscriptions(data.subscriptions);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

                {subscriptions.length > 0 ? (
                    <div>
                        <h2 className="text-xl mb-4">Your Subscriptions:</h2>
                        <ul className="list-disc pl-5">
                            {subscriptions.map((subscription: any, index: number) => (
                                <li key={index} className="mb-2">
                                    <a href={subscription.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                                        {subscription.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-600">You have no subscriptions yet.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
