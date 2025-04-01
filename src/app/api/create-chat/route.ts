import { db } from "@/lib/db";
import { chats, chatGroups } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { files, name } = body; // Expecting files array and optional name

        if (!files || !files.length) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        // Create a new chat group with the given or default name
        const chatGroup = await db.insert(chatGroups).values({
            userId,
            name: name || 'Untitled Group', // Default name if not provided
        }).returning({
            id: chatGroups.id,
        });

        const chatGroupId = chatGroup[0].id;

        // Process each file and associate with the chat group
        const chatInserts = files.map(async ({ file_key, file_name }: { file_key: string; file_name: string }) => {
            console.log(file_key, file_name);
            await loadS3IntoPinecone(file_key);

            return db.insert(chats).values({
                fileKey: file_key,
                pdfName: file_name,
                pdfUrl: getS3Url(file_key),
                userId,
                chatGroupId,
            });
        });

        await Promise.all(chatInserts);

        return NextResponse.json({ chat_group_id: chatGroupId }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
