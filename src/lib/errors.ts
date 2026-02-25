// ============================================================
// Standardized Error Classes — Zero-Error Architecture
// ============================================================

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode: number,
        code: string,
        isOperational = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ValidationError extends AppError {
    public readonly details: Record<string, string[]>;

    constructor(message: string, details: Record<string, string[]> = {}) {
        super(message, 400, "VALIDATION_ERROR");
        this.details = details;
    }
}

export class AuthError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401, "AUTH_ERROR");
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Insufficient permissions") {
        super(message, 403, "FORBIDDEN");
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, "NOT_FOUND");
    }
}

export class RateLimitError extends AppError {
    constructor(message = "Too many requests") {
        super(message, 429, "RATE_LIMIT_EXCEEDED");
    }
}

export class ServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message, 500, "INTERNAL_ERROR", false);
    }
}

// ============================================================
// Error Response Helper
// ============================================================

export interface ErrorResponse {
    error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
}

export function handleApiError(error: unknown): Response {
    // Known operational errors
    if (error instanceof AppError) {
        const body: ErrorResponse = {
            error: {
                code: error.code,
                message: error.message,
            },
        };

        if (error instanceof ValidationError && Object.keys(error.details).length > 0) {
            body.error.details = error.details;
        }

        return Response.json(body, { status: error.statusCode });
    }

    // Zod validation errors (from .parse() calls)
    if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as Error & { issues: Array<{ path: (string | number)[]; message: string }> };
        const details: Record<string, string[]> = {};

        for (const issue of zodError.issues) {
            const key = issue.path.join(".") || "_root";
            if (!details[key]) details[key] = [];
            details[key].push(issue.message);
        }

        const body: ErrorResponse = {
            error: {
                code: "VALIDATION_ERROR",
                message: "Request validation failed",
                details,
            },
        };

        return Response.json(body, { status: 400 });
    }

    // Unknown/unexpected errors — log but don't expose
    console.error("[ServerError]", error);

    const body: ErrorResponse = {
        error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred",
        },
    };

    return Response.json(body, { status: 500 });
}
