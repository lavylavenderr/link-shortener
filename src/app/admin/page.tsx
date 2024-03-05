import { isLoggedIn } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function Admin() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("foxauth");
  const isUserAuthenitcated = await isLoggedIn(authCookie?.value);

  return !isUserAuthenitcated ? <>not logged in</> : <>logged in</>;
}
