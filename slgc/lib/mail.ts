import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your App Password
    },
});

export async function sendVerificationEmail(email: string, token: string) {
    const domain = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verifyLink = `${domain}/verify-email?token=${token}`;

    const mailOptions = {
        from: '"GameHub Support" <your-email@gmail.com>',
        to: email,
        subject: 'Verify your GameHub Account',
        html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to GameHub! 🎮</h2>
        <p>Click the link below to verify your account and start your journey:</p>
        <a href="${verifyLink}" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Link expires in 24 hours.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}