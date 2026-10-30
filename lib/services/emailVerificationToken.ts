// Server-only: holds the signing secret. Never import this into a client component.
import { createHmac, timingSafeEqual } from 'crypto';

// Long enough for the customer to finish the checkout form after verifying.
const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MIN_SECRET_LENGTH = 32;

function getSecret(): string {
    const secret = process.env.EMAIL_VERIFICATION_TOKEN_SECRET;

    if (!secret || secret.length < MIN_SECRET_LENGTH) {
        throw new Error(`EMAIL_VERIFICATION_TOKEN_SECRET must be at least ${MIN_SECRET_LENGTH} characters`);
    }

    return secret;
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function sign(payload: string): string {
    return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

/**
 * Create a short-lived token proving that this email passed code verification
 */
export function createEmailVerificationToken(email: string): string {
    const payload = Buffer.from(
        JSON.stringify({ email: normalizeEmail(email), exp: Date.now() + TOKEN_TTL_MS })
    ).toString('base64url');

    return `${payload}.${sign(payload)}`;
}

/**
 * Check the signature, the expiry, and that the token was issued for this email
 */
export function isEmailVerificationTokenValid(token: unknown, email: unknown): boolean {
    if (typeof token !== 'string' || typeof email !== 'string') {
        return false;
    }

    const parts = token.split('.');
    if (parts.length !== 2) {
        return false;
    }

    const [payload, signature] = parts;
    const expectedSignature = Buffer.from(sign(payload));
    const receivedSignature = Buffer.from(signature);

    if (
        expectedSignature.length !== receivedSignature.length ||
        !timingSafeEqual(expectedSignature, receivedSignature)
    ) {
        return false;
    }

    try {
        const { email: tokenEmail, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));

        return tokenEmail === normalizeEmail(email) && typeof exp === 'number' && Date.now() < exp;
    } catch {
        return false;
    }
}
