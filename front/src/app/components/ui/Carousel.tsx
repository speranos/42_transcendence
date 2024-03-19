'use client'
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import  { useState } from 'react'

interface User {
  isOnline : boolean;
  isInGame: boolean;
  isOwner: boolean;
  isFriend: boolean;
  id : string;
  userName: string;
  avatar: string;
  winrate: number;
  rank: number;
}

export function MyCarousel() {
  const [user, setuser] = useState<User[]|null>([]);

      const fetchData = async () => {
          try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/data`, {
              credentials: "include",
          });
          const data: User[] = await response.json();
          setuser(data);
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
      };
      fetchData();

  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img src={user.avatar} className="flex items-center justify-center h-1/2 w-1/2"/>
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
