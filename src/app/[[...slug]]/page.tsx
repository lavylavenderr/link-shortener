import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

async function checkIfRedirect(slug: string) {
  // Check if it's a redirect or page

  const link = await prisma.link.findUnique({
    where: {
      uid: slug[0],
    },
    cacheStrategy: {
      ttl: 300,
    },
  });

  // If not, return

  if (!link) return;

  // If it's a link, add one to the hit counter and update the query then redirect

  let hits = ++link.hits;

  await prisma.link.update({
    where: {
      id: link.id,
    },
    data: {
      hits,
    },
  });

  return redirect(link.link);
}

export default async function Home({ params }: { params: { slug: string } }) {
  if (params.slug) await checkIfRedirect(params.slug);

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-blobs">
      <Card className="w-[28rem] m-4 md:0">
        <CardHeader className="max-w-1xl">
          <CardTitle>Uh oh!</CardTitle>
          <CardDescription>
            Something went wrong. We were unable to locate that specified link.
            If you were attempting to login, you can do so below.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-3">
          <Link href="/admin" className="text-blue-500 text-sm">
            Admin Dashboard
          </Link>
          <Link href="/admin/login" className="text-blue-500 text-sm">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
