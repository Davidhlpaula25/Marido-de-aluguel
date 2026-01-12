# ✅ Checklist para Deploy

## Antes de Commitar no Git

### 1. Verificar Arquivos Sensíveis
- [ ] ⚠️ **IMPORTANTE**: Os arquivos `environment.ts` e `environment.prod.ts` estão no `.gitignore`
- [ ] Verificar se há credenciais hardcoded no código
- [ ] Confirmar que apenas arquivos `.example.ts` estão no repositório

### 2. Testar Localmente
- [ ] `npm install` - Todas as dependências instaladas
- [ ] `npm start` - Aplicação roda sem erros
- [ ] `npm run build:prod` - Build de produção funciona
- [ ] Testar funcionalidades principais:
  - [ ] Home page carrega serviços
  - [ ] Botão WhatsApp funciona
  - [ ] Sistema de avaliações (estrela) funciona
  - [ ] Login admin funciona
  - [ ] Dashboard admin funciona
  - [ ] CRUD de serviços funciona
  - [ ] Aprovação de feedbacks funciona

### 3. Banco de Dados Supabase
- [ ] Tabelas criadas (`services` e `feedbacks`)
- [ ] RLS desabilitado para `feedbacks` (desenvolvimento)
- [ ] Políticas configuradas para `services`
- [ ] Usuário admin criado
- [ ] Bucket de storage `service-images` criado (se usar fotos)

## Git

### 1. Inicializar Repositório
```bash
git init
git add .
git commit -m "feat: Initial commit - Marido de Aluguel platform"
```

### 2. Criar Repositório no GitHub
- [ ] Criar novo repositório no GitHub
- [ ] Copiar URL do repositório
- [ ] Adicionar remote: `git remote add origin URL_DO_SEU_REPO`
- [ ] Push: `git push -u origin main`

## Deploy na Vercel

### 1. Conectar Repositório
- [ ] Acessar [vercel.com](https://vercel.com)
- [ ] Fazer login (pode usar conta GitHub)
- [ ] Clicar em "Add New Project"
- [ ] Importar repositório do GitHub

### 2. Configurar Build
A Vercel detectará automaticamente, mas verifique:
- **Framework Preset**: Angular
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist/marido-aluguel/browser`
- **Install Command**: `npm install`

### 3. Variáveis de Ambiente
⚠️ **CRÍTICO**: Adicionar na seção Environment Variables:

```
Nome: SUPABASE_URL
Valor: https://bznpqlvdrendayeyanxe.supabase.co

Nome: SUPABASE_KEY  
Valor: sb_publishable_jpryfpXnwJcl1mh7eNNIGA_-n5dNWYA
```

- [ ] Variáveis adicionadas para **Production**
- [ ] Variáveis adicionadas para **Preview** (opcional)
- [ ] Variáveis adicionadas para **Development** (opcional)

### 4. Deploy
- [ ] Clicar em "Deploy"
- [ ] Aguardar build (2-3 minutos)
- [ ] ✅ Verificar se deploy foi bem-sucedido

## Pós-Deploy

### 1. Testar em Produção
- [ ] Acessar URL da Vercel
- [ ] Testar todas as funcionalidades
- [ ] Testar em diferentes dispositivos (mobile, tablet, desktop)
- [ ] Verificar console do navegador (sem erros)

### 2. Configurar Domínio (Opcional)
- [ ] Adicionar domínio personalizado na Vercel
- [ ] Configurar DNS
- [ ] Aguardar propagação
- [ ] Verificar SSL automático

### 3. Supabase - Produção
- [ ] Configurar CORS no Supabase (adicionar URL da Vercel)
- [ ] Revisar políticas RLS se necessário
- [ ] Considerar reativar RLS para feedbacks (segurança)

## Manutenção

### Deploy Contínuo
✅ Cada push para `main` fará deploy automático!

```bash
# Para fazer updates:
git add .
git commit -m "feat: nova funcionalidade"
git push
```

### Rollback
Se algo der errado:
- [ ] Acessar Vercel Dashboard
- [ ] Ir em Deployments
- [ ] Selecionar versão anterior
- [ ] Clicar em "Promote to Production"

## Problemas Comuns

### Build Falhou
- Verificar logs na Vercel
- Testar `npm run build:prod` localmente
- Verificar se todas as dependências estão no `package.json`

### Página em Branco
- Verificar console do navegador
- Verificar se variáveis de ambiente estão corretas
- Verificar se Supabase está acessível

### Erro 404 nas Rotas
- Arquivo `vercel.json` deve estar no root
- Verificar configuração de rotas no `vercel.json`

### Erro de CORS
- Adicionar URL da Vercel no Supabase Dashboard
- Ir em: Authentication → URL Configuration
- Adicionar em "Site URL" e "Redirect URLs"

---

## 📌 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Angular Deployment](https://angular.io/guide/deployment)

---

🎉 **Parabéns!** Seu projeto está no ar!
