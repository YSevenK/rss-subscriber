// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Subscription from '../../models/Subscription';

export async function POST(req: Request) {
    const { rssLink, email } = await req.json();

    await connectToDatabase();

    // 检查是否已经存在相同的订阅
    const existingSubscription = await Subscription.findOne({ email, rssLink });
    if (existingSubscription) {
        return NextResponse.json({ error: '该 RSS 链接已经被此邮箱订阅。' }, { status: 400 });
    }

    const subscription = new Subscription({
        rssLink, // 修复了字段名错误
        email,
        lastChecked: new Date(), // 之前是 `last_checked`
        lastContent: null, // 初始为空
    });

    await subscription.save();
    return NextResponse.json({ message: 'Subscription created' });
}
