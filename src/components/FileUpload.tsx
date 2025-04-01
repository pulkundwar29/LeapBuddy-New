"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Inbox, Loader2 } from "lucide-react";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {
    const router = useRouter();
    const [uploading, setUploading] = React.useState(false);
    const [uploadComplete, setUploadComplete] = React.useState(false);
    const [files, setFiles] = React.useState([]);

    const { mutate, isLoading } = useMutation({
        mutationFn: async ({ files }: { files: { file_key: string; file_name: string }[] }) => {
            const response = await axios.post("/api/create-chat", { files });
            return response.data;
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        onDrop: async (acceptedFiles) => {
            const totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
            if (totalSize > 10 * 1024 * 1024) {
                toast.error("Total file size exceeds 10MB");
                return;
            }

            try {
                setUploading(true);
                setUploadComplete(false);

                const uploadPromises = acceptedFiles.map(async (file) => {
                    const data = await uploadToS3(file);
                    if (!data?.file_key || !data.file_name) {
                        throw new Error("Upload failed");
                    }
                    return data;
                });

                const uploadedFiles = await Promise.all(uploadPromises);
                setFiles(uploadedFiles);

                mutate(
                    { files: uploadedFiles },
                    {
                        onSuccess: ({ chat_group_id }) => {
                            toast.success("Chat group created!");
                            setUploadComplete(true);
                            router.push(`/chat/${chat_group_id}`);
                        },
                        onError: (err) => {
                            toast.error("Error creating chat group");
                            console.error(err);
                        },
                    }
                );
            } catch (error) {
                console.error(error);
                toast.error("Upload failed");
            } finally {
                setUploading(false);
            }
        },
    });

    return (
        <div className="p-2 bg-white rounded-lg w-1/2 max-w-md">
            <div
                {...getRootProps({
                    className:
                        "border-dashed border-2 rounded-lg cursor-pointer bg-gray-50 py-4 px-4 flex items-center justify-center flex-col w-full",
                })}
            >
                <input {...getInputProps()} />
                {(uploading || isLoading) && !uploadComplete ? (
                    <>
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                        <p className="mt-2 text-xs text-gray-700">Uploading to Database</p>
                        <p className="text-xs text-gray-700">Generating Vectors</p>
                    </>
                ) : (
                    <>
                        <Inbox className="w-6 h-6 text-blue-500" />
                        <p className="mt-2 text-xs text-gray-700">Drop PDFs Here</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
