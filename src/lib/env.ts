import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    LINK_DATABASE_URL: z.string(),
    LINK_DISCORD_CLIENTID: z.string(),
    LINK_DISCORD_CLIENTSECRET: z.string(),
    LINK_DISCORD_REDIRECT_URL: z.string()
})

type env = z.infer<typeof envSchema>
export const env = envSchema.parse(process.env)