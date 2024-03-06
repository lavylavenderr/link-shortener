"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "../_trpc/client";
import { Link } from "@prisma/client";
import { Edit, Loader2, Trash2 } from "lucide-react";

export function LinkTable() {
  const { data: linkData, isLoading: linksLoading } =
    trpc.links.getAllLinks.useQuery();

  console.log(linkData);

  return linksLoading ? (
    <Loader2 className="animate-spin flex mx-auto h-12 w-12 mt-10" />
  ) : (
    <>
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
            {linkData &&
              linkData.map((link: Link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.link}</TableCell>
                  <TableCell>{link.shortUrl}</TableCell>
                  <TableCell className="text-center">{link.hits}</TableCell>
                  <TableCell className="gap-2 flex">
                    <Edit className="w-4 h-4" />
                    <Trash2 className="w-4 h-4" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
