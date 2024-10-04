import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { email, password } = await request.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already exists.' }, { status: 400 });
        }

        const newUser = await User.create({
            email,
            password
        });

        return NextResponse.json({ message: 'User registered successfully.', user: newUser }, { status: 201 });
    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
