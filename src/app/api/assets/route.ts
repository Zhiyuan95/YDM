import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get("q"); // Global keyword search
  const yearStart = searchParams.get("yearStart");
  const yearEnd = searchParams.get("yearEnd");
  const location = searchParams.get("location");
  const mediaType = searchParams.get("mediaType"); // e.g. "image,video"

  const supabase = await createClient();

  // Start building the query
  let supabaseQuery = supabase
    .from("archive_assets")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // 1. Text Search (Title or Story)
  if (query) {
    // Basic ilike on both columns. For production, consider using Postgres Full Text Search (FTS)
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,story.ilike.%${query}%`);
  }

  // 2. Year Range
  if (yearStart) supabaseQuery = supabaseQuery.gte("year", parseInt(yearStart));
  if (yearEnd) supabaseQuery = supabaseQuery.lte("year", parseInt(yearEnd));

  // 3. Location
  if (location) supabaseQuery = supabaseQuery.ilike("location", `%${location}%`);

  // 4. Media Type (allows comma separated like 'image,document')
  if (mediaType) {
    const types = mediaType.split(",");
    supabaseQuery = supabaseQuery.in("media_type", types);
  }

  const { data: assets, error } = await supabaseQuery;

  if (error) {
    console.error("Asset Filter Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assets });
}
