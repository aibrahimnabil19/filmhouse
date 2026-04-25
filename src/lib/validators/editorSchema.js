import { z } from "zod";
export const editorSchema = z.object({
  fullName: z.string().min(2),
  headline: z.string().min(5),
  bio: z.string().min(20),
  yearsExperience: z.coerce.number().min(0),
  hourlyRate: z.coerce.number().optional(),
});
