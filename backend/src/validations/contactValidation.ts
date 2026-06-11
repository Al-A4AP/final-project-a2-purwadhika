import { z } from 'zod';

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter'),
  email: z.string().trim().email('Format email tidak valid'),
  subject: z.string().trim().min(5, 'Subjek minimal 5 karakter'),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter'),
});

export type ContactMessageInput = z.infer<typeof createContactMessageSchema>;
