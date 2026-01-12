# 🚀 Guia de Configuração Completo

## ✅ Status Atual
- ✅ Projeto Angular criado e configurado
- ✅ Angular Material instalado
- ✅ Supabase SDK instalado
- ✅ Todos os arquivos copiados
- ✅ Dependências instaladas

## 📍 **IMPORTANTE: Abra a nova pasta no VS Code**

```bash
cd C:\Users\Administrador\Desktop\marido-aluguel
code .
```

Depois feche a pasta antiga "Sistema de marido de aluguel".

---

## 🔧 Passos Restantes

### 1. Configurar Credenciais do Supabase

Edite estes 2 arquivos:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Substitua:
```typescript
supabaseUrl: 'YOUR_SUPABASE_PROJECT_URL',
supabaseKey: 'YOUR_SUPABASE_ANON_KEY'
```

Com suas credenciais do Supabase (Settings → API).

### 2. Executar Script SQL no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Cole todo o conteúdo de `database/supabase-setup.sql`
4. Clique em **Run**

### 3. Criar Bucket de Storage

No Supabase Dashboard:
1. **Storage** → **New bucket**
2. Nome: `service-images`
3. Marque **Public bucket**
4. Em **Policies**, adicione:
   - SELECT: `USING (true)`
   - INSERT: `USING (auth.role() = 'authenticated')`
   - DELETE: `USING (auth.role() = 'authenticated')`

### 4. Executar o Projeto

```bash
ng serve
```

Acesse: [http://localhost:4200](http://localhost:4200)

---

## 📂 Estrutura do Projeto

```
marido-aluguel/
├── database/
│   └── supabase-setup.sql          # Script SQL completo
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── admin-dashboard/    # Componente do painel admin
│   │   ├── services/
│   │   │   └── supabase.service.ts # Serviço Supabase
│   │   ├── app.component.ts
│   │   ├── app.routes.ts           # Rotas configuradas
│   │   └── app.config.ts
│   └── environments/
│       ├── environment.ts          # ⚠️ CONFIGURAR AQUI
│       └── environment.prod.ts     # ⚠️ E AQUI
├── angular.json
└── package.json
```

---

## 🎯 Funcionalidades Prontas

- ✅ CRUD completo de serviços
- ✅ Upload de imagens para Supabase Storage
- ✅ Preview de imagens antes do upload
- ✅ Validação de formulários
- ✅ Tabela responsiva com Angular Material
- ✅ Ativar/Desativar serviços
- ✅ Sistema de feedbacks
- ✅ Interface 100% em Português

---

## 📝 Próximos Passos (Opcional)

1. **Autenticação Admin:**
   - Criar usuário no Supabase (Authentication → Users)
   - Implementar guard de rota

2. **Página Pública:**
   - Criar componente para clientes visualizarem serviços
   - Formulário de solicitação de orçamento

3. **Sistema de Agendamento:**
   - Tabela `appointments` no Supabase
   - Calendário de disponibilidade

---

## ❓ Problemas Comuns

### Erro: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Erro: Angular Material não carrega
```bash
ng add @angular/material
```

### Erro de CORS do Supabase
- Verifique se as credenciais estão corretas
- Confirme que o bucket é **público**

---

**Pronto para começar! 🎉**
