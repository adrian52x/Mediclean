import { NextRequest, NextResponse } from 'next/server';
import { resendEmailService } from '@/lib/services/resendEmailService';
import { isEmailVerificationTokenValid } from '@/lib/services/emailVerificationToken';
import { OrderDetails } from '@/types';

const ORDER_ID_PATTERN = /^DEZ-\d{2}\/\d{2}\/\d{4}-\d{4}-\d{2}$/;

// Validation functions
const validateOrderDetails = (orderDetails: any): { isValid: boolean; error?: string } => {
    if (!orderDetails) {
        return { isValid: false, error: 'Order details are required' };
    }

    if (!orderDetails.customer?.email) {
        return { isValid: false, error: 'Customer email is required' };
    }

    if (!orderDetails.orderId) {
        return { isValid: false, error: 'Order ID is required' };
    }

    // The order ID goes into the plain-text subject, so it must match generateOrderId()
    if (typeof orderDetails.orderId !== 'string' || !ORDER_ID_PATTERN.test(orderDetails.orderId)) {
        return { isValid: false, error: 'Invalid order ID' };
    }

    return { isValid: true };
};

// Error response helper
const createErrorResponse = (error: string, details?: any, statusCode: number = 500) => {
    return NextResponse.json(
        {
            success: false,
            error,
            details,
            service: 'resend'
        },
        { status: statusCode }
    );
};

// Success response helper
const createSuccessResponse = (messageId: string) => {
    return NextResponse.json({
        success: true,
        message: 'Order confirmation email sent successfully',
        messageId,
        service: 'resend'
    });
};

export async function POST(request: NextRequest) {
    try {
        //console.log('📧 [API] Order confirmation email endpoint called');

        // Parse and validate request body
        let orderDetails: OrderDetails;
        try {
            orderDetails = await request.json();
        } catch (parseError) {
            return createErrorResponse('Invalid JSON in request body', parseError, 400);
        }

        // Validate order details
        const validation = validateOrderDetails(orderDetails);
        if (!validation.isValid) {
            return createErrorResponse(validation.error!, undefined, 400);
        }

        // Only send to an address that passed code verification
        const verificationToken = request.headers.get('x-email-verification-token');
        if (!isEmailVerificationTokenValid(verificationToken, orderDetails.customer.email)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email is not verified',
                    code: 'EMAIL_NOT_VERIFIED',
                    service: 'resend'
                },
                { status: 401 }
            );
        }

        // Call email service
        const emailResult = await resendEmailService.sendOrderConfirmation(orderDetails);

        if (emailResult.success) {
            //console.log(`✅ [API] Email sent successfully. Message ID: ${emailResult.messageId}`);
            return createSuccessResponse(emailResult.messageId!);
        } else {
            return createErrorResponse(
                'Failed to send order confirmation email',
                emailResult.error,
                500
            );
        }

    } catch (error) {
        console.error('❌ [API] Unexpected error in email endpoint:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return createErrorResponse(
            'Internal server error',
            errorMessage,
            500
        );
    }
}
