// "use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Level = {
//   id: string
//   level: number
//   lastGames: Array<"W" | "L">  
//   username: string
// }
export type user = {
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

export const columns: ColumnDef<user>[] = [


  {
    header: 'Username',
    accessorKey: 'userName',
    // Other column properties
  },

  {
    header: 'Winrate',
    accessorKey: 'winrate',
    // Other column properties
  },
  {
    header: 'Rank',
    accessorKey: 'rank',
    // Other column properties
  },
]

// export const rows: Level[] = [
//   {
//     isOnline: boolean,
//     isInGame: false,
//     isOwner: true,
//     isFriend: true,
//     id: '1',
//     userName: 'User1',
//     avatar: 'url-to-avatar1',
//     winrate: 0.75,
//     rank: 1,
//   },
// ]