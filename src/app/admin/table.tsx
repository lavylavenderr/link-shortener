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
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import Link from "next/link";

export function LinkTable() {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    data: linkData,
    isLoading: linksLoading,
    refetch: refetchLinks,
  } = trpc.links.getAllLinks.useQuery();

  const { mutateAsync: deleteLink, isLoading: isDeleteLoading } =
    trpc.links.deleteLink.useMutation();
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deleteLink(
      { linkId: id },
      {
        onSuccess: () => {
          toast.success("Link deleted!", {
            position: "bottom-right",
          });
          refetchLinks();
        },
        onError: (data) => {
          toast.error(data.message, {
            position: "bottom-right",
          });
        },
      }
    );
    setDeletingId(null);
  };

  return linksLoading ? (
    <Loader2 className="animate-spin flex mx-auto h-12 w-12 mt-10 text-[#6600FF]" />
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
              linkData.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <Link
                      href={link.link}
                      target="_blank"
                      className="text-blue-500"
                    >
                      {link.link}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`${
                        document.location.protocol +
                        "//" +
                        document.location.host
                      }/${link.uid}`}
                      target="_blank"
                      className="text-blue-500"
                    >
                      {`${
                        document.location.protocol +
                        "//" +
                        document.location.host
                      }/${link.uid}`}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">{link.hits}</TableCell>
                  <TableCell className="cursor-pointer">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button variant={"ghost"} className="pl-3 flex">
                          {deletingId === link.id ? (
                            <Loader2 className="animate-spi text-red-500 ml-1" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500 ml-1" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          remove this link.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(link.id)}
                            className="bg-[#6600FF]"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
