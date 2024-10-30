import { Discord } from "arctic";
import { env } from "./env";

export const discord = new Discord(
  env.LINK_DISCORD_CLIENTID,
  env.LINK_DISCORD_CLIENTSECRET,
  env.LINK_DISCORD_REDIRECT_URL
);