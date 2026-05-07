import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { author } from '@/lib/config/site';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

type LeadFormData = {
    name: string;
    email: string;
    projectType?: string;
    budget?: string;
    message?: string;
};

async function addLeadToNotion(formData: LeadFormData) {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_LEADS_DB_ID) {
        return;
    }

    const serviceMap: Record<string, string> = {
        'Landing Page': 'Landing Page',
        'landing-page': 'Landing Page',
        'WordPress': 'WordPress',
        'wordpress': 'WordPress',
        'AI Integration': 'AI Integration',
        'ai-integration': 'AI Integration',
        'Web Application': 'Custom Web App',
        'custom-dev': 'Custom Web App',
        'SaaS / Dashboard': 'SaaS Dashboard',
        'saas-dashboard': 'SaaS Dashboard',
        'Mobile App': 'Mobile App',
        'mobile-app': 'Mobile App',
        'Speed Optimisation': 'Speed Optimisation',
    };

    const budgetMap: Record<string, string> = {
        'Under $200': 'Under 200',
        'Under $100': 'Under 200',
        'under-100': 'Under 200',
        '$200 - $500': '200 to 500',
        '$100 - $400': '200 to 500',
        '100-400': '200 to 500',
        '$500 - $1,000': '500 to 1000',
        '$400 - $800': '500 to 1000',
        '400-800': '500 to 1000',
        '$1,000 - $3,000': '1000 to 3000',
        '$800 - $1,500': '1000 to 3000',
        '800-1500': '1000 to 3000',
        '$1,500 - $3,000': '3000 to 5000',
        '1500-3000': '3000 to 5000',
        '$3,000+': '5000 plus',
        '3000+': '5000 plus',
        '$3,000 - $5,000': '3000 to 5000',
        '$5,000+': '5000 plus',
        '$1,500+': '3000 to 5000',
        '1500+': '3000 to 5000',
    };

    const properties: Record<string, any> = {
        Name: {
            title: [{ text: { content: formData.name } }],
        },
        Email: {
            email: formData.email,
        },
        Status: {
            select: { name: 'New' },
        },
        Source: {
            select: { name: 'shabih.tech Form' },
        },
        Priority: {
            select: { name: 'Medium' },
        },
        'Date Contacted': {
            date: { start: new Date().toISOString().split('T')[0] },
        },
    };

    if (formData.message) {
        properties.Notes = {
            rich_text: [{ text: { content: formData.message } }],
        };
    }

    if (formData.projectType && serviceMap[formData.projectType]) {
        properties.Service = {
            select: { name: serviceMap[formData.projectType] },
        };
    }

    if (formData.budget && budgetMap[formData.budget]) {
        properties.Budget = {
            select: { name: budgetMap[formData.budget] },
        };
    }

    await notion.pages.create({
        parent: { database_id: process.env.NOTION_LEADS_DB_ID },
        properties,
    });
}

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

        try {
            await addLeadToNotion({ name, email, projectType, budget, message });
        } catch (notionError) {
            console.error('Notion lead creation failed:', notionError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
