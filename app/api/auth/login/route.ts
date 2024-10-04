// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User'; // 确保模型的导入与之前的代码一致
import bcrypt from 'bcryptjs'; // 导入 bcryptjs

export async function POST(request: Request) {
    try {
        // 连接到数据库
        await connectToDatabase();

        // 从请求体中提取 email 和 password
        const { email, password } = await request.json();
        console.log('Received email:', email);
        console.log('Received password:', password);

        // 查找用户
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Login with proper credentials!' }, { status: 400 });
        }

        // 使用 bcrypt 进行密码比对
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return NextResponse.json({ error: 'Login with proper credentials!' }, { status: 400 });
        }

        // 密码匹配，返回认证成功
        return NextResponse.json({ success: 'Authenticated!' }, { status: 200 });

    } catch (error) {
        // 捕获错误并返回 500 错误
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
