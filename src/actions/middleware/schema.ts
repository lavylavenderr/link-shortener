import type { infer as Infer, ZodObject } from "zod";

export function validateSchema<T extends ZodObject<any>>(
  schema: T,
  data: unknown,
): Infer<T> | null {
  const { data: parsedData, success } = schema.safeParse(data);

  if (!success) return null;
  return parsedData;
}