import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(50),
  excerpt: z.string().min(10, "Minimum 50 characters"),
  author: z.string().min(2, "Minimum 5 characters"),
  categories: z.array(z.string()).min(1),
  network: z.string(),
  featured: z.boolean().optional()
});