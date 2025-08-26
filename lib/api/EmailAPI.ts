import { OrderDetails, EmailVerificationResponse, OrderEmailResponse } from '@/types';

export class EmailAPI {
    /**
     * Send email verification code to the provided email address
     */
    static async sendVerificationCode(email: string): Promise<EmailVerificationResponse> {
        const response = await fetch('/api/send-verification-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        return await response.json();
    }

    /**
     * Verify the email verification code
     */
    static async verifyEmailCode(email: string, code: string): Promise<EmailVerificationResponse> {
        const response = await fetch('/api/verify-email-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code }),
        });

        return await response.json();
    }

    /**
     * Send order confirmation email using Resend
     */
    static async sendOrderConfirmationEmail(orderDetails: OrderDetails): Promise<OrderEmailResponse> {
        const response = await fetch('/api/send-order-email-resend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails),
        });

        return await response.json();
    }
}
