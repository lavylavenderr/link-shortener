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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginCard() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loginSubmit = async () => {
    setLoading(true);
    setError("");

    if (!username || !password) {
      setLoading(false);
      return setError("Fill out all fields");
    }

    const data = {
      username,
      password,
    };

    const response = await fetch("/api/login", {
      body: JSON.stringify(data),
      method: "POST",
    });

    if (response.status === 401) {
      setLoading(false);
      return setError("Invalid password");
    } else if (response.status === 400) {
      setLoading(false);
      return setError("User not found");
    } else {
      for (const cookie of response.headers.getSetCookie()) {
        document.cookie = cookie;
      }
      document.location.reload()
    }
  };

  return (
    <Card className={cn("m-2 w-[350px]")}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Hey there, and welcome back.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="OneVeryCoolUsername"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="That0nePassword!"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            className="w-full bg-[#6600FF]"
            type="submit"
            disabled={loading}
            onClick={loginSubmit}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </div>
      </CardContent>
      {error === "" ? (
        <></>
      ) : (
        <CardFooter>
          <h1 className="mx-auto text-center text-red-500 text-sm">{error}</h1>
        </CardFooter>
      )}
    </Card>
  );
}
