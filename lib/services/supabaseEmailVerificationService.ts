// Production-ready Email verification service using Supabase
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { EmailVerificationResponse } from '@/types';

interface VerificationData {
    id: string;
    email: string;
    code: string;
    attempts: number;
    created_at: string;
    expires_at: string;
}

class SupabaseEmailVerificationService {
    private static instance: SupabaseEmailVerificationService;
    private supabase;
    private resend: Resend;
    private readonly EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
    private readonly MAX_ATTEMPTS = 3;

    private constructor() {
        // Validate required environment variables
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required');
        }
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
        }
        if (!process.env.RESEND_API_KEY_VERIFICATION) {
            throw new Error('RESEND_API_KEY_VERIFICATION environment variable is required');
        }

        // Use service role key for admin operations
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                autoRefreshToken: false,
                persistSession: false
                }
            }
        );

        // Initialize Resend for verification emails
        this.resend = new Resend(process.env.RESEND_API_KEY_VERIFICATION);

        //console.log('🔧 [SupabaseEmailVerificationService] Service initialized');
    }

    static getInstance(): SupabaseEmailVerificationService {
        if (!SupabaseEmailVerificationService.instance) {
            SupabaseEmailVerificationService.instance = new SupabaseEmailVerificationService();
        }
        return SupabaseEmailVerificationService.instance;
    }

    private async cleanupExpiredCodes(): Promise<void> {
        try {
            const now = new Date().toISOString();
            
            const { error } = await this.supabase
                .from('verification_codes')
                .delete()
                .lt('expires_at', now);

            if (error) {
                console.error('❌ [SupabaseEmailVerificationService] Error cleaning up expired codes:', error);
            }
        } catch (error) {
            console.error('❌ [SupabaseEmailVerificationService] Error in cleanupExpiredCodes:', error);
        }
    }

    async generateCode(email: string): Promise<string> {
        try {
            //console.log(`📧 [SupabaseEmailVerificationService] Generating verification code for: ${email}`);
            
            // Clean up expired codes first
            await this.cleanupExpiredCodes();

            // Delete any existing codes for this email
            await this.supabase
                .from('verification_codes')
                .delete()
                .eq('email', email);

            // Generate 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Calculate expiry time
            const expiresAt = new Date(Date.now() + this.EXPIRY_TIME).toISOString();

            // Insert new verification code
            const { error } = await this.supabase
                .from('verification_codes')
                .insert({
                    email,
                    code,
                    attempts: 0,
                    expires_at: expiresAt
                });

            if (error) {
                console.error(`❌ [SupabaseEmailVerificationService] Database error for ${email}:`, error);
                throw error;
            }

            return code;
        } catch (error) {
            console.error('❌ [SupabaseEmailVerificationService] Error generating verification code:', error);
            throw new Error('Failed to generate verification code');
        }
    }

    async verifyCode(email: string, inputCode: string): Promise<EmailVerificationResponse> {
        try {
            // Clean up expired codes first
            await this.cleanupExpiredCodes();

            // Get the verification code for this email
            const { data, error } = await this.supabase
                .from('verification_codes')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !data) {
                return { 
                    success: false, 
                    error: 'Codul de verificare nu a fost găsit sau a expirat',
                    message: 'Code not found or expired'
                };
            }

            const verificationData = data as VerificationData;

            // Check if expired
            const now = new Date();
            const expiresAt = new Date(verificationData.expires_at);
            
            if (now > expiresAt) {
                // Delete expired code
                await this.supabase
                .from('verification_codes')
                .delete()
                .eq('email', email);
                
                return { 
                    success: false, 
                    error: 'Codul de verificare a expirat',
                    message: 'Verification code expired'
                };
            }

            // Check max attempts
            if (verificationData.attempts >= this.MAX_ATTEMPTS) {
                // Delete code after max attempts
                await this.supabase
                    .from('verification_codes')
                    .delete()
                    .eq('email', email);
                
                return { 
                    success: false, 
                    error: 'Prea multe încercări. Te rugăm să soliciți un cod nou',
                    message: 'Maximum attempts reached'
                };
            }

            // Increment attempts first
            const newAttempts = verificationData.attempts + 1;
            
            if (verificationData.code === inputCode) {
                // Code is correct - delete it
                await this.supabase
                    .from('verification_codes')
                    .delete()
                    .eq('email', email);
                
                return { 
                    success: true,
                    message: 'Email verified successfully'
                };
            } else {
                // Code is wrong - check if this was the last attempt
                if (newAttempts >= this.MAX_ATTEMPTS) {
                    // Delete code after max attempts reached
                    await this.supabase
                        .from('verification_codes')
                        .delete()
                        .eq('email', email);
                    
                    return { 
                        success: false, 
                        error: 'Prea multe încercări. Te rugăm să soliciți un cod nou',
                        message: 'Maximum attempts reached'
                    };
                } else {
                    // Update attempts and show remaining
                    await this.supabase
                        .from('verification_codes')
                        .update({ attempts: newAttempts })
                        .eq('email', email);
                    
                    const remainingAttempts = this.MAX_ATTEMPTS - newAttempts;
                    return { 
                        success: false, 
                        error: `Cod de verificare invalid. Mai ai ${remainingAttempts} ${remainingAttempts === 1 ? 'încercare' : 'încercări'}`,
                        message: `Invalid code, ${remainingAttempts} attempts remaining`
                    };
                }
            }

        } catch (error) {
            return { 
                success: false, 
                error: 'Eroare la verificarea codului',
                message: 'Internal error during code verification'
            };
        }
    }

    async hasValidCode(email: string): Promise<boolean> {
        try {
            await this.cleanupExpiredCodes();

            const { data, error } = await this.supabase
                .from('verification_codes')
                .select('expires_at')
                .eq('email', email)
                .single();

            if (error || !data) return false;

            const now = new Date();
            const expiresAt = new Date(data.expires_at);
            
            return now <= expiresAt;
        } catch (error) {
            return false;
        }
    }

    async getRemainingTime(email: string): Promise<number> {
        try {
            const { data, error } = await this.supabase
                .from('verification_codes')
                .select('expires_at')
                .eq('email', email)
                .single();

            if (error || !data) return 0;

            const now = Date.now();
            const expiresAt = new Date(data.expires_at).getTime();
            const remaining = expiresAt - now;

            return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
        } catch (error) {
            return 0;
        }
    }

    /**
     * Send verification code email and store it in database
     */
    async sendVerificationCodeEmail(email: string): Promise<EmailVerificationResponse> {
        try {
            // Generate and store verification code
            const code = await this.generateCode(email);

            // Generate email template
            const emailHtml = this.generateVerificationEmailTemplate(code);

            // Send verification email
            const emailResult = await this.resend.emails.send({
                from: 'Dezinfect MD <noreply@dezinfect.md>',
                to: email,
                subject: 'Cod verificare Email',
                html: emailHtml,
            });

            if (emailResult.error) {
                console.error(`❌ [SupabaseEmailVerificationService] Resend error for ${email}:`, emailResult.error);
                return {
                    success: false,
                    error: 'Failed to send verification email',
                    message: 'Email delivery failed'
                };
            }
            
            return {
                success: true,
                message: 'Verification code sent successfully'
            };

        } catch (error) {
            console.error('❌ [SupabaseEmailVerificationService] Error sending verification email:', error);
            return {
                success: false,
                error: 'Internal server error',
                message: 'Failed to send verification email'
            };
        }
    }

    /**
     * Generate HTML email template for verification code
     */
    private generateVerificationEmailTemplate(code: string): string {
        return `
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
    }
}

// Export singleton instance
export const supabaseEmailVerificationService = SupabaseEmailVerificationService.getInstance();

// Export class for advanced use cases
export { SupabaseEmailVerificationService };
