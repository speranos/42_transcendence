interface Room {
    id: string;
    name: string;
    type: string;
    members: string[];
  }
  
  async function getFetchRoomsByUserId(userId: string): Promise<Room[]> {
    //('userId', userId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all_rooms`, {
        credentials : 'include',
        method : 'GET',
      });
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const rooms: Room[] = await response.json();
      return rooms;
    } export default getFetchRoomsByUserId;