"use server";

import z from "zod";
import { schemaAndAuth } from "../middleware";
import { prisma } from "@/lib/db";

const formSchema = z.object({
  linkId: z.number(),
});

export const deleteLink = async (formData: z.infer<typeof formSchema>) =>
  schemaAndAuth(formSchema, formData, async (data, user) => {
    const link = await prisma.link.findUnique({
      where: {
        id: data.linkId,
      },
    });
    if (!link) throw new Error("INVALID_LINK");

    await prisma.link.delete({
      where: { id: data.linkId },
    });

    return {
      message: "OK",
    };
  });
