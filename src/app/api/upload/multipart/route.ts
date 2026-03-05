import { NextResponse } from "next/server";
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  ListPartsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_EXPIRATION = 3600; // 1 hour

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!R2_BUCKET_NAME) {
      throw new Error("R2_BUCKET_NAME is not configured");
    }

    switch (action) {
      case "create": {
        const { filename, type } = body;
        // Generate a unique path for the file, grouping by date
        const date = new Date().toISOString().split("T")[0];
        const key = `uploads/${date}/${uuidv4()}-${filename}`;

        const command = new CreateMultipartUploadCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          ContentType: type,
        });

        const res = await s3Client.send(command);
        return NextResponse.json({ uploadId: res.UploadId, key });
      }

      case "sign": {
        const { uploadId, key, partNumber } = body;
        const command = new UploadPartCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        });

        const url = await getSignedUrl(s3Client, command, {
          expiresIn: UPLOAD_EXPIRATION,
        });
        return NextResponse.json({ url });
      }

      case "list": {
        const { uploadId, key } = body;
        const command = new ListPartsCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          UploadId: uploadId,
        });

        const res = await s3Client.send(command);
        return NextResponse.json(res.Parts || []);
      }

      case "complete": {
        const { uploadId, key, parts } = body;
        const command = new CompleteMultipartUploadCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            // Need to map Uppy parts format (which usually has ETag and PartNumber)
            Parts: parts.map((p: any) => ({
              ETag: p.ETag,
              PartNumber: p.PartNumber,
            })),
          },
        });

        const res = await s3Client.send(command);
        return NextResponse.json({ location: res.Location, key });
      }

      case "abort": {
        const { uploadId, key } = body;
        const command = new AbortMultipartUploadCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          UploadId: uploadId,
        });

        await s3Client.send(command);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("S3 Multipart Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
