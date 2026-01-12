-- ============================================
-- ATUALIZAÇÃO DE POLÍTICAS DE SEGURANÇA
-- Execute este script para corrigir os erros de permissão
-- ============================================

-- 1. REMOVER TODAS AS POLÍTICAS ANTIGAS (TODOS OS NOMES POSSÍVEIS)
DROP POLICY IF EXISTS "Allow public read access to active services" ON public.services;
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated users to manage services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users full access to services" ON public.services;

DROP POLICY IF EXISTS "Allow public read access to approved feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Public can view approved feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow anyone to submit feedback" ON public.feedbacks;
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedbacks;
DROP POLICY IF EXISTS "Public can insert feedback" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow authenticated users to manage feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Authenticated users full access to feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Allow authenticated users to delete feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Authenticated users can delete feedbacks" ON public.feedbacks;

-- 2. CRIAR POLÍTICAS CORRETAS PARA SERVICES
-- Permitir leitura pública de serviços ativos
CREATE POLICY "Public can view active services"
  ON public.services
  FOR SELECT
  USING (active = true);

-- Permitir que usuários autenticados façam tudo
CREATE POLICY "Authenticated users full access to services"
  ON public.services
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. CRIAR POLÍTICAS CORRETAS PARA FEEDBACKS
-- Permitir leitura pública de feedbacks aprovados
CREATE POLICY "Public can view approved feedbacks"
  ON public.feedbacks
  FOR SELECT
  USING (is_approved = true);

-- Permitir que qualquer pessoa envie feedback (PÚBLICO - SEM AUTENTICAÇÃO)
CREATE POLICY "Anyone can submit feedback"
  ON public.feedbacks
  FOR INSERT
  WITH CHECK (true);

-- Permitir que usuários autenticados gerenciem feedbacks
CREATE POLICY "Authenticated users full access to feedbacks"
  ON public.feedbacks
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete feedbacks"
  ON public.feedbacks
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ============================================
-- CONFIGURAÇÃO DE STORAGE BUCKET
-- ============================================
-- Execute estes comandos no painel Storage do Supabase:
--
-- 1. Criar bucket "service-images" (se não existir)
-- 2. Tornar o bucket PÚBLICO
-- 3. Adicionar política de INSERT para autenticados:
--
-- Policy name: Authenticated users can upload
-- Policy definition:
-- (auth.uid() IS NOT NULL)
--
-- 4. Adicionar política de DELETE para autenticados:
--
-- Policy name: Authenticated users can delete
-- Policy definition:
-- (auth.uid() IS NOT NULL)

-- ============================================
-- CRIAR USUÁRIO ADMIN
-- ============================================
-- Vá para: Authentication → Users → Add User
-- Email: seu@email.com
-- Password: SuaSenhaSegura123
--
-- Ou use este código SQL (se preferir):
-- Nota: Você precisa ter privilégios de admin

-- SELECT auth.users;
-- INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
-- VALUES ('admin@maridodealuguel.com', crypt('SuaSenha123', gen_salt('bf')), NOW());
