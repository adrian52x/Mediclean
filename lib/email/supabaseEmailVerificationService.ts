// Production-ready Email verification service using Supabase
import { createClient } from '@supabase/supabase-js';

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
  private readonly EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 3;

  constructor() {
    // Use service role key for admin operations
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
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
        console.error('Error cleaning up expired codes:', error);
      }
    } catch (error) {
      console.error('Error in cleanupExpiredCodes:', error);
    }
  }

  async generateCode(email: string): Promise<string> {
    try {
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
        throw error;
      }

      return code;
    } catch (error) {
      console.error('Error generating verification code:', error);
      throw new Error('Failed to generate verification code');
    }
  }

  async verifyCode(email: string, inputCode: string): Promise<{ success: boolean; error?: string }> {
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
        return { success: false, error: 'Codul de verificare nu a fost găsit sau a expirat' };
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
        
        return { success: false, error: 'Codul de verificare a expirat' };
      }

      // Check max attempts
      if (verificationData.attempts >= this.MAX_ATTEMPTS) {
        // Delete code after max attempts
        await this.supabase
          .from('verification_codes')
          .delete()
          .eq('email', email);
        
        return { success: false, error: 'Prea multe încercări. Te rugăm să soliciți un cod nou' };
      }

      // Increment attempts first
      const newAttempts = verificationData.attempts + 1;
      
      if (verificationData.code === inputCode) {
        // Code is correct - delete it
        await this.supabase
          .from('verification_codes')
          .delete()
          .eq('email', email);
        
        return { success: true };
      } else {
        // Code is wrong - check if this was the last attempt
        if (newAttempts >= this.MAX_ATTEMPTS) {
          // Delete code after max attempts reached
          await this.supabase
            .from('verification_codes')
            .delete()
            .eq('email', email);
          
          return { success: false, error: 'Prea multe încercări. Te rugăm să soliciți un cod nou' };
        } else {
          // Update attempts and show remaining
          await this.supabase
            .from('verification_codes')
            .update({ attempts: newAttempts })
            .eq('email', email);
          
          const remainingAttempts = this.MAX_ATTEMPTS - newAttempts;
          return { 
            success: false, 
            error: `Cod de verificare invalid. Mai ai ${remainingAttempts} ${remainingAttempts === 1 ? 'încercare' : 'încercări'}` 
          };
        }
      }

    } catch (error) {
      console.error('Error verifying code:', error);
      return { success: false, error: 'Eroare la verificarea codului' };
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
      console.error('Error checking valid code:', error);
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
      console.error('Error getting remaining time:', error);
      return 0;
    }
  }
}

export const supabaseEmailVerificationService = SupabaseEmailVerificationService.getInstance();
