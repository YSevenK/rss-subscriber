// app/api/mail/sendMail.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // 使用 SSL
    auth: {
        user: process.env.EMAIL_ADDRESS, // 发送邮箱地址
        pass: process.env.EMAIL_PASSWORD, // 邮箱密码
    },
});

export const sendMail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS, // 发送者
        to, // 接收者
        subject, // 邮件主题
        text, // 邮件内容
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
