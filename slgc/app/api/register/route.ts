import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        await connectDB();

        // 1. Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Generate Token
        const verifyToken = uuidv4();
        const verifyTokenExpiry = new Date(Date.now() + 24 * 3600 * 1000); // 24 hours

        // 4. Create User (Unverified)
        await User.create({
            name,
            email,
            password: hashedPassword,
            verifyToken,
            verifyTokenExpiry,
            isVerified: false
        });

        // 5. Send Email
        await sendVerificationEmail(email, verifyToken);

        return NextResponse.json({ message: "User registered. Please check your email." });

    } catch (error) {
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}