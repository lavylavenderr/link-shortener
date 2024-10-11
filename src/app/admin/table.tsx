"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllLinks } from "@/actions/links/getAllLinks";
import z from "zod";
import { deleteLink } from "@/actions/links/deleteLink";

const deleteSchema = z.object({
  linkId: z.number(),
});

export function LinkTable() {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    data: linkData,
    isLoading: linksLoading,
    refetch: refetchLinks,
  } = useQuery({
    queryKey: ["getAllLinks"],
    queryFn: async () => {
      return await getAllLinks();
    },
  });

  const { mutateAsync: deleteLinkFn, isPending: isDeleteLoading } = useMutation(
    {
      mutationFn: async (values: z.infer<typeof deleteSchema>) => {
        return await deleteLink(values);
      },
      onSuccess: async () => {
        toast.success("Link deleted!", {
          position: "bottom-right",
        });
        refetchLinks();
      },
      onError: async (error) => {
        if (((error as Error).message = "INVALID_LINK")) {
          toast.error("Invalid Link!", {
            position: "bottom-right",
          });
        } else {
          toast.error("An unknown error has occured.", {
            position: "bottom-right",
          });
        }
      },
    }
  );

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deleteLinkFn({ linkId: id });
    setDeletingId(null);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "link",
      header: "Original URL",
      cell: ({ row }) => (
        <a href={row.original.link} target="_blank" className="text-blue-500">
          {row.original.link}
        </a>
      ),
    },
    {
      accessorKey: "shortUrl",
      header: "Shortened URL",
      cell: ({ row }) => (
        <a
          href={`${document.location.protocol}//${document.location.host}/${row.original.uid}`}
          target="_blank"
          className="text-blue-500 text-center"
        >
          {`${document.location.protocol}//${document.location.host}/${row.original.uid}`}
        </a>
      ),
    },
    {
      accessorKey: "hits",
      header: "Hits",
      cell: ({ row }) => <div className="pl-2">{row.original.hits}</div>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="ghost" className="pl-3 flex">
              {deletingId === row.original.id ? (
                <Loader2 className="animate-spin text-red-500 ml-1" />
              ) : (
                <Trash2 className="w-4 h-4 text-red-500 ml-1" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this
              link.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(row.original.id)}
                className="bg-[#6600FF]"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0, 
    pageSize: 5,
  });

  const table = useReactTable({
    data: linkData || [],
    columns,
    // manualPagination: true,
    // rowCount: linkData?.length,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination
    }
  });

  return linksLoading ? (
    <Loader2 className="animate-spin flex mx-auto h-12 w-12 mt-10 text-[#6600FF]" />
  ) : (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-start space-x-2">
        <Button
          size="sm"
          className="bg-[#6600FF]"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          className="bg-[#6600FF]"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
