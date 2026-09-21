# Iuaix (DaaS) - Enterprise Infrastructure

![Iuaix Logo](https://img.shields.io/badge/Iuaix-DaaS_Platform-0f3cc9?style=for-the-badge) ![Status](https://img.shields.io/badge/Status-MVP_Conclu%C3%ADdo-000000?style=for-the-badge&color=22c55e)

A **Iuaix** não é um catálogo de freelancers. É uma infraestrutura de **Design as a Service (DaaS)** focada exclusivamente no modelo B2B (Business-to-Business). A plataforma funciona como uma camada de governança rigorosa, roteando demandas criativas de empresas para "Squads/Células" por meio de inteligência preditiva e arbitragem matemática.

## 🏛 Filosofia Neo-Brutalista
O design system (UI/UX) da plataforma é intencionalmente **Neo-Brutalista**. 
Sem cantos arredondados, sem tons pastéis e sem estética "consumer SaaS". O painel é feito para parecer um "QG Operacional" ou "Terminal Financeiro" – bordas pesadas, altíssimo contraste, uso de maiúsculas e vocabulário industrial.

## 🚀 Funcionalidades Principais (O Motor DaaS)

*   **Matchmaking Baseado em Scores (Anti-Viés):** O cliente não navega por vitrines. Ele digita o que precisa e o algoritmo cruza 4 variáveis (Aderência Técnica, Rating, Ociosidade e Taxa de Sucesso SLA) para alocar o profissional ideal (Blind Review).
*   **Brand Vault (Cofre de IP):** O fim dos briefings repetitivos. A empresa armazena Diretrizes de Marca, Cores Hex, Tom de Voz e Regras. Essa inteligência é injetada automaticamente na mesa de trabalho do profissional alocado.
*   **Workspace & SLA Tracker:** O "Chat" foi transformado numa mesa de operação com contratos fixados (Limites de Refatoração vs. Pivotagem de Rota) e regras de Escrow travadas na tela.
*   **Protocolo Forense de Entrega:** Modal de transferência de arquivo que bloqueia a verba em tokens até que o cliente dê o "Rating" final atestando a qualidade e a ausência de plágio, momento no qual a Propriedade Intelectual (IP) é formalmente transferida para o Dashboard de ROI.
*   **Backoffice S.W.A.T:** Painel administrativo oculto (`/admin`) para mediação de conflitos, estorno de tokens e interrupção de contratos (Role-Based Access Control).

## 🛡️ Segurança (Edge Middleware)
O aplicativo roda com proteções corporativas no lado do servidor (Next.js Middleware):
*   **RBAC (Role-Based Access Control):** Bloqueio imediato entre Contas "Empresa", Contas "Criativo" e "Admins".
*   **Prevenção FOUC:** Eliminação de "Flash of Unauthenticated Content" por meio de interceptadores que operam antes da injeção do React.
*   **HTTP Security Headers:** X-XSS-Protection, HSTS, X-Frame-Options (Anti-Clickjacking) e Strict Referrer Policy ativos.

## 🛠 Tecnologias (Stack)
*   **Framework:** Next.js 14 (App Router)
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS (Arquitetura Neo-Brutalista)
*   **Ícones:** Lucide React
*   **Estado & Autenticação (MVP):** Edge Middleware + Cookie Syncing + LocalStorage Simulator

## ⚙️ Como Rodar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/RenatoSZA/IUAIX.git
cd IUAIX
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
*Nota: Para testar o painel administrativo, crie uma conta normalmente e, na aba Application do navegador, altere manualmente a variável `userRole` no LocalStorage e no Cookie para `admin`.*
