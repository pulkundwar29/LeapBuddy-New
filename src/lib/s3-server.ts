import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import { Readable } from "stream";

export async function downloadFromS3(file_key: string): Promise<string> {
  try {
    const s3 = new S3({
      region: "ap-south-1",
      endpoint: "https://s3.ap-south-1.amazonaws.com",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    const { Body } = await s3.send(new GetObjectCommand(params));

    if (Body instanceof Readable) {
      const file_name = `./nli/pdf-${Date.now()}.pdf`;
      const writeStream = fs.createWriteStream(file_name);

      // Pipe the readable stream to the writable stream
      Body.pipe(writeStream);

      // Return a promise that resolves when the file has been written
      return new Promise((resolve, reject) => {
        writeStream.on("finish", () => resolve(file_name));
        writeStream.on("error", reject);
      });
    } else {
      throw new Error("Body is not a readable stream");
    }
  } catch (error) {
    console.error(error);
    throw error; // rethrow the error for handling in the calling function
  }
}
