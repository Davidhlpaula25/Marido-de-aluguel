# 🔧 Marido de Aluguel

Plataforma web para oferta de serviços de reparos domésticos (elétrica, hidráulica, montagem de móveis, etc.) com sistema de avaliações de clientes e painel administrativo.

## 🚀 Tecnologias

- **Angular 18** - Framework frontend
- **Angular Material** - Componentes UI
- **Supabase** - Backend as a Service (autenticação, banco de dados, storage)
- **TypeScript** - Linguagem de programação
- **SCSS** - Estilização

## ✨ Funcionalidades

### Para Clientes
- ✅ Visualização de serviços disponíveis
- ✅ Contato direto via WhatsApp
- ✅ Sistema de avaliação e comentários (com estrelas)
- ✅ Interface totalmente responsiva (mobile-friendly)

### Para Administradores
- ✅ Painel administrativo com autenticação
- ✅ Gerenciamento completo de serviços (CRUD)
- ✅ Upload de fotos dos serviços
- ✅ Moderação de avaliações (aprovar/rejeitar)
- ✅ Ativar/desativar serviços

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (gratuita)

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/marido-aluguel.git
cd marido-aluguel
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie os arquivos de exemplo
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
```

4. **Adicione suas credenciais do Supabase**

Edite `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'SUA_URL_AQUI',
  supabaseKey: 'SUA_CHAVE_PUBLICA_AQUI'
};
```

5. **Configure o banco de dados**

Execute os scripts SQL na ordem:
- `database/supabase-setup.sql` - Cria tabelas e estrutura
- `database/fix-disable-rls.sql` - Configura permissões

6. **Inicie o servidor de desenvolvimento**
```bash
npm start
```

Acesse: `http://localhost:4200`

## 📦 Build para Produção

```bash
npm run build:prod
```

Os arquivos de build estarão em `dist/marido-aluguel/browser/`

## 🚀 Deploy

### Vercel (Recomendado)

Consulte [DEPLOY.md](DEPLOY.md) para instruções detalhadas.

**Resumo:**
1. Push para GitHub
2. Conecte repositório na Vercel
3. Configure variáveis de ambiente
4. Deploy automático! 

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- 📱 Mobile (smartphones)
- 📱 Tablets
- 💻 Desktop

## 🔒 Segurança

- ✅ Row Level Security (RLS) no Supabase
- ✅ Autenticação JWT
- ✅ Variáveis de ambiente protegidas
- ✅ Credenciais nunca commitadas no Git

## 📝 Estrutura do Projeto

```
marido-aluguel/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/              # Página principal
│   │   │   ├── login/             # Login admin
│   │   │   └── admin-dashboard/   # Painel admin
│   │   ├── services/
│   │   │   └── supabase.service.ts # Serviço de integração
│   │   └── guards/
│   │       └── auth.guard.ts      # Proteção de rotas
│   ├── environments/               # Configurações de ambiente
│   └── assets/                     # Imagens e recursos
├── database/                       # Scripts SQL
└── docs/                          # Documentação

```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Desenvolvido para facilitar a conexão entre prestadores de serviços e clientes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma [Issue](https://github.com/seu-usuario/marido-aluguel/issues)
- Consulte a [Documentação do Supabase](https://supabase.com/docs)
- Veja os guias em `/docs`

---

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!

