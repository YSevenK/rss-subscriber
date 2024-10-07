// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Subscription from '../../models/Subscription';
import { sendMail } from '../../utils/mail';

export async function POST(req: Request) {
    const { rssLink, email } = await req.json();

    await connectToDatabase();

    // 检查是否已经存在相同的订阅
    const existingSubscription = await Subscription.findOne({ email, rssLink });
    if (existingSubscription) {
        return NextResponse.json({ error: '该 RSS 链接已经被此邮箱订阅。' }, { status: 400 });
    }

    const subscription = new Subscription({
        rssLink,
        email,
        lastChecked: new Date(),
        lastContent: null,
    });

    await subscription.save();

    // 成功创建订阅后发送确认邮件
    try {
        await sendMail(email, '订阅确认', `您已成功订阅 RSS 链接: ${rssLink}`);
        return NextResponse.json({ message: '订阅成功，并且确认邮件已发送。' });
    } catch (error) {
        return NextResponse.json({ error: '订阅创建成功，但邮件发送失败。' }, { status: 500 });
    }
}
