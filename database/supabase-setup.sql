-- ============================================
-- Supabase Database Setup
-- Marido de Aluguel (Handyman Service Platform)
-- ============================================

-- 1. Create SERVICES table
CREATE TABLE IF NOT EXISTS public.services (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  photo_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active services
CREATE POLICY "Allow public read access to active services"
  ON public.services
  FOR SELECT
  USING (active = true);

-- Policy: Authenticated users can insert/update/delete (admins only)
CREATE POLICY "Allow authenticated users to manage services"
  ON public.services
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- ============================================

-- 2. Create FEEDBACKS table
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for approved feedbacks
CREATE INDEX IF NOT EXISTS idx_feedbacks_approved ON public.feedbacks(is_approved);

-- Enable Row Level Security
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved feedbacks
CREATE POLICY "Allow public read access to approved feedbacks"
  ON public.feedbacks
  FOR SELECT
  USING (is_approved = true);

-- Policy: Anyone can insert feedbacks (clients can submit)
CREATE POLICY "Allow anyone to submit feedback"
  ON public.feedbacks
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can update/delete (admin approval)
CREATE POLICY "Allow authenticated users to manage feedbacks"
  ON public.feedbacks
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete feedbacks"
  ON public.feedbacks
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================

-- 3. Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to services table
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- STORAGE BUCKET SETUP INSTRUCTIONS
-- ============================================
-- The storage bucket must be created via Supabase Dashboard:
-- 
-- 1. Go to Storage section in Supabase Dashboard
-- 2. Click "Create a new bucket"
-- 3. Name: "service-images"
-- 4. Set as PUBLIC bucket (toggle on)
-- 5. After creation, go to Policies tab
-- 6. Add this policy for public read access:
--
-- Policy Name: "Public Access"
-- Policy Definition: 
-- FOR SELECT: USING (true)
-- FOR INSERT: USING (auth.role() = 'authenticated')
-- FOR DELETE: USING (auth.role() = 'authenticated')

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert sample services
INSERT INTO public.services (title, description, price, photo_url, active)
VALUES 
  ('Instalação de Chuveiro', 'Instalação completa de chuveiro elétrico com garantia', 150.00, NULL, true),
  ('Pintura de Parede', 'Pintura profissional de ambientes internos (preço por m²)', 25.00, NULL, true),
  ('Troca de Torneira', 'Substituição de torneira com vedação e teste', 80.00, NULL, true);

-- Insert sample feedbacks
INSERT INTO public.feedbacks (client_name, text, rating, is_approved)
VALUES 
  ('Maria Silva', 'Excelente profissional! Muito pontual e trabalho bem feito.', 5, true),
  ('João Santos', 'Serviço de qualidade, recomendo!', 4, true),
  ('Ana Costa', 'Resolveu meu problema rapidamente. Satisfeita!', 5, true);
