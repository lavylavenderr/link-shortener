"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Shortener() {
  return (
    <div className="flex items-center gap-4">
      <Input
        className="flex-1 min-w-0"
        type="url"
        placeholder="Enter a URL to shorten!"
      />
      <Button type="submit" className="bg-[#6600FF]">
        Submit
      </Button>
    </div>
  );
}
