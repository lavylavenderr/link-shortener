"use server";

import { prisma } from "@/lib/db";
import { auth } from "../middleware/index";

export const getAllLinks = async () =>
  auth(async () => {
    const links = await prisma.link.findMany();
    return links;
  });
