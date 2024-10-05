// app/models/Subscription.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
    user: mongoose.Types.ObjectId; // 指向 User 模型的 _id
    rssLink: string;
    email: string;
    status: string; // 状态字段
    createdAt: Date;
    updatedAt: Date; // 更新时间字段
}

const SubscriptionSchema: Schema = new Schema({
    user: { // 使用 user 字段引用 User 的 _id
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rssLink: {
        type: String,
        required: [true, 'RSS link is required'],
        trim: true,
        validate: {
            validator: function (v: string) {
                return /^https?:\/\/.+$/.test(v);
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
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email!`,
        },
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// 确保同一用户不能重复订阅同一 RSS 链接
SubscriptionSchema.index({ user: 1, rssLink: 1 }, { unique: true });

// 每次更新时更新更新时间字段
SubscriptionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// 导出模型
const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
export default Subscription;
