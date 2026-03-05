import { createClient } from "@/lib/supabase/server";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notFound } from "next/navigation";
import DocumentReader from "@/components/discovery/DocumentReader";

export const revalidate = 0; // Disable caching for MVP to ensure fresh secure reads

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReadDocumentPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch asset metadata from Supabase
  const { data: asset, error } = await supabase
    .from("archive_assets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !asset) {
    console.error("Failed to load asset from database:", error);
    notFound();
  }

  if (asset.media_type !== "document") {
    // If you link an image to /read, it will fail gracefully.
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-zinc-500">
        <p>This asset is not a text document.</p>
      </div>
    );
  }

  // 2. Generate a Pre-signed URL to bypass proxy/CORS issues for backend fetching
  let textContent = "";
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: asset.storage_path,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    
    // 3. Fetch the raw text content from the R2 bucket
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch text content from storage");
    textContent = await res.text();
  } catch (err) {
    console.error("Document Storage Load Error:", err);
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-red-500">
        <p>Failed to load the document content from storage.</p>
      </div>
    );
  }

  // 4. Render the client-side reader view with the loaded content
  return (
    <DocumentReader 
      content={textContent}
      title={asset.title}
      year={asset.year}
      location={asset.location}
      story={asset.story}
    />
  );
}
