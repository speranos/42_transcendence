'use client'
import {
  ColumnDef,
  RowSelection,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./pagination";
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
    isOnline : boolean;
    isInGame: boolean;
    isOwner: boolean;
    isFriend: boolean;
    id : string;
    userName: string;
    avatar: string;
    winrate: string;
    rank: number;
}

interface DataTableProps<User, TValue> {
  columns: ColumnDef<User, TValue>[]
  data: User[]
}

  const addFriend = async (userid: any) => {
    try {
      const api = `${process.env.NEXT_PUBLIC_API_URL}/friendship/send-request/` + userid;
      const response = await fetch(api, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.body;
    } catch (error) {
  
      console.error('Error adding friend:', error);
    }
  };

export function DataTable<User, TValue>({
  columns,
  data,
}: DataTableProps<User, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
const route = useRouter();
  const handleAddFriend = async (id: string) => {
    await addFriend(id);
  };

  const handleAvatarClick = (id: string) => {
    if(id){
      route.push(`/Profile/${id}`)
    }
  };

  return (
    <div className="m-8  w-full">
      <Table className="h-full">
        <TableBody className="w-full">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="flex justify-center items-center bg-gradient-to-r from-blue to-backdark shadow-md rounded-xl  z-40"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <TableCell className=" left-1 hidden sm:block h-full w-96  items-center justify-center">
                <a 
                onClick={() => handleAvatarClick(row.original?.id)
                  }>
                  <img
                    src={row.original?.avatar}
                    alt="user.avatar"
                    className="shadow-lg z-10 border-1 rounded-full h-16 w-16"
                    // style={{}}
                    />
                   </a>

                  <div className="grid grid-cols-2">
                    {row.original?.isOnline ? <div className="bg-green rounded-full h-3 w-3 justify-center"></div>
                    : <div className="bg-red rounded-full h-3 w-3 justify-center"></div>}
                    {row.original?.isInGame ? <div className="inline-block text-lavender z-10 justify-center font-bold">In game</div>: <div></div>}
                  </div>
                  {/* {!owner && !friend && <button className="text-pink font-semibold" onClick={() => addFriend(id)}>Add Friend</button>} */}
                </TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="flex left-2 font-bold  text-backlight w-full items-end">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}

                <TableCell className="left-2 text-backlight w-full h-full items-end">
                  <div className=" text-sm underline">
                    <a className=""  onClick={() => handleAvatarClick(row.original?.id)}>
                      Visit Profile
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="flex items-center justify-center font-bold">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className=" bg-blue border-2xl rounded-2xl">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
