import { z } from 'zod';

// User validation schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

// Itinerary validation schemas
export const createItinerarySchema = z.object({
  name: z.string().min(1, 'Itinerary name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  isPublic: z.boolean().default(false),
});

export const updateItinerarySchema = z.object({
  name: z.string().min(1, 'Itinerary name is required').max(100, 'Name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  isPublic: z.boolean().optional(),
});

// Invitation validation schemas
export const inviteUserSchema = z.object({
  itineraryId: z.string().min(1, 'Itinerary ID is required'),
  email: z.string().email('Invalid email address').toLowerCase(),
  role: z.enum(['viewer', 'editor'], { message: 'Role must be viewer or editor' }),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1, 'Invitation token is required'),
});

// Collaboration validation schemas
export const collaboratorUpdateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['viewer', 'editor'], { message: 'Role must be viewer or editor' }),
});

// Pusher event validation schemas
export const pusherTriggerSchema = z.object({
  channel: z.string().min(1, 'Channel is required'),
  event: z.string().min(1, 'Event is required'),
  data: z.record(z.string(), z.any()),
});

// Rate limiting schemas
export const rateLimitSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  limit: z.number().min(1, 'Limit must be positive'),
  window: z.number().min(1, 'Window must be positive'),
});

// Input sanitization
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Validation helper functions
export function validateObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function validateUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

// Permission validation
export function validateItineraryAccess(
  itinerary: any,
  userId: string,
  requiredRole: 'owner' | 'editor' | 'viewer' = 'viewer'
): boolean {
  if (!itinerary || !userId) return false;

  // Owner has all permissions
  if (itinerary.owner.toString() === userId) return true;

  // Check collaborator permissions
  const collaborator = itinerary.collaborators?.find(
    (c: any) => c.user.toString() === userId
  );

  if (!collaborator) return false;

  // Check role hierarchy: owner > editor > viewer
  const roleHierarchy: Record<string, number> = { owner: 3, editor: 2, viewer: 1 };
  const userRole = collaborator.role;
  
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}

// Error response helpers
export function createErrorResponse(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}

export function createValidationErrorResponse(errors: z.ZodError) {
  const formattedErrors = errors.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
  
  return Response.json(
    { 
      error: 'Validation failed', 
      details: formattedErrors 
    }, 
    { status: 400 }
  );
}

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;",
};