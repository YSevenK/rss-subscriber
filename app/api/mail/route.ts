// app/api/mail/route.ts
import nodemailer from 'nodemailer';

export async function sendMail(to: string, subject: string, text: string) {
    try {
        // 创建可复用的 SMTP 传输对象
        let transporter = nodemailer.createTransport({
            service: 'gmail', // 使用 Gmail 作为服务
            auth: {
                user: process.env.GMAIL_USER, // 您的 Gmail 地址
                pass: process.env.GMAIL_PASSWORD, // 您的 Gmail 应用专用密码
            },
        });

        // 定义邮件内容
        let mailOptions = {
            from: process.env.GMAIL_USER, // 发件人地址
            to, // 收件人地址
            subject, // 邮件标题
            text, // 邮件正文
        };

        // 发送邮件
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw new Error('邮件发送失败');
    }
}
