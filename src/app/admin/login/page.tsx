import { isLoggedIn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginCard } from "./card";

export default async function AdminLogin() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("foxauth");
  const isUserAuthenitcated = await isLoggedIn(authCookie?.value);

  if (isUserAuthenitcated) return redirect("/admin");

  return (
    <div className="h-screen flex items-center justify-center bg-blog-background bg-cover bg-blobs overflow-y-hidden">
      <LoginCard />
    </div>
  );
}
