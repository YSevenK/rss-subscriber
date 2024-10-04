// app/lib/mongodb.ts
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || ''; // 从环境变量中获取 MongoDB 连接字符串

async function connectToDatabase() {
    try {
        if (mongoose.connection.readyState === 0) {
            console.log('Connecting to MongoDB...');
            await mongoose.connect(uri); // 连接到 MongoDB
            console.log('Successfully connected to MongoDB');
        }

        return { db: mongoose.connection }; // 返回 mongoose 连接实例
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Could not connect to database');
    }
}

export default connectToDatabase; // 默认导出
