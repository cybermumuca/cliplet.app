# cliplet.app 📋

**cliplet.app** é uma aplicação web moderna de área de transferência que permite armazenar, organizar e compartilhar diferentes tipos de conteúdo de forma segura e eficiente.

## ✨ Características

- 📝 **Texto**: Armazene e gerencie snippets de texto, código e notas
- 🖼️ **Imagens**: Upload e visualização de imagens com suporte a múltiplos formatos
- 🎥 **Vídeos**: Armazenamento de vídeos com preview
- 🎵 **Áudio**: Suporte a arquivos de áudio
- 📄 **Documentos**: PDFs, documentos de texto e planilhas
- 📁 **Arquivos**: Qualquer tipo de arquivo até 10MB
- 🌙 **Tema escuro/claro**: Interface adaptável com troca de tema
- 📱 **Design responsivo**: Funciona perfeitamente em desktop e mobile
- 🔒 **Autenticação segura**: Login via GitHub OAuth
- ⚡ **Interface moderna**: Construída com Next.js e React 19

## 🛠️ Stack Tecnológica

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca de interface do usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de estilização
- **[Radix UI](https://www.radix-ui.com/)** - Componentes de interface acessíveis
- **[Lucide React](https://lucide.dev/)** - Ícones modernos
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de dados e cache
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação baseada em tokens
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[S3-Compatible Storage](https://aws.amazon.com/s3/)** - Armazenamento de arquivos
- **[GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps)** - Autenticação de usuários

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm
- PostgreSQL
- Bucket S3 ou compatível (MinIO, DigitalOcean Spaces, etc.)
- Aplicação GitHub OAuth

### 1. Clone o repositório

```bash
git clone https://github.com/cybermumuca/cliplet.app.git
cd cliplet.app/web
```

### 2. Instale as dependências

```bash
pnpm install
# ou
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na pasta `web` com as seguintes variáveis:

```env
# GitHub OAuth
GITHUB_OAUTH_CLIENT_ID=seu_github_client_id
GITHUB_OAUTH_CLIENT_SECRET=seu_github_client_secret
GITHUB_OAUTH_CLIENT_REDIRECT_URI=http://localhost:3000/auth/github/callback

# Google OAuth (opcional - para futuras implementações)
GOOGLE_OAUTH_CLIENT_ID=seu_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=seu_google_client_secret
GOOGLE_OAUTH_CLIENT_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Banco de dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/cliplet

# JWT
JWT_SECRET=seu_jwt_secret_muito_seguro

# S3 Storage
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY_ID=sua_access_key
S3_SECRET_ACCESS_KEY=sua_secret_key
S3_BUCKET_NAME=cliplet-storage
S3_PUBLIC_URL=https://seu-bucket.s3.amazonaws.com
```

### 4. Configure o GitHub OAuth

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Crie uma nova OAuth App
3. Configure:
   - **Application name**: cliplet.app
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
4. Copie o Client ID e Client Secret para o `.env.local`

### 5. Configure o banco de dados

```bash
# Gere as migrações
pnpm db:generate

# Execute as migrações
pnpm db:migrate:dev
```

### 6. Execute em desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## 📊 Banco de Dados


### Comandos úteis do banco

```bash
# Visualizar o banco em modo studio
pnpm db:studio

# Gerar novas migrações após mudanças no schema
pnpm db:generate

# Aplicar migrações em desenvolvimento
pnpm db:migrate:dev

# Aplicar migrações em produção
pnpm db:migrate
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia o servidor de desenvolvimento
pnpm build            # Builda a aplicação para produção
pnpm start            # Inicia o servidor de produção
pnpm lint             # Executa o linter

# Banco de dados
pnpm db:generate      # Gera migrações do Drizzle
pnpm db:studio        # Abre o Drizzle Studio
pnpm db:migrate       # Executa migrações
pnpm db:migrate:dev   # Executa migrações em dev com .env.local
```

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/github` - Autenticação via GitHub
- `POST /api/auth/github/callback` - Callback do GitHub OAuth

### Clips
- `GET /api/clips` - Lista todos os clips do usuário
- `POST /api/clips` - Cria um novo clip
- `GET /api/clips/[id]` - Obtém um clip específico
- `DELETE /api/clips/[id]` - Remove um clip
- `POST /api/clips/upload-url` - Gera URL pré-assinada para upload

## 🏗️ Estrutura do Projeto

```
web/
├── app/                    # App Router do Next.js
│   ├── (app)/             # Grupo de rotas da aplicação
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/               # Componentes base do shadcn/ui
│   └── ...               # Componentes específicos da app
├── db/                   # Configuração do banco de dados
│   ├── schema/           # Schemas do Drizzle
│   └── connection.ts     # Conexão com o banco
├── hooks/               # Custom React Hooks
├── lib/                 # Utilitários e configurações
├── store/              # Estado global (Zustand)
├── types/              # Tipos TypeScript
└── public/             # Arquivos estáticos
```

## 🔒 Segurança

- Autenticação via OAuth (GitHub)
- Tokens JWT com expiração
- Validação de schemas com Zod
- Upload seguro via URLs pré-assinadas
- Limitação de tamanho de arquivos (10MB)
- Headers de segurança configurados

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Docker

```bash
# Build da imagem
docker build -t cliplet-app .

# Execute o container
docker run -p 3000:3000 --env-file .env cliplet-app
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Convenções de Código

- Use TypeScript em todos os arquivos
- Siga o padrão de nomenclatura kebab-case para arquivos
- Use componentes funcionais com hooks
- Mantenha componentes pequenos e focados
- Adicione tipos apropriados

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔧 Problemas Conhecidos

- Upload de arquivos muito grandes pode ser lento
- Alguns tipos de arquivo podem não ter preview

## 🗺️ Roadmap

- [ ] Suporte a mais provedores OAuth (Google, Microsoft)
- [ ] Compartilhamento de clips via link
- [ ] Organização em pastas/tags
- [ ] API pública para desenvolvedores
- [ ] Aplicativo mobile
- [ ] Sync entre dispositivos
- [ ] Histórico de versões para clips de texto

---

Desenvolvido com ❤️ por [cybermumuca](https://github.com/cybermumuca)
