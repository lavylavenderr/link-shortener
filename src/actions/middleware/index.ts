import type { User } from "lucia";
import type { infer as Infer, ZodObject } from "zod";
import { checkAuth } from "./auth";
import { validateSchema } from "./schema";

export async function schema<T extends ZodObject<any>, R>(
  schema: T,
  data: unknown,
  callback: (data: Infer<T>) => R | Promise<R>,
) {
  const parsedData = validateSchema(schema, data);
  if (!parsedData) throw new Error("Bad request");

  return callback(parsedData);
}

export async function schemaAndAuth<T extends ZodObject<any>, R>(
  schema: T,
  data: unknown,
  callback: (data: Infer<T>, user: User) => R | Promise<R>,
) {
  const parsedData = validateSchema(schema, data);
  if (!parsedData) throw new Error("BAD_REQUEST");

  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  return callback(parsedData, user);
}

export async function auth<R>(callback: (user: User) => R | Promise<R>) {
  const user = await checkAuth();
  if (!user) throw new Error("Unauthorized");

  return callback(user);
}