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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

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
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Shortened URL</TableHead>
                    <TableHead className="w-12">Hits</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            https://example.com
                        </TableCell>
                        <TableCell>
                            https://woah.lol/AjUe
                        </TableCell>
                        <TableCell className="text-center">
                            69
                        </TableCell>
                        <TableCell className="gap-2 flex">
                            <Edit className="w-4 h-4" />
                            <Trash2 className="w-4 h-4" />
                        </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
