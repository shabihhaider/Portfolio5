import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        // Validate inputs
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Send email to you (notification)
        await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: 'shabihhaider191@gmail.com',
            subject: `🚀 New Message from Portfolio - ${name}`,
            html: `
                <div style="font-family: 'JetBrains Mono', monospace; background: #0A0A0A; color: #fff; padding: 40px; border-radius: 12px;">
                    <div style="border-left: 4px solid #CCFF00; padding-left: 20px; margin-bottom: 30px;">
                        <h1 style="color: #CCFF00; margin: 0;">New Transmission Received</h1>
                        <p style="color: #888; margin: 5px 0 0 0;">From your portfolio contact form</p>
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
                    
                    <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="color: #888; margin: 0 0 10px 0;">// MESSAGE</p>
                        <p style="color: #fff; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <div style="border-top: 1px solid #222; padding-top: 20px; margin-top: 30px;">
                        <p style="color: #666; font-size: 12px; margin: 0;">
                            Sent via Muhammad Shabih Haider's Portfolio • ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `,
        });

        // Send auto-reply to visitor
        // NOTE: This will only work if you verify a custom domain on Resend.
        // For testing/free tier, you can only send to your own email.
        // await resend.emails.send({
        //     from: 'Muhammad Shabih Haider <onboarding@resend.dev>',
        //     to: email,
        //     subject: '✅ Message Received - Muhammad Shabih Haider',
        //     html: `
        //         <div style="font-family: 'JetBrains Mono', monospace; background: #0A0A0A; color: #fff; padding: 40px; border-radius: 12px;">
        //             ... (template content) ...
        //         </div>
        //     `,
        // });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
