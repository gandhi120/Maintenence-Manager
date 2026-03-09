-- Create machine-images bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('machine-images', 'machine-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view machine images (public bucket)
CREATE POLICY "Anyone can view machine images"
ON storage.objects FOR SELECT
USING (bucket_id = 'machine-images');

-- Authenticated users can upload machine images
CREATE POLICY "Authenticated users can upload machine images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'machine-images');

-- Authenticated users can update machine images
CREATE POLICY "Authenticated users can update machine images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'machine-images')
WITH CHECK (bucket_id = 'machine-images');

-- Authenticated users can delete machine images
CREATE POLICY "Authenticated users can delete machine images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'machine-images');
