import { string, z } from "zod";
export const signUpSchema = z.object({
  username: z.string().min(5),
  email: z.string().email(),
  password: z.string(),
});

export const signInSchema = z.object({
  username: z.string().min(5),
  password: z.string(),
});
export const zapCreateSchema = z.object({
  availableTriggerId: z.string(),
  triggerMetadata: z.any().optional(),
  actions: z.array(
    z.object({
      availableActionId: z.string(),
      sortingOrder: z.number(),
      actionMetadata: z.any().optional(),
    })
  ),
});
