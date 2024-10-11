"use server";

import z from "zod";
import { schemaAndAuth } from "../middleware";
import { prisma } from "@/lib/db";
import { customAlphabet } from "nanoid";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const getHash = customAlphabet(characters, 5);

const HASH_BATCH_SIZE = 5;
const formSchema = z.object({
  newURL: z.string().url(),
});

function generateHashBatch(size: number) {
  const hashes = [];
  for (let i = 0; i < size; i++) {
    hashes.push(getHash());
  }
  return hashes;
}

async function findExistingHashes(hashes: string[]) {
  const existing = await prisma.link.findMany({
    where: {
      uid: { in: hashes },
    },
    select: { uid: true },
  });

  return new Set(existing.map((link) => link.uid));
}

export const createLink = async (formData: z.infer<typeof formSchema>) =>
  schemaAndAuth(formSchema, formData, async (data, user) => {
    let hashBatch = generateHashBatch(HASH_BATCH_SIZE);
    let existingHashes = await findExistingHashes(hashBatch);

    while (existingHashes.size === HASH_BATCH_SIZE) {
      hashBatch = generateHashBatch(HASH_BATCH_SIZE);
      existingHashes = await findExistingHashes(hashBatch);
    }

    const hash = hashBatch.find((h) => !existingHashes.has(h)) || getHash();

    await prisma.link.create({
      data: {
        uid: hash,
        link: data.newURL,
      },
    });

    return {
      message: "OK",
      data: {
        uid: hash,
        newURL: data.newURL,
      },
    };
  });
