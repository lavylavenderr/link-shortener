import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isLoggedIn } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Shortener } from "./shortener";
import { LinkTable } from "./table";

interface cookieData {
  name: string;
  value: string;
}

async function getCookieData() {
  const cookieData = cookies().getAll();
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData);
    }, 1000)
  );
}

export default async function Admin() {
  const cookieStore = (await getCookieData()) as cookieData[];
  const authCookie = cookieStore.find((obj) => obj.name === "foxauth");
  const isUserAuthenitcated = await isLoggedIn(authCookie?.value);

  if (!isUserAuthenitcated) return redirect("/admin/login");

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-blobs">
      <Card className="w-full max-w-3xl m-4 md:m-0">
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
