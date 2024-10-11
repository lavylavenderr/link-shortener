import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { get, set } from "@/lib/cache";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

async function checkIfRedirect(slug: string) {
  const cachedKey = get<string>(slug[0]);

  if (cachedKey) {
    await prisma.link.updateMany({
      where: { uid: slug[0] },
      data: { hits: { increment: 1 } },
    });
    return redirect(cachedKey);
  }

  const link = await prisma.link.findUnique({
    where: { uid: slug[0] },
    select: { id: true, link: true, hits: true },
  });

  if (link) {
    set<string>(slug[0], link.link);
    await prisma.link.update({
      where: { id: link.id },
      data: { hits: { increment: 1 } },
    });
    return redirect(link.link);
  }

  return;
}

export default async function Home({ params }: { params: { slug: string } }) {
  if (params.slug) await checkIfRedirect(params.slug);

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-blobs">
      <Card className="w-[28rem] m-4 md:0">
        <CardHeader className="max-w-1xl">
          <CardTitle>Invalid URL</CardTitle>
          <CardDescription>
            You've privded an invalid redirect slug or this link has expired.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-3 w-full">
          <Link href="/login" className="text-sm w-full">
            <Button className="bg-[#6600FF] w-full">Login</Button>
          </Link>
          <Link href="/admin" className="w-full text-sm">
            <Button className="bg-[#6600FF] w-full">Admin Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
