import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Shortener } from "./shortener";
import { LinkTable } from "./table";
import { validateRequest } from "@/lib/auth";

export default async function Admin() {
  const { user } = await validateRequest();
  if (!user) return redirect("/login");

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-blobs p-4">
  <Card className="w-full max-w-3xl mx-3 md:mx-0 my-3 border-2">
    <CardHeader>
      <CardTitle>Shortened Links</CardTitle>
      <CardDescription>Manage and create shortened links</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <Shortener />
      <LinkTable />
    </CardContent>
  </Card>
</div>

  );
}
