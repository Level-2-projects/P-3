// packages/shared/src/index.ts
import { z } from 'zod';

//roles
export const UserRoleSchema = z.enum([
    'treating_doctor',
    'center_physician',
    'blood_bank_manager',
    'lab_tech',
    'reception_nurse',
    'facility_admin',
    'system_admin',
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

// Errors from backend
export interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
        details?: Array<Record<string, unknown>>;
        request_id: string;
    };
}

// chat boot allows
export const ActionCardSchema = z.discriminatedUnion('action', [
    z.object({
        action: z.literal('open_screen'),
        label: z.string(),
        screenKey: z.enum(['offers', 'inbox_requests', 'stock', 'expiry_list']),
        params: z.record(z.string()).optional(),
    }),
    z.object({
        action: z.literal('open_request_form'),
        label: z.string(),
        defaults: z.object({
            component_type: z.string(),
            abo: z.enum(['A', 'B', 'AB', 'O']),
            rh: z.enum(['+', '-']),
            qty_requested: z.number().int().positive(),
            priority: z.enum(['emergency', 'urgent', 'routine']),
        }),
    }),
]);
export type ActionCard = z.infer<typeof ActionCardSchema>;