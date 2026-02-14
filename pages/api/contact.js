import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Your email address where you want to receive contact form submissions
const YOUR_EMAIL = process.env.CONTACT_EMAIL || 'your-email@example.com';

// Email sender (must be from a verified domain in Resend, or use their default)
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Sanitize inputs
        const sanitizedName = name.trim().slice(0, 100);
        const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);
        const sanitizedMessage = message.trim().slice(0, 5000);

        // Send email notification to you
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: YOUR_EMAIL,
            replyTo: sanitizedEmail,
            subject: `🚀 New Contact from ${sanitizedName} - UPSERA`,
            html: generateEmailHTML({
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMessage,
                timestamp: new Date().toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'full',
                    timeStyle: 'short'
                })
            }),
            text: generateEmailText({
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMessage,
            })
        });

        if (error) {
            console.error('Resend API error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.'
            });
        }

        // Optional: Send auto-reply to user (uncomment if needed)
        // await sendAutoReply(sanitizedEmail, sanitizedName);

        console.log('Email sent successfully:', data?.id);

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully!',
            id: data?.id
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred. Please try again.'
        });
    }
}

// Generate beautiful HTML email template
function generateEmailHTML({ name, email, message, timestamp }) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 32px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                ✨ New Contact Received
                            </h1>
                            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                                Someone reached out through your website
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Contact Details Card -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
                                                    <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">From</p>
                                                    <p style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600;">${name}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 0; border-bottom: 1px solid #e2e8f0;">
                                                    <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Email</p>
                                                    <a href="mailto:${email}" style="color: #2563eb; font-size: 16px; text-decoration: none; font-weight: 500;">${email}</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 16px;">
                                                    <p style="margin: 0 0 4px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Received</p>
                                                    <p style="margin: 0; color: #1e293b; font-size: 14px;">${timestamp}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Message -->
                            <div style="margin-bottom: 32px;">
                                <p style="margin: 0 0 12px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Message</p>
                                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; border-left: 4px solid #2563eb;">
                                    <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
                                </div>
                            </div>
                            
                            <!-- Quick Reply Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="mailto:${email}?subject=Re: Your inquiry to UPSERA" 
                                           style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: #ffffff; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 14px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                                            📧 Reply to ${name}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1e293b; padding: 24px 40px; text-align: center;">
                            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 13px;">
                                This email was sent from your UPSERA contact form
                            </p>
                            <p style="margin: 0; color: #64748b; font-size: 12px;">
                                © ${new Date().getFullYear()} UPSERA. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// Generate plain text fallback
function generateEmailText({ name, email, message }) {
    return `
NEW CONTACT FORM SUBMISSION
============================

From: ${name}
Email: ${email}

Message:
${message}

---
Reply to this email to respond directly to ${name}.
    `.trim();
}

// Optional: Auto-reply function (uncomment in main handler if needed)
async function sendAutoReply(userEmail, userName) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: userEmail,
            subject: 'Thanks for reaching out! - UPSERA',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table role="presentation" width="500" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="text-align: center; padding-bottom: 24px;">
                            <h1 style="margin: 0; color: #1e293b; font-size: 24px;">Thanks, ${userName}! 🎉</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="margin: 0 0 16px; color: #475569; font-size: 15px; line-height: 1.7;">
                                We've received your message and will get back to you within 24-48 hours.
                            </p>
                            <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.7;">
                                In the meantime, feel free to explore our work!
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 32px; text-align: center;">
                            <p style="margin: 0; color: #94a3b8; font-size: 13px;">— The UPSERA Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
            text: `Thanks for reaching out, ${userName}!\n\nWe've received your message and will get back to you within 24-48 hours.\n\n— The UPSERA Team`
        });
    } catch (error) {
        console.error('Auto-reply failed:', error);
        // Don't throw - auto-reply is optional
    }
}
