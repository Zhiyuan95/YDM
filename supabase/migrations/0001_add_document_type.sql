-- Drop the existing constraint
ALTER TABLE archive_assets DROP CONSTRAINT archive_assets_media_type_check;

-- Add the new constraint including 'document'
ALTER TABLE archive_assets ADD CONSTRAINT archive_assets_media_type_check CHECK (media_type IN ('image', 'video', 'audio', 'document'));
