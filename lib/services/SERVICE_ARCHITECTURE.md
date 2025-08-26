# Service Architecture Standards

## Overview
This document outlines the standardized patterns for all services in the Mediclean application.

## Service Design Patterns

### ✅ **Standardized Service Structure**

All services now follow this unified pattern:

```typescript
class ServiceName {
    private static instance: ServiceName;
    private dependency: ExternalService;
    private readonly CONFIG_CONSTANT = value;

    // Private constructor prevents direct instantiation
    private constructor() {
        // Validate environment variables
        if (!process.env.REQUIRED_VAR) {
            throw new Error('Environment variable is required');
        }
        
        // Initialize dependencies
        this.dependency = new ExternalService();
    }

    // Singleton pattern implementation
    static getInstance(): ServiceName {
        if (!ServiceName.instance) {
            ServiceName.instance = new ServiceName();
        }
        return ServiceName.instance;
    }

    // Public async methods with proper typing
    async methodName(param: Type): Promise<ResponseType> {
        try {
            // Implementation with proper error handling
        } catch (error) {
            // Structured error handling
        }
    }

    // Private helper methods
    private helperMethod(): ReturnType {
        // Implementation
    }
}

// Export singleton instance for general use
export const serviceName = ServiceName.getInstance();

// Export class for advanced use cases
export { ServiceName };
```

## Current Services

### 1. **ResendEmailService** 
- **Purpose**: Order confirmation emails via Resend API
- **Pattern**: ✅ Singleton with private constructor
- **Export**: `resendEmailService` instance + `ResendEmailService` class
- **Key Methods**: `sendOrderConfirmation()`

### 2. **SupabaseEmailVerificationService**
- **Purpose**: Complete email verification workflow including code generation, storage, validation, and email sending
- **Pattern**: ✅ Singleton with private constructor  
- **Export**: `supabaseEmailVerificationService` instance + `SupabaseEmailVerificationService` class
- **Key Methods**: 
  - `sendVerificationCodeEmail()` - Complete workflow: generates code, stores in DB, sends email
  - `generateCode()` - Internal: generates and stores verification code
  - `verifyCode()` - Validates verification code with attempt tracking
  - `hasValidCode()` - Checks if email has valid unexpired code
  - `getRemainingTime()` - Gets remaining time for verification code
- **Dependencies**: Supabase (code storage), Resend (email delivery)
- **Return Types**: ✅ Uses standardized `EmailVerificationResponse` interface

## Benefits of This Architecture

### 🚀 **Performance**
- **Memory Efficiency**: Single instance per service across the application
- **Connection Reuse**: Database and API connections are reused
- **Reduced Initialization Cost**: Services initialize once

### 🔒 **Security & Reliability**
- **Environment Validation**: Constructor validates required environment variables
- **Controlled Instantiation**: Private constructors prevent misuse
- **Consistent Error Handling**: Standardized error patterns

### 🧩 **Maintainability**
- **Consistent API**: All services follow the same pattern
- **Type Safety**: Full TypeScript support with proper interfaces
- **Easy Testing**: Singleton pattern allows for easy mocking
- **Clear Dependencies**: Dependencies are clearly defined in constructor

## Usage Examples

### Basic Usage (Recommended)
```typescript
import { resendEmailService } from '@/lib/services/resendEmailService';
import { supabaseEmailVerificationService } from '@/lib/services/supabaseEmailVerificationService';

// Use service methods directly
const result = await resendEmailService.sendOrderConfirmation(orderDetails);
const code = await supabaseEmailVerificationService.generateCode(email);
```

### Advanced Usage
```typescript
import { ResendEmailService } from '@/lib/services/resendEmailService';

// Get instance for advanced operations
const emailService = ResendEmailService.getInstance();
const result = await emailService.sendOrderConfirmation(orderDetails);
```

## API Integration

Services are consumed by API routes:

```typescript
// In API routes
import { resendEmailService } from '@/lib/services/resendEmailService';

export async function POST(request: NextRequest) {
    const emailResult = await resendEmailService.sendOrderConfirmation(orderDetails);
    // Handle result
}
```

## Client-Side Integration

Client components use the EmailAPI wrapper:

```typescript
// In React components
import { EmailAPI } from '@/lib/api/EmailAPI';

const result = await EmailAPI.sendOrderConfirmationEmail(orderDetails);
```

## Migration Notes

### ✅ Completed
- **ResendEmailService**: Converted to proper singleton pattern
- **SupabaseEmailVerificationService**: Fully standardized with private constructor, environment validation, structured logging, and consistent return types
- **Route Integration**: Updated `/api/send-order-email-resend` to use new pattern
- **Type Safety**: All services use consolidated types from `types.ts`

### 🎯 Consistency Achieved
- Both services now follow identical architectural patterns
- Consistent export strategies
- Unified error handling approaches
- Standardized logging patterns

## Best Practices

1. **Always use the exported instance** for normal operations
2. **Validate environment variables** in the constructor
3. **Use structured logging** with consistent prefixes
4. **Return typed responses** that match interfaces in `types.ts`
5. **Handle errors gracefully** with proper error objects
6. **Keep private methods focused** on single responsibilities

This architecture ensures professional, maintainable, and scalable service layer for the Mediclean application.
