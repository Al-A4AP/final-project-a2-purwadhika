import { z } from 'zod';

export const replyReviewSchema = z.object({
  reply_text: z.string().trim().min(1, 'Balasan tidak boleh kosong').max(1000, 'Balasan maksimal 1000 karakter'),
});
