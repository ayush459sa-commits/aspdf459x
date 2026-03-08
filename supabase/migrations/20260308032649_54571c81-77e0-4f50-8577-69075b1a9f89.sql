-- Create PDFs table
CREATE TABLE public.pdfs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  locked BOOLEAN NOT NULL DEFAULT true,
  downloads BOOLEAN NOT NULL DEFAULT false,
  file_url TEXT NOT NULL,
  pages INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;

-- Everyone can read PDFs (public library)
CREATE POLICY "Anyone can view PDFs" ON public.pdfs FOR SELECT USING (true);

-- Only authenticated users can manage
CREATE POLICY "Authenticated users can insert PDFs" ON public.pdfs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update PDFs" ON public.pdfs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete PDFs" ON public.pdfs FOR DELETE TO authenticated USING (true);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', true);

-- Storage policies
CREATE POLICY "Anyone can view PDFs in storage" ON storage.objects FOR SELECT USING (bucket_id = 'pdfs');
CREATE POLICY "Authenticated users can upload PDFs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'pdfs');
CREATE POLICY "Authenticated users can delete PDFs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'pdfs');