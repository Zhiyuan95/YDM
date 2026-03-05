"use client";

import React, { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/dashboard";
import AwsS3 from "@uppy/aws-s3";

import "@uppy/core/css/style.css";
import "@uppy/dashboard/css/style.css";

interface UppyUploaderProps {
  onUploadSuccess: (fileKeys: string[]) => void;
}

export default function UppyUploader({ onUploadSuccess }: UppyUploaderProps) {
  const [uppy, setUppy] = useState<Uppy | null>(null);

  // Maintain the latest callback in a ref to avoid stale closure over form data
  const onUploadSuccessRef = React.useRef(onUploadSuccess);
  useEffect(() => {
    onUploadSuccessRef.current = onUploadSuccess;
  }, [onUploadSuccess]);

  useEffect(() => {
    const uppyInstance = new Uppy({
      id: "ydm-uploader",
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 10,
        allowedFileTypes: ["image/*", "video/*", "audio/*"],
      },
    }).use(AwsS3, {
      shouldUseMultipart: true,
      limit: 4,
      createMultipartUpload: async (file: any) => {
        const res = await fetch("/api/upload/multipart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            filename: file.name,
            type: file.type,
          }),
        });
        if (!res.ok) throw new Error("Failed to create multipart upload");
        return res.json();
      },
      listParts: async (file: any, { uploadId, key }: any) => {
        const res = await fetch("/api/upload/multipart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "list", uploadId, key }),
        });
        if (!res.ok) throw new Error("Failed to list parts");
        return res.json();
      },
      signPart: async (file: any, partData: any) => {
        const res = await fetch("/api/upload/multipart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sign",
            uploadId: partData.uploadId,
            key: partData.key,
            partNumber: partData.partNumber,
          }),
        });
        if (!res.ok) throw new Error("Failed to sign part");
        return res.json();
      },
      abortMultipartUpload: async (file: any, { uploadId, key }: any) => {
        await fetch("/api/upload/multipart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "abort", uploadId, key }),
        });
      },
      completeMultipartUpload: async (file: any, { uploadId, key, parts }: any) => {
        const res = await fetch("/api/upload/multipart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "complete", uploadId, key, parts }),
        });
        if (!res.ok) throw new Error("Failed to complete multipart upload");
        return res.json();
      },
    });

    uppyInstance.on("complete", (result) => {
      if (result.successful && result.successful.length > 0) {
        // In Uppy v4 with AwsS3 multipart, the complete API returns { location, key }
        // Let's grab the key we bubbled up
        const uploadedKeys = result.successful.map((file: any) => file.response?.body?.key || "");
        onUploadSuccessRef.current(uploadedKeys.filter(Boolean));
      }
    });

    setUppy(uppyInstance);

    return () => uppyInstance.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!uppy) return null;

  return (
    <div className="w-full">
      <Dashboard
        uppy={uppy}
        theme="light"
        width="100%"
        height={400}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}
