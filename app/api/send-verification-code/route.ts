import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseEmailVerificationService } from '@/lib/email/supabaseEmailVerificationService';

const resend = new Resend(process.env.RESEND_API_KEY_VERIFICATION);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = await supabaseEmailVerificationService.generateCode(email);

    // Email template for verification code
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cod de verificare - Dezinfect</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0891b2, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; text-align: center; }
          .code { background: white; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0891b2; }
          .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin: 15px 0; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Verificare Email - Dezinfect MD</h1>
            <p>Codul tău de verificare</p>
          </div>
          <div class="content">
            <p>Pentru a continua cu comanda, te rugăm să introduci codul de verificare:</p>
            <div class="code">${code}</div>
            <div class="warning">
              <strong>⚠️ Important:</strong><br>
              • Acest cod este valabil 10 minute<br>
              • Ai maximum 3 încercări pentru introducere<br>
              • Dacă nu ai solicitat acest cod, poți ignora acest email
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Dezinfect MD. Toate drepturile rezervate.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send verification email
    const emailResult = await resend.emails.send({
      from: 'Dezinfect MD <noreply@dezinfect.md>',
      to: email,
      subject: 'Cod verificare Email',
      html: emailHtml,
    });

    if (emailResult.error) {
      //console.error('❌ Failed to send verification email:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    //console.log('✅ Verification email sent successfully to:', email);
    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully'
    });

  } catch (error) {
    console.error('❌ Verification email error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
