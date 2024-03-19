interface Message {
    id: string;
    content: string;
    sendId: string;
    roomId: string;
    createdAt: any;
  }
  
  async function getAllMessagesByroomID(roomID: string,userID :string): Promise<Message[]> {
    //('roomID', roomID)
    try{

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all_mssg/${roomID}`,{
        credentials : 'include',
        method : 'GET',
      });
      console.log("before UUUUUUUUUU",response);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      console.log("wwwwwwwwww");
      const messages: Message[] = await response.json();
      //('messages from the back !!!!', messages);
      return messages;
    }
    catch(e)
    {
      console.log("after UUUUUUUUUU",e);
      throw new Error("Failed to fetch messages");
    }
    } export default getAllMessagesByroomID;