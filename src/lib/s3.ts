import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


export async function uploadToS3(file: File) {
    try {
        const s3Client = new S3Client({
            region: 'ap-south-1',
            endpoint: "https://s3.ap-south-1.amazonaws.com",
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!
            }
        });

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file,
        };

        const command = new PutObjectCommand(params);

        const upload = await s3Client.send(command);

        console.log('Successfully uploaded to S3!', file_key);

        return Promise.resolve({
            file_key,
            file_name: file.name,
        });

    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
}

export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
    return url;
}
