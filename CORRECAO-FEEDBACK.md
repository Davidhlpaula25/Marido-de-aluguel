# 🔧 Correção do Erro de Feedback

## Problema
A tabela `feedbacks` está com as políticas de segurança (RLS) bloqueando inserções de usuários não autenticados.

## Solução Rápida

### Opção 1: Executar o Script SQL (Recomendado)

1. Acesse seu painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto "Marido de Aluguel"
3. Vá em **SQL Editor** (no menu lateral esquerdo)
4. Clique em **New query**
5. Copie e cole o conteúdo do arquivo `database/fix-policies.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)

### Opção 2: Executar SQL Direto (Mais Rápido)

Cole este SQL no SQL Editor do Supabase:

```sql
-- Remover política antiga
DROP POLICY IF EXISTS "Allow anyone to submit feedback" ON public.feedbacks;

-- Criar política que permite qualquer pessoa inserir feedback
CREATE POLICY "Public can insert feedback"
  ON public.feedbacks
  FOR INSERT
  WITH CHECK (true);
```

### Opção 3: Desabilitar RLS Temporariamente (Apenas para Testes)

⚠️ **ATENÇÃO**: Isso remove toda a segurança! Use apenas em ambiente de desenvolvimento.

```sql
ALTER TABLE public.feedbacks DISABLE ROW LEVEL SECURITY;
```

## Verificação

Após executar o SQL:

1. Volte à aplicação
2. Clique na estrela ⭐ no canto inferior direito
3. Preencha o formulário e envie
4. Deve aparecer a mensagem de sucesso ✅

## Se ainda não funcionar

Verifique se as políticas estão ativas:

```sql
-- Verificar políticas da tabela feedbacks
SELECT * FROM pg_policies WHERE tablename = 'feedbacks';

-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'feedbacks';
```

## O que as políticas fazem?

- **SELECT**: Qualquer pessoa pode ver feedbacks aprovados (`is_approved = true`)
- **INSERT**: Qualquer pessoa pode enviar feedback (público)
- **UPDATE/DELETE**: Apenas usuários autenticados (admin) podem aprovar/deletar

Isso permite que:
- Clientes enviem avaliações sem fazer login ✅
- Admin precisa aprovar antes de aparecer no site ✅
- Admin pode gerenciar todos os feedbacks ✅
