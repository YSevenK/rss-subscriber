import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Subscription from '@/app/models/Subscription';


export async function POST(req: Request) {
    await connectToDatabase(); // 确保在处理请求之前连接数据库

    const { rssLink, email, user } = await req.json();

    if (!rssLink || !email || !user) {
        return NextResponse.json({ error: "RSS link, email, and user are required" }, { status: 400 });
    }

    try {
        const subscription = new Subscription({ rssLink, email, user });
        await subscription.save();
        return NextResponse.json({ message: "Subscription created", subscription }, { status: 201 });
    } catch (error) {
        console.error("Error creating subscription:", error);
        return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url); // 获取 URL 的查询参数
    const email = searchParams.get('email'); // 从查询参数中获取邮箱

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const subscriptions = await Subscription.find({ email });
        return NextResponse.json(subscriptions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { id, newRssLink, newEmail } = await req.json(); // 通过 id 找到要更新的订阅
    try {
        await connectToDatabase();
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            id, // 使用 id 进行更新
            { rssLink: newRssLink, email: newEmail },
            { new: true }
        );

        if (!updatedSubscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Subscription updated successfully', updatedSubscription });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json(); // 通过 id 删除订阅
    try {
        await connectToDatabase();
        const deletedSubscription = await Subscription.findByIdAndDelete(id); // 使用 id 删除

        if (!deletedSubscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
    }
}