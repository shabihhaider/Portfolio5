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

    // Budget display labels — stored as plain text to avoid Notion select option mismatches
    const budgetDisplayMap: Record<string, string> = {
        '400-800': '$400 – $800',
        '800-1500': '$800 – $1,500',
        '1500-3000': '$1,500 – $3,000',
        '3000+': '$3,000+',
        'discuss': "Let's Discuss",
        // legacy values
        'Under $200': 'Under $200',
        'under-100': 'Under $100',
        '100-400': '$100 – $400',
        '$400 - $800': '$400 – $800',
        '$800 - $1,500': '$800 – $1,500',
        '$1,500+': '$1,500+',
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

    if (formData.budget) {
        const budgetDisplay = budgetDisplayMap[formData.budget] ?? formData.budget;
        properties.Budget = {
            rich_text: [{ text: { content: budgetDisplay } }],
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

async function verifyRecaptcha(token: string): Promise<boolean> {
    if (!process.env.RECAPTCHA_SECRET_KEY) return true; // skip if not configured
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    const data = await res.json();
    return data.success && data.score >= 0.5;
}

export async function POST(request: Request) {
    try {
        const { name, email, projectType, budget, message, recaptchaToken } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const isHuman = await verifyRecaptcha(recaptchaToken ?? '');
        if (!isHuman) {
            return NextResponse.json(
                { error: 'reCAPTCHA verification failed' },
                { status: 400 }
            );
        }

        // Display-friendly label maps for emails
        const serviceLabels: Record<string, string> = {
            'landing-page': 'Landing Page',
            'wordpress': 'WordPress Development',
            'ai-integration': 'AI Integration',
            'custom-dev': 'Custom Development',
            'saas-dashboard': 'SaaS / Dashboard',
            'mobile-app': 'Mobile App',
            'other': 'Other',
        };
        const budgetLabels: Record<string, string> = {
            '400-800': '$400 – $800',
            '800-1500': '$800 – $1,500',
            '1500-3000': '$1,500 – $3,000',
            '3000+': '$3,000+',
            'discuss': "Let's Discuss",
        };

        const serviceLabel = projectType ? (serviceLabels[projectType] ?? projectType) : null;
        const budgetLabel = budget ? (budgetLabels[budget] ?? budget) : null;
        const firstName = name.split(' ')[0];

        // Email 1 — Admin notification
        await transporter.sendMail({
            from: `"Shabih. Agency" <${process.env.GMAIL_USER}>`,
            to: author.email,
            replyTo: email,
            subject: `New Lead: ${name}${serviceLabel ? ` — ${serviceLabel}` : ''}`,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#0A0A0A;border-radius:12px 12px 0 0;padding:32px 40px;border-bottom:3px solid #CCFF00;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0;color:#CCFF00;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Shabih. Agency</p>
                <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">New Project Inquiry</h1>
              </td>
              <td align="right">
                <span style="background:#CCFF00;color:#000;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:1px;">NEW LEAD</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Lead details -->
        <tr><td style="background:#ffffff;padding:32px 40px;">

          <!-- Name + Email row -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td width="50%" style="padding-right:12px;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Client Name</p>
                <p style="margin:0;font-size:16px;color:#111827;font-weight:600;">${name}</p>
              </td>
              <td width="50%" style="padding-left:12px;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Email</p>
                <p style="margin:0;font-size:15px;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-weight:500;">${email}</a></p>
              </td>
            </tr>
          </table>

          <!-- Service + Budget row -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              ${serviceLabel ? `
              <td width="50%" style="padding-right:12px;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Service Requested</p>
                <span style="display:inline-block;background:#f0fdf4;color:#166534;font-size:13px;font-weight:600;padding:5px 12px;border-radius:6px;border:1px solid #bbf7d0;">${serviceLabel}</span>
              </td>` : '<td width="50%"></td>'}
              ${budgetLabel ? `
              <td width="50%" style="padding-left:12px;vertical-align:top;">
                <p style="margin:0 0 4px;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Budget Range</p>
                <span style="display:inline-block;background:#fefce8;color:#854d0e;font-size:13px;font-weight:600;padding:5px 12px;border-radius:6px;border:1px solid #fde68a;">${budgetLabel}</span>
              </td>` : '<td width="50%"></td>'}
            </tr>
          </table>

          <!-- Message -->
          <div style="background:#f9fafb;border-left:3px solid #CCFF00;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
            <p style="margin:0 0 8px;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Message</p>
            <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</p>
          </div>

          <!-- CTA button -->
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="border-radius:8px;background:#0A0A0A;">
                <a href="mailto:${email}?subject=Re: Your project inquiry — Shabih. Agency" style="display:inline-block;padding:14px 28px;color:#CCFF00;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">Reply to ${firstName} →</a>
              </td>
            </tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-radius:0 0 12px 12px;padding:20px 40px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">Received via shabih.tech contact form &nbsp;·&nbsp; ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
            `,
        });

        // Email 2 — Client confirmation
        await transporter.sendMail({
            from: `"Shabih. Agency" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `We received your inquiry, ${firstName} — expect a response within 24 hours`,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#0A0A0A;border-radius:12px 12px 0 0;padding:32px 40px;">
          <p style="margin:0 0 6px;color:#CCFF00;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Shabih. Agency</p>
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">Your inquiry is in<br>good hands, ${firstName}.</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;">

          <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.7;">
            Thanks for reaching out to Shabih. Agency. We've reviewed your message and will send you a detailed response — including a project scope and quote — within <strong style="color:#111827;">24 hours</strong>.
          </p>

          <!-- What happens next -->
          <div style="background:#f9fafb;border-radius:10px;padding:24px 28px;margin:28px 0;">
            <p style="margin:0 0 16px;font-size:13px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:1px;">What happens next</p>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-bottom:14px;vertical-align:top;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:28px;height:28px;background:#CCFF00;border-radius:50%;text-align:center;vertical-align:middle;font-size:12px;font-weight:800;color:#000;flex-shrink:0;">1</td>
                      <td style="padding-left:14px;font-size:14px;color:#374151;line-height:1.5;"><strong style="color:#111827;">Scope review</strong> — We review your requirements and identify the right approach for your project.</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:14px;vertical-align:top;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:28px;height:28px;background:#CCFF00;border-radius:50%;text-align:center;vertical-align:middle;font-size:12px;font-weight:800;color:#000;">2</td>
                      <td style="padding-left:14px;font-size:14px;color:#374151;line-height:1.5;"><strong style="color:#111827;">Proposal & quote</strong> — You'll receive a fixed-price quote with a clear scope and timeline. No hourly surprises.</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="vertical-align:top;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:28px;height:28px;background:#CCFF00;border-radius:50%;text-align:center;vertical-align:middle;font-size:12px;font-weight:800;color:#000;">3</td>
                      <td style="padding-left:14px;font-size:14px;color:#374151;line-height:1.5;"><strong style="color:#111827;">Kickoff call</strong> — Once you approve the proposal, we align on details and get started immediately.</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>

          <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
            In the meantime, feel free to explore our work at <a href="https://shabih.tech/work" style="color:#2563eb;text-decoration:none;font-weight:500;">shabih.tech/work</a> to see what we've built for other clients.
          </p>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="border-radius:8px;background:#0A0A0A;">
                <a href="https://shabih.tech/work" style="display:inline-block;padding:13px 26px;color:#CCFF00;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">View Our Work →</a>
              </td>
            </tr>
          </table>

        </td></tr>

        <!-- Signature -->
        <tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <p style="margin:0 0 2px;font-size:15px;color:#111827;font-weight:700;">Shabih. Agency</p>
                <p style="margin:0 0 2px;font-size:13px;color:#6b7280;">Web Development &amp; AI Integration</p>
                <a href="https://shabih.tech" style="color:#2563eb;font-size:13px;text-decoration:none;">shabih.tech</a>
              </td>
              <td align="right">
                <p style="margin:0;font-size:12px;color:#9ca3af;">You're receiving this because<br>you submitted a form on shabih.tech</p>
              </td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
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
