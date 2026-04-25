import { z } from "zod";
export const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  naturalLanguageQuery: z.string().min(15),
});
