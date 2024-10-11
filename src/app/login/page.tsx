import { redirect } from "next/navigation";
import { LoginCard } from "./card";
import { validateRequest } from "@/lib/auth";

export default async function AdminLogin() {
  const { user } = await validateRequest()
  if (user) return redirect("/admin")

  return (
    <div className="h-screen flex items-center justify-center bg-blog-background bg-cover bg-blobs overflow-y-hidden">
      <LoginCard />
    </div>
  );
}
