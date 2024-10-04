import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';

export interface CustomError extends Error {
    statusCode?: number;
}

export async function GET() {
    try {
        await connectToDatabase();
        return NextResponse.json({ message: 'Database connection successful!' });
    } catch (error) {
        const customError = error as CustomError; // 将 error 转换为 CustomError 类型
        return NextResponse.json({ message: 'Database connection failed!', error: customError.message }, { status: 500 });
    }
}
