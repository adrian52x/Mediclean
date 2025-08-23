import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationWithResend } from '@/lib/email/resendEmailService';

export async function POST(request: NextRequest) {
    try {
        console.log('📧 Resend API endpoint called');

        const orderDetails = await request.json();
        
        // Validate required fields
        if (!orderDetails?.customer?.email) {
            return NextResponse.json(
                { success: false, error: 'Customer email is required' },
                { status: 400 }
            );
        }

        if (!orderDetails?.orderId) {
            return NextResponse.json(
                { success: false, error: 'Order ID is required' },
                { status: 400 }
            );
        }

        console.log('📧 Order ID:', orderDetails.orderId);
        console.log('📧 Customer email:', orderDetails.customer.email);

        // Send email with Resend
        const emailResult = await sendOrderConfirmationWithResend(orderDetails);

        if (emailResult.success) {
            console.log('✅ Resend email sent successfully');
            return NextResponse.json({
                success: true,
                message: 'Order confirmation email sent successfully with Resend',
                messageId: emailResult.messageId,
                service: 'resend'
            });
        } else {
            console.error('❌ Failed to send email with Resend - Route error:', emailResult.error);
            return NextResponse.json(
                {
                success: false,
                error: emailResult.error,
                details: emailResult.error,
                service: 'resend'
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('❌ Resend API endpoint error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
                service: 'resend'
            },
            { status: 500 }
        );
    }
}
