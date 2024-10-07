import { NextResponse } from 'next/server';
import { sendMail } from '../../utils/mail'; // 正确导入 sendMail 函数

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    // 使用导入的 sendMail 函数
    let info = await sendMail(to, subject, text);
    return NextResponse.json({ message: '邮件发送成功', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email: ', error);
    return NextResponse.json({ error: '邮件发送失败' }, { status: 500 });
  }
}
