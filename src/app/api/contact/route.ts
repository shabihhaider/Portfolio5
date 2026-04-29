import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { author } from '@/lib/config/site';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(request: Request) {
    try {
        const { name, email, projectType, budget, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email 1 — Admin notification
        await transporter.sendMail({
            from: `"Shabih. Agency" <${process.env.GMAIL_USER}>`,
            to: author.email,
            replyTo: email,
            subject: `New Project Inquiry - ${name}`,
            html: `
                <div style="font-family: monospace; background: #0A0A0A; color: #fff; padding: 40px; border-radius: 12px;">
                    <div style="border-left: 4px solid #CCFF00; padding-left: 20px; margin-bottom: 30px;">
                        <h1 style="color: #CCFF00; margin: 0;">New Project Inquiry</h1>
                        <p style="color: #888; margin: 5px 0 0 0;">From shabih.tech contact form</p>
                    </div>

                    <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="color: #888; margin: 0 0 5px 0;">// FROM</p>
                        <p style="color: #fff; font-size: 18px; margin: 0;"><strong>${name}</strong></p>
                    </div>

                    <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="color: #888; margin: 0 0 5px 0;">// EMAIL</p>
                        <p style="color: #CCFF00; font-size: 16px; margin: 0;">
                            <a href="mailto:${email}" style="color: #CCFF00; text-decoration: none;">${email}</a>
                        </p>
                    </div>

                    ${projectType ? `
                    <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="color: #888; margin: 0 0 5px 0;">// PROJECT TYPE</p>
                        <p style="color: #fff; font-size: 16px; margin: 0;">${projectType}</p>
                    </div>
                    ` : ''}

                    ${budget ? `
                    <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="color: #888; margin: 0 0 5px 0;">// BUDGET</p>
                        <p style="color: #fff; font-size: 16px; margin: 0;">${budget}</p>
                    </div>
                    ` : ''}

                    <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="color: #888; margin: 0 0 10px 0;">// MESSAGE</p>
                        <p style="color: #fff; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                    </div>

                    <div style="border-top: 1px solid #222; padding-top: 20px; margin-top: 30px;">
                        <p style="color: #666; font-size: 12px; margin: 0;">
                            Sent via shabih.tech • ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `,
        });

        // Email 2 — Client thank you
        await transporter.sendMail({
            from: `"Shabih. Agency" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `Got your message, ${name.split(' ')[0]} — I'll be in touch soon`,
            html: `
                <div style="font-family: monospace; background: #0A0A0A; color: #fff; padding: 40px; border-radius: 12px; max-width: 600px;">
                    <div style="border-left: 4px solid #CCFF00; padding-left: 20px; margin-bottom: 30px;">
                        <h1 style="color: #CCFF00; margin: 0; font-size: 24px;">Message received.</h1>
                        <p style="color: #888; margin: 8px 0 0 0;">Shabih. Agency</p>
                    </div>

                    <p style="color: #ccc; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
                        Hi ${name.split(' ')[0]},
                    </p>

                    <p style="color: #ccc; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
                        Thanks for reaching out. I've received your message and will get back to you within <span style="color: #CCFF00;">24 hours</span>.
                    </p>

                    <p style="color: #ccc; font-size: 16px; line-height: 1.7; margin: 0 0 32px 0;">
                        In the meantime, feel free to reply to this email if you'd like to add anything.
                    </p>

                    <div style="border-top: 1px solid #222; padding-top: 24px;">
                        <p style="color: #fff; font-size: 15px; margin: 0 0 4px 0;"><strong>Muhammad Shabih Haider</strong></p>
                        <p style="color: #888; font-size: 13px; margin: 0 0 4px 0;">Shabih. Agency</p>
                        <a href="https://shabih.tech" style="color: #CCFF00; font-size: 13px; text-decoration: none;">shabih.tech</a>
                    </div>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
