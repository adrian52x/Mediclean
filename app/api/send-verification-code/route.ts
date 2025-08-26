import { NextRequest, NextResponse } from 'next/server';
import { supabaseEmailVerificationService } from '@/lib/services/supabaseEmailVerificationService';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            );
        }

        // Use the service to handle complete verification workflow
        const result = await supabaseEmailVerificationService.sendVerificationCodeEmail(email);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('❌ [API] Verification email endpoint error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
