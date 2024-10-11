import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string(),
    DISCORD_CLIENTID: z.string(),
    DISCORD_CLIENTSECRET: z.string(),
    DISCORD_REDIRECT_URL: z.string()
})

type env = z.infer<typeof envSchema>
export const env = envSchema.parse(process.env)