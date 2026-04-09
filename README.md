# 🏥 Hospital Asset Management System - Sistema de Gestão de Patrimônio Hospitalar (Full Stack) (v1.0)

<div align="center">
  <img src="https://github.com/user-attachments/assets/36f46be1-51b5-471c-a8a5-7f84e7e7a92d" alt="Dashboard do Sistema de Gestão Hospitalar" width="100%">
</div>



![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white).
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

> Uma plataforma full-stack SaaS desenvolvida para simplificar o controle, auditoria e gestão financeira de equipamentos hospitalares.

Em ambientes críticos de saúde, a perda ou falta de manutenção de um ativo (como monitores cardíacos ou respiradores) pode gerar riscos irreparáveis. Este sistema foi arquitetado para oferecer aos gestores hospitalares um controle absoluto e rastreável sobre os patrimônios.

🔗 **[Acessar a Aplicação em Produção]** *https://hospital-management-system-gilt-kappa.vercel.app/*

---

## 🚀 Destaques da Versão 1.0 (Lançamento Oficial)

- 🌗 **Suporte Nativo a Temas (Light/Dark Mode):** Alternância em tempo real com persistência no `localStorage`, garantindo conforto visual.
- 📱 **Design Responsivo 100% SaaS:** A interface se adapta perfeitamente do Desktop ao Celular, transformando tabelas complexas em "Smart Cards" e recolhendo a Sidebar em um menu off-canvas.
- 📊 **Dashboard Analítico Dinâmico:** KPIs e gráficos interativos (Chart.js) refletindo o status financeiro e a alocação dos equipamentos por setor em tempo real.
- 📑 **Exportação Profissional (iText/Lowagie):** Geração instantânea de relatórios PDF consolidados do inventário e do histórico de movimentações.
- 🛡️ **Segurança Avançada (Spring Security + JWT):** Rotas protegidas, controle de acesso baseado em Roles (ADMIN vs TESTE) e interceptadores Axios que gerenciam sessões sem quebrar a UX.

---

## 🛠️ Arquitetura e Tecnologias

### 🖥️ Front-end (React + Vite)
- **Componentização Avançada:** Estrutura modular (Modais dinâmicos, Sidebars, Tabelas e KPI Cards).
- **Global CSS & CSS Modules:** Padronização visual aplicando o princípio DRY (Don't Repeat Yourself), com uso inteligente de variáveis CSS (`:root`) para temas.
- **Axios Interceptors:** Tratamento centralizado de erros (401, 403), direcionando o usuário sem flashes na tela ou perda de contexto.
- **UX Feedback:** Integração com `React Toastify`, `SweetAlert2` e ícones `Lucide React` para interações elegantes.

### ⚙️ Back-end (Java 17 + Spring Boot 3)
- **Documentação Interativa (Swagger/OpenAPI):** Interface gráfica gerada automaticamente (`/swagger-ui.html`) para exploração e teste de todos os endpoints REST, com suporte nativo à injeção de tokens JWT para simulação de requisições autenticadas.
- **Hibernate Envers (Auditoria de Dados):** Rastreabilidade total! Cada criação, edição ou deleção lógica gera uma trilha de auditoria inalterável, exibida em uma bela "Timeline" no front-end.
- **Padrão DTO e Java Records:** Transferência de dados imutável e segura entre as camadas.
- **Tratamento de Exceções Global (`@ControllerAdvice`):** O backend captura violações do banco e devolve mensagens JSON amigáveis, em vez de erros genéricos (`500`).

Para acessar a documentação da API, visite https://hospital-management-system-7gyi.onrender.com/swagger-ui/index.html

---

## 📂 Estrutura do Projeto Backend

*   **`OpenApiConfig`:** Configuração customizada do Swagger para suportar autenticação Bearer (JWT) globalmente.
*   **`PatrimonioController`:** Exposição dos endpoints REST documentados e geração de PDFs.
*   **`PatrimonioService`:** Concentração da lógica de negócio e queries avançadas do Envers para buscar o histórico de entidades, inclusive as removidas (`DEL`).
*   **`SecurityConfig` & `JwtAuthFilter`:** Blindagem das rotas, gestão de CORS e tratamento customizado de `AccessDeniedException` (403), além de liberação inteligente das rotas do Swagger.

---

## 🔧 Como Executar Localmente

### 1. Backend (Java)
1. Clone o repositório e abra a pasta `/back-end`.
2. Configure as credenciais do seu PostgreSQL no arquivo `application.properties`.
3. Execute o comando:
   ```bash
   ./mvnw spring-boot:run

   
### 2. Frontend (React)
Abra um novo terminal na pasta /front-end.
Instale as dependências:
code
Bash
npm install
Inicie o servidor de desenvolvimento:
code
Bash
npm run dev
Acesse http://localhost:5173 no seu navegador.

👨‍💻 **Autor**

**Endryus Schmidel** Desenvolvedor Full-Stack focado em criar soluções limpas, seguras e escaláveis.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/endryus-schmidel)
