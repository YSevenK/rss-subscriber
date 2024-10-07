import nodemailer from 'nodemailer';

// 定义 sendMail 函数并导出
export async function sendMail(to: string, subject: string, text: string) {
    try {
        // 创建可复用的 SMTP 传输对象
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // 定义邮件内容
        let mailOptions = {
            from: process.env.GMAIL_USER,
            to,
            subject,
            text,
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
