# 🚀 Deploy - Instruções para Vercel

## Pré-requisitos
- Conta no GitHub
- Conta na Vercel (pode usar login do GitHub)
- Projeto Supabase configurado

## Passo 1: Preparar o Repositório Git

```bash
# Inicializar repositório (se ainda não tiver)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - Marido de Aluguel"

# Criar repositório no GitHub e adicionar remote
git remote add origin https://github.com/SEU-USUARIO/marido-aluguel.git

# Enviar para o GitHub
git push -u origin main
```

## Passo 2: Configurar Variáveis de Ambiente na Vercel

⚠️ **IMPORTANTE**: O projeto gera automaticamente os arquivos de environment durante o build.

Antes de fazer o deploy, você precisa:

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Importe seu repositório do GitHub
3. Na seção **Environment Variables**, adicione:

**Nome das Variáveis** (exatamente assim):
```
SUPABASE_URL
SUPABASE_KEY
```

**Valores** (suas credenciais do Supabase):
```
SUPABASE_URL=https://bznpqlvdrendayeyanxe.supabase.co
SUPABASE_KEY=sb_publishable_jpryfpXnwJcl1mh7eNNIGA_-n5dNWYA
```

⚠️ Aplique para: **Production**, **Preview** e **Development**

## Passo 3: Deploy Automático

Após conectar o repositório:

1. A Vercel irá detectar automaticamente que é um projeto Angular
2. Build Command: `npm run build`
3. Output Directory: `dist/marido-aluguel/browser`
4. Clique em **Deploy**

## Passo 4: Configurar Domínio Personalizado (Opcional)

1. Vá em Settings > Domains
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

## URLs de Produção

Após o deploy, sua aplicação estará disponível em:
- URL Vercel: `https://marido-aluguel-xxx.vercel.app`
- Domínio customizado (se configurado): `https://seu-dominio.com`

## Atualizações Futuras

Cada push para a branch `main` irá:
1. Triggerar um build automático
2. Fazer deploy automático
3. Atualizar o site em produção

## Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme que o comando `npm run build` funciona localmente

### Erro 404 nas Rotas
- O arquivo `vercel.json` já está configurado para resolver isso
- Se persistir, verifique se o arquivo está no root do projeto

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas na Vercel
- Confirme que as URLs do Supabase estão acessíveis publicamente

## Segurança

✅ **O que está configurado:**
- Row Level Security (RLS) no Supabase
- Variáveis de ambiente protegidas
- CORS configurado no Supabase

⚠️ **Lembre-se:**
- Nunca commite credenciais no Git
- Use sempre a `anon/public` key do Supabase (não a service key!)
- Configure políticas RLS apropriadas no Supabase
