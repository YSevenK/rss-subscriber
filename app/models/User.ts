// app/models/User.ts
import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

// 用户接口
export interface IUser extends Document {
    email: string;
    password: string;
    createdAt: Date;
    comparePassword: (password: string) => Promise<boolean>; // 返回 Promise 布尔值
}

// 用户模式
const UserSchema: Schema<IUser> = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [20, 'Password must be at most 20 characters long']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 密码加密
// TODO why???
UserSchema.pre<IUser>('save', async function (next: (err?: CallbackError) => void) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

// 定义异步密码比对方法
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password); // 使用异步比对密码
        console.log('Password match result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Error comparing password');
    }
};

// 确保只定义一次模型
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
