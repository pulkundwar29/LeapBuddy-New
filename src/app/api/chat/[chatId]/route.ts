import { db } from "@/lib/db";
import { chatGroups, chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: { chatId: string } }) {
  try {
    const { name } = await req.json();
    const chatId = parseInt(params.chatId, 10);

    if (!name || !chatId) {
      return new Response("Invalid request", { status: 400 });
    }

    await db.update(chatGroups).set({ name}).where(eq(chatGroups.id, chatId));

    return new Response("Chat name updated successfully!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error updating chat name", { status: 500 });
  }
};



  export async function DELETE(req: Request, { params }: { params: { chatId: string } }) {
    try {
      
      const chatId = parseInt(params.chatId, 10);
      
  
      if (!chatId) {
        return new Response("Invalid request", { status: 400 });
      }
  
      await db.delete(chatGroups).where(eq(chatGroups.id, chatId));
      console.log("Chat deleted successfully");
  
      return new Response("Chat deleted successfully!", { status: 200 });
    } catch (error) {
      console.error("Error deleting chat:", error);
      return new Response("Error deleting chat", { status: 500 });
    }
  };
  
  