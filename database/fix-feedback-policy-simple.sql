-- ============================================
-- CORREÇÃO SIMPLES E DIRETA - POLÍTICAS DE FEEDBACK
-- Execute este script COMPLETO no SQL Editor do Supabase
-- ============================================

-- PASSO 1: Desabilitar RLS temporariamente
ALTER TABLE public.feedbacks DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Remover TODAS as políticas existentes
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'feedbacks') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.feedbacks';
    END LOOP;
END $$;

-- PASSO 3: Reabilitar RLS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- PASSO 4: Criar políticas novas e simples

-- Qualquer pessoa pode ler feedbacks aprovados
CREATE POLICY "feedbacks_select_approved"
  ON public.feedbacks
  FOR SELECT
  USING (is_approved = true);

-- QUALQUER PESSOA pode inserir feedback (SEM AUTENTICAÇÃO)
CREATE POLICY "feedbacks_insert_public"
  ON public.feedbacks
  FOR INSERT
  WITH CHECK (true);

-- Apenas autenticados podem atualizar
CREATE POLICY "feedbacks_update_auth"
  ON public.feedbacks
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Apenas autenticados podem deletar
CREATE POLICY "feedbacks_delete_auth"
  ON public.feedbacks
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ============================================
-- VERIFICAÇÃO: Execute após o script acima
-- ============================================
-- SELECT * FROM pg_policies WHERE tablename = 'feedbacks';
