import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // 1. Verify access in Supabase
  const supabase = await createClient();
  const { data: asset } = await supabase
    .from("archive_assets")
    .select("storage_path, status, media_type")
    .eq("id", id)
    .single();

  if (!asset) return new NextResponse("Not Found", { status: 404 });

  if (asset.status !== "published") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. We only proxy images for Next.js Image Optimization caching
  if (asset.media_type !== "image") {
    return new NextResponse("Only images can be proxied through this route for optimization", { status: 400 });
  }

  try {
    // 3. Generate short-lived secure URL
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: asset.storage_path,
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    
    // 4. Fetch and proxy the stream back
    const imageResponse = await fetch(signedUrl);
    
    if (!imageResponse.ok) {
        throw new Error("Failed to fetch from R2");
    }

    return new NextResponse(imageResponse.body, {
      headers: {
        "Content-Type": imageResponse.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable", // Tell Next.js to aggressively cache the localized result
      },
    });

  } catch (error) {
    console.error("Image Proxy Error:", error);
    return new NextResponse("Error fetching optimized image", { status: 500 });
  }
}
