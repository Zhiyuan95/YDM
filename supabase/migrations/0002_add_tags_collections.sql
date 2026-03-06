ALTER TABLE archive_assets ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE archive_assets ADD COLUMN IF NOT EXISTS collection text;
