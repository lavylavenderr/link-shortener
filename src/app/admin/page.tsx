import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllLinks, isLoggedIn } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Shortener } from "./shortener";
import { Edit, Trash2 } from "lucide-react";
import { trpc } from "../_trpc/client";
import { LinkTable } from "./table";

export default async function Admin() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("foxauth");
  const isUserAuthenitcated = await isLoggedIn(authCookie?.value);

  if (!isUserAuthenitcated) return redirect("/admin/login");

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-blobs">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Shortened Links</CardTitle>
          <CardDescription>Manage and create shortened links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Shortener />
            <LinkTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
