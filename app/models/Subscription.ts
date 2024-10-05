// app/models/Subscription.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
    rssLink: string;
    email: string;
    status: string; // 状态字段，表示订阅是否有效
    lastChecked: Date; // 上次检查更新的时间
    lastContent: string | null; // 上次获取的内容，用于比较更新
    createdAt: Date;
    updatedAt: Date; // 更新时间字段
}

const SubscriptionSchema: Schema = new Schema({
    rssLink: {
        type: String,
        required: [true, 'RSS link is required'],
        trim: true,
        validate: {
            validator: function (v: string) {
                return /^https?:\/\/.+$/.test(v); // 检查是否为有效的 URL
            },
            message: (props: any) => `${props.value} is not a valid URL!`,
        },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // 检查是否为有效的邮箱
            },
            message: (props: any) => `${props.value} is not a valid email!`,
        },
    },
    status: {
        type: String,
        enum: ['active', 'inactive'], // 订阅状态，默认为 active
        default: 'active',
    },
    lastChecked: {
        type: Date,
        default: Date.now, // 默认上次检查时间为当前时间
    },
    lastContent: {
        type: String,
        default: null, // 初始内容为空
    },
    createdAt: {
        type: Date,
        default: Date.now, // 创建时间默认为当前时间
    },
    updatedAt: {
        type: Date,
        default: Date.now, // 更新时间默认为当前时间
    },
});

// 确保同一邮箱不能重复订阅同一 RSS 链接
SubscriptionSchema.index({ email: 1, rssLink: 1 }, { unique: true });

// 每次更新时自动更新 `updatedAt` 字段
SubscriptionSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// 导出模型
const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
export default Subscription;
