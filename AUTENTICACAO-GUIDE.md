# 🔐 Guia de Configuração - Autenticação e Permissões

## ✅ O que foi implementado:

1. **Tela de Login** - `/login`
2. **Proteção da rota /admin** - Só acessa quem estiver logado
3. **Botão de Logout** no painel admin
4. **Correção das políticas de segurança** do Supabase

---

## 📋 PASSO A PASSO PARA CONFIGURAR:

### 1️⃣ Configure suas credenciais do Supabase

Edite o arquivo: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://seu-projeto.supabase.co',
  supabaseKey: 'sua-chave-anon-publica-aqui'
};
```

**Onde pegar:**
- Acesse: https://app.supabase.com
- Selecione seu projeto
- Vá em: **Settings → API**
- Copie: `Project URL` e `anon public`

---

### 2️⃣ Execute os Scripts SQL no Supabase

#### A) Primeiro execute o script principal:

No Supabase Dashboard:
- Vá em: **SQL Editor**
- Clique em: **New Query**
- Cole o conteúdo do arquivo: `database/supabase-setup.sql`
- Clique em: **Run**

#### B) Depois execute o script de correção:

- No mesmo SQL Editor
- Cole o conteúdo do arquivo: `database/fix-policies.sql`
- Clique em: **Run**

Isso vai corrigir os erros de permissão que você estava tendo!

---

### 3️⃣ Crie o Bucket de Storage

No Supabase Dashboard:
1. Vá em: **Storage**
2. Clique em: **Create a new bucket**
3. Nome: `service-images`
4. Marque: **Public bucket** ✅
5. Clique em: **Create bucket**

#### Configure as políticas do bucket:

Clique no bucket `service-images` → **Policies** → **New Policy**

**Política 1: Upload (INSERT)**
```sql
Nome: Authenticated users can upload
Target roles: authenticated
Policy definition: (auth.uid() IS NOT NULL)
```

**Política 2: Delete**
```sql
Nome: Authenticated users can delete
Target roles: authenticated  
Policy definition: (auth.uid() IS NOT NULL)
```

---

### 4️⃣ Crie seu Usuário Admin

No Supabase Dashboard:
1. Vá em: **Authentication → Users**
2. Clique em: **Add user**
3. Preencha:
   - Email: `seu@email.com`
   - Password: `SuaSenhaSegura123`
   - Auto Confirm User: **SIM** ✅
4. Clique em: **Create user**

---

## 🎯 Como usar:

### Para acessar a área admin:

1. Acesse: `http://localhost:4200/login`
2. Digite o email e senha que você criou
3. Clique em **Entrar**
4. Você será redirecionado para `/admin`

### Fluxo de navegação:

```
┌──────────────────────┐
│   Página Inicial     │ → Botão "Área Admin"
│  (Serviços públicos) │
└──────────────────────┘
           ↓
┌──────────────────────┐
│   Tela de Login      │ → Digite email/senha
│   /login             │
└──────────────────────┘
           ↓
┌──────────────────────┐
│  Painel Admin        │ → Gerenciar serviços
│  /admin              │ → Botão "Sair" (logout)
└──────────────────────┘
```

---

## 🔒 Segurança implementada:

✅ **Guard de autenticação** - Rota `/admin` protegida
✅ **Políticas RLS** - Banco de dados seguro
✅ **Storage protegido** - Só admins fazem upload
✅ **Sessão persistente** - Login mantido no navegador
✅ **Logout seguro** - Limpa sessão completamente

---

## 🐛 Erros comuns e soluções:

### Erro: "Invalid login credentials"
- Verifique se o email/senha estão corretos
- Confirme que o usuário foi criado no Supabase

### Erro: "new row violates row-level security policy"
- Execute o script `fix-policies.sql`
- Certifique-se de estar logado ao tentar adicionar serviços

### Erro ao fazer upload de imagem:
- Verifique se o bucket `service-images` existe
- Confirme que o bucket é público
- Verifique as políticas do bucket

---

## 🎉 Pronto!

Agora seu sistema está completo com:
- ✅ Login/Logout funcionando
- ✅ Área administrativa protegida
- ✅ Upload de imagens corrigido
- ✅ Todas as permissões configuradas

**Teste agora:**
1. Recarregue a página
2. Clique em "Área Admin"
3. Faça login com seu usuário
4. Adicione um novo serviço com foto!
