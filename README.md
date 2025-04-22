# 📦 Amazon Product Scraper

Projeto full stack que realiza a extração de produtos da Amazon Brasil a partir de um termo de busca informado pelo usuário. A aplicação retorna os produtos da primeira página de resultados, exibindo título, preço, avaliação, número de reviews e imagem.

---

## 🎯 Funcionalidades

✅ Backend usando **Bun**, **Express**, **Axios** e **JSDOM**  
✅ Frontend com **Vite**, **HTML**, **CSS** e **JavaScript Vanilla**  
✅ Busca dinâmica de produtos da Amazon  
✅ Cards responsivos com dados organizados  
✅ Tratamento de erros e bloqueios da Amazon

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Bun, Express, Axios, JSDOM, CORS  
- **Frontend:** Vite, HTML, CSS, JavaScript Vanilla  

---

## 📦 Instalação e Execução

### 🔹 Backend (API com Bun)

1. Acesse a pasta do backend:
   ```bash
   cd api
   ```

2. Instale as dependências:
   ```bash
   bun install
   ```

3. Inicie o servidor:
   ```bash
   bun run index.ts
   ```

> 🔗 A API estará disponível em `http://localhost:3000`

### 🔹 Frontend (Vite)

1. Volte para a raiz do projeto e acesse a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

> 🌐 O site estará disponível em `http://localhost:5173`

---

## ⚙️ Como Usar

1. Abra o navegador e acesse `http://localhost:5173`
2. Digite um termo no campo de busca (ex: `smartphone`, `notebook`)
3. Clique no botão **Search Amazon**
4. Veja os produtos listados com:
   - 📖 Título
   - ⭐ Avaliação
   - 💬 Número de Reviews
   - 💰 Preço
   - 📸 Imagem

---

## 🛡️ Considerações

- O scraping da Amazon pode sofrer bloqueios, especialmente após várias requisições seguidas.
- O projeto inclui:
  - Rotação de User-Agent
  - Cookies dinâmicos
  - Retry automático
  - Delay entre requisições

⚠️ Para produção ou uso frequente, recomenda-se o uso de **proxies ou serviços pagos**.

---

## 📃 Endpoints Disponíveis

| Método | Rota               | Descrição                          |
|:--------|:-------------------|:------------------------------------|
| `GET`   | `/api/scrape`       | Retorna os produtos para o termo buscado |
| `GET`   | `/health`           | Verifica se o servidor está online  |

---

## 🖥️ Script de Inicialização Completo com Instalação Automática

Para facilitar o setup completo do projeto em ambientes Windows com PowerShell, este repositório inclui um script automático que:

- Verifica e instala **Node.js** e **npm** se necessário
- Instala **Bun** globalmente
- Instala as dependências do projeto (backend e frontend)
- Inicia o servidor backend (porta 3000)
- Inicia o servidor frontend (porta 5173)
- Abre automaticamente o navegador com a aplicação

### 📂 Como Usar

1. Salve o script como `Start-Project.ps1` na raiz do projeto
2. Execute como administrador:
   - Clique com o botão direito no arquivo
   - Selecione "Executar com PowerShell"
   - Se aparecer aviso de segurança, digite `R` para executar uma vez

### ✅ Funcionalidades do Script

- **Instalação Automática:** Node.js, npm, Bun
- **Configuração Automática:** dependências backend e frontend
- **Inicialização:** servidores backend e frontend + browser
- **Mensagens amigáveis:** com cores, instruções e progresso
- **Tratamento de erros:** com verificação etapa a etapa

### 📁 Versão Simplificada em Batch (.bat)

Para quem prefere um `.bat` simples:

- Instala Node.js e Bun se necessário
- Instala as dependências
- Inicia backend e frontend
- Abre o navegador

---

## 👨‍💻 Desenvolvido por  
**Marcelo Augusto de Mello Paixão**  
[LinkedIn](https://linkedin.com/in/marceloamellopaixao) | [GitHub](https://github.com/marceloamellopaixao)

---