"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";

export function LoginCard() {
  return (
    <Card className={cn("m-2 w-[350px]")}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Hey there, and welcome back.</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/login/discord">
          <Button className="w-full bg-[#7289DA] hover:bg-[#5c6fb3]">
            <div className="mx-auto gap-2 flex">
              <FaDiscord size="20" />
              <p>Login with Discord</p>
            </div>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
