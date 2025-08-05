# Guia de Contribuição - ClipLet

Obrigado por considerar contribuir para o ClipLet! Este documento fornece diretrizes para contribuições.

## 🚀 Como Contribuir

### 1. Configuração do Ambiente

1. **Fork** o repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/seu-usuario/cliplet.app.git
   cd cliplet.app/web
   ```
3. **Instale** as dependências:
   ```bash
   pnpm install
   ```
4. **Configure** o ambiente seguindo o README principal

### 2. Fluxo de Desenvolvimento

1. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. **Desenvolva** sua feature ou correção

3. **Teste** suas mudanças:
   ```bash
   pnpm lint
   pnpm build
   ```

4. **Commit** suas mudanças:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```

5. **Push** para seu fork:
   ```bash
   git push origin feature/nome-da-feature
   ```

6. **Abra um Pull Request** no repositório original

## 📋 Convenções

### Commits
Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Mudanças de formatação (não afetam código)
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Mudanças em ferramentas, configurações, etc.

### Código
- Use **TypeScript** para todos os arquivos
- Siga o **ESLint** configurado
- Use **kebab-case** para nomes de arquivos
- Use **PascalCase** para componentes React
- Use **camelCase** para funções e variáveis
- Mantenha componentes **pequenos e focados**
- Adicione **tipos apropriados** sempre

### Arquivos e Pastas
```
components/
├── ui/           # Componentes base (shadcn/ui)
├── feature.tsx   # Componentes específicos
└── index.ts      # Exports organizados

hooks/
├── use-feature.ts  # Custom hooks
└── index.ts

lib/
├── utils.ts      # Utilitários gerais
└── feature.ts    # Utilitários específicos
```

## 🧪 Testes

Atualmente o projeto não possui testes automatizados, mas você pode:

1. **Testar manualmente** todas as funcionalidades
2. **Verificar** diferentes tipos de arquivo
3. **Testar** em diferentes navegadores
4. **Validar** responsividade

Para adicionar testes no futuro, considere:
- Jest + Testing Library para testes unitários
- Playwright para testes E2E

## 📝 Documentação

Ao adicionar novas funcionalidades:

1. **Atualize** o README se necessário
2. **Documente** novas variáveis de ambiente
3. **Adicione** comentários em código complexo
4. **Documente** novos endpoints da API

## 🐛 Reportando Bugs

Ao reportar bugs, inclua:

1. **Descrição** clara do problema
2. **Passos** para reproduzir
3. **Comportamento esperado** vs **atual**
4. **Screenshots** se aplicável
5. **Ambiente** (OS, navegador, versão)

## 💡 Sugerindo Features

Para sugerir novas funcionalidades:

1. **Verifique** se já não existe uma issue
2. **Descreva** o problema que resolve
3. **Explique** a solução proposta
4. **Considere** o impacto na UX/performance

## 🔍 Code Review

Pull Requests serão revisados considerando:

- **Qualidade** do código
- **Consistência** com o projeto
- **Performance** e segurança
- **Documentação** adequada
- **Testes** (quando aplicável)

## 🚀 Areas para Contribuição

### Fácil
- Correções de bugs simples
- Melhorias na documentação
- Correções de typos
- Pequenas melhorias na UI

### Intermediário
- Novos tipos de clip
- Melhorias na UX
- Otimizações de performance
- Novos componentes UI

### Avançado
- Novos provedores OAuth
- Sistema de compartilhamento
- API pública
- Recursos de colaboração

## 📞 Contato

Para dúvidas sobre contribuições:
- Abra uma **issue** para discussão
- Entre em contato com [@cybermumuca](https://github.com/cybermumuca)

---

Obrigado por contribuir! 🚀