-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the main archive_assets table
CREATE TABLE archive_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    story TEXT,
    year INTEGER,
    location TEXT,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video', 'audio')),
    storage_path TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'published', -- simplified for MVP
    metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE archive_assets ENABLE ROW LEVEL SECURITY;

-- Policy 1: allow anyone to view published assets
CREATE POLICY "Public can view published assets"
ON archive_assets
FOR SELECT
TO public
USING (status = 'published');

-- Policy 2: allow authenticated users to insert
CREATE POLICY "Authenticated users can insert assets"
ON archive_assets
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: allow authenticated users to update
CREATE POLICY "Authenticated users can update assets"
ON archive_assets
FOR UPDATE
TO authenticated
USING (true);

-- Policy 4: allow authenticated users to delete
CREATE POLICY "Authenticated users can delete assets"
ON archive_assets
FOR DELETE
TO authenticated
USING (true);
