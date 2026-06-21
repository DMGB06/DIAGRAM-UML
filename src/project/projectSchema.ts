import { z } from "zod";

export const projectSchema = z.object({
  source: z.string(),
  nodes: z.array(z.unknown()),
  edges: z.array(z.unknown()),
});

export type StoredProject = z.infer<typeof projectSchema>;
