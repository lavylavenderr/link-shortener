import { Discord } from "arctic";
import { env } from "./env";

export const discord = new Discord(
  env.DISCORD_CLIENTID,
  env.DISCORD_CLIENTSECRET,
  env.DISCORD_REDIRECT_URL
);