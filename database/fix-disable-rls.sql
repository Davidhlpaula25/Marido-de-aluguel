-- ============================================
-- SOLUÇÃO DEFINITIVA - DESABILITAR RLS PARA FEEDBACKS
-- Execute APENAS UMA das opções abaixo
-- ============================================

-- ==========================================
-- OPÇÃO 1: Desabilitar RLS Completamente (Recomendado para desenvolvimento)
-- ==========================================
-- Esta é a solução mais simples e funciona 100%
-- Use em ambiente de desenvolvimento/teste

ALTER TABLE public.feedbacks DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- OPÇÃO 2: Manter RLS mas com políticas ultra-permissivas
-- ==========================================
-- Se você PRECISA manter RLS ativo, descomente abaixo:

/*
-- Remover todas as políticas
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'feedbacks') LOOP
        EXECUTE 'DROP POLICY ' || quote_ident(r.policyname) || ' ON public.feedbacks CASCADE';
    END LOOP;
END $$;

-- Criar políticas ultra-permissivas
CREATE POLICY "feedbacks_all_select" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "feedbacks_all_insert" ON public.feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "feedbacks_all_update" ON public.feedbacks FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "feedbacks_all_delete" ON public.feedbacks FOR DELETE USING (true);
*/

-- ==========================================
-- VERIFICAÇÃO
-- ==========================================
-- Execute estas queries para verificar o status:

-- Ver se RLS está ativo:
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'feedbacks';

-- Ver políticas ativas:
SELECT * FROM pg_policies WHERE tablename = 'feedbacks';
