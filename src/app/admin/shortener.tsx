"use client";

import { createLink } from "@/actions/links/createLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import z from "zod";

const addSchema = z.object({
  newURL: z.string(),
});

export function Shortener() {
  const [url, setURL] = useState<string>("");
  const queryClient = useQueryClient();

  const { mutateAsync: createLinkFn, isPending: isLinkLoading } = useMutation({
    mutationFn: async (values: z.infer<typeof addSchema>) => {
      return await createLink(values);
    },
    onSuccess: () => {
      setURL("");
      queryClient.invalidateQueries({ queryKey: ["getAllLinks"] });
      toast.success("Link successfully created!", {
        position: "bottom-right",
      });
    },
    onError: async (error) => {
      if (((error as Error).message = "BAD_REQUEST")) {
        toast.error("Invalid URL", {
          position: "bottom-right",
        });
      } else {
        toast.error("An unknown error has occured.", {
          position: "bottom-right",
        });
      }
    },
  });

  const createSubmit = async () => {
    await createLinkFn({ newURL: url });
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
