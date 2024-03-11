"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "@/app/_trpc/client";

export function Shortener() {
  const [url, setURL] = useState<string>("");

  const { mutateAsync: createLink, isLoading: isLinkLoading } =
    trpc.links.createLink.useMutation();
  const createSubmit = async () => {
    await createLink(
      { newURL: url },
      {
        onSuccess: () => {
          setURL("");
          toast.success("Link successfully created!", {
            position: "bottom-right",
          });
          setTimeout(() => document.location.reload(), 500);
        },
        onError: (data) => {
          if (data.data?.zodError) {
            toast.error("Invalid URL", {
              position: "bottom-right",
            });
          } else {
            toast.error(data.message, {
              position: "bottom-right",
            });
          }
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        className="flex-1 min-w-0"
        value={url}
        type="url"
        onChange={(e) => setURL(e.target.value)}
        placeholder="Enter a URL to shorten!"
      />
      <Button
        type="submit"
        disabled={isLinkLoading}
        onClick={createSubmit}
        className="bg-[#6600FF]"
      >
        {isLinkLoading ? <Loader2 className="animate-spin" /> : "Create"}
      </Button>
    </div>
  );
}
