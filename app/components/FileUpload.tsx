"use client" 

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import React, { useRef, useState } from "react";

interface FileUploadProps{
    onSuccess: (res:any)=>void
    onProgress: (progress: number)=>void
    fileType?: "image" | "video"
}

const FileUpload = ({onSuccess, onProgress, fileType}:FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);


    const validateFile = (file: File)=>{
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError("Please upload a valid video file");
                return false;
            }
        } else {
            if(!file.type.startsWith("image/")){
                setError("Please upload a valid image file");
                return false;
            }

        }
        if(file.size > 100 * 1024 * 1024){
            setError("file must be less than 100MB")
            return false;
        }

        return true;
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0]
        if(!file || !validateFile(file)) return

        setUploading(true)
        setError(null)
        abortControllerRef.current = new AbortController();

        try {
            const authRes = await fetch('/api/imagekit-auth')
            if (!authRes.ok) {
                throw new Error("Failed to get ImageKit authentication parameters");
            }
            const auth = await authRes.json()

            const result = await upload({
                file,
                fileName: file.name,
                publicKey: auth.publicKey ?? process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
                expire: auth.authenticationParameters.expire,
                token: auth.authenticationParameters.token,
                signature: auth.authenticationParameters.signature,
                onProgress: (event) => {
                    const progress = event.total > 0 ? (event.loaded / event.total) * 100 : 0;
                    onProgress(Math.round(progress));
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortControllerRef.current.signal,
            })

            onSuccess(result);
            onProgress(100);
        } catch (error: unknown) {
            if (error instanceof ImageKitAbortError) {
                setError("Upload cancelled");
            } else if (error instanceof ImageKitInvalidRequestError) {
                setError("Invalid upload request");
            } else if (error instanceof ImageKitUploadNetworkError) {
                setError("Network error while uploading");
            } else if (error instanceof ImageKitServerError) {
                setError("ImageKit server error");
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Upload failed. Please try again.");
            }
        } finally {
            setUploading(false);
            abortControllerRef.current = null;
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    }   

    return (
        <>
            <input type="file" 
                ref={inputRef}
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                disabled={uploading}
            />
            {uploading && (
                <span>Loading...</span>
            )}
            {error && (
                <span>{error}</span>
            )}
        </>
    );
};

export default FileUpload;