import { NextRequest, NextResponse } from 'next/server';
import { supabaseEmailVerificationService } from '@/lib/email/supabaseEmailVerificationService';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const result = await supabaseEmailVerificationService.verifyCode(email, code);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email verified successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Code verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
