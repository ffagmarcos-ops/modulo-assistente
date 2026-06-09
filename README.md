# 🎙️ Portal do Assistente Virtual, Onboarding e Treinamento Corporativo (LMS)

Este projeto é um portal inteligente e robusto para **rastreamento de sistemas web, geração de bases de conhecimento didáticas e criação de assistentes de onboarding**. Ele analisa a estrutura de uma aplicação web, cruza dados de documentação oficial (README) e compila um manual completo em formato JSON contendo módulos, fluxos de trabalho, FAQs e gatilhos semânticos de linguagem natural (NLP).

O portal inclui um **Simulador de Chat**, um **Módulo de Podcast (Diálogo Falado)** integrado com as vozes ultra-realistas do **Google AI Studio (Gemini)**, e uma **Suíte de Treinamento Corporativo completa (Slides, Quizzes e Cartilhas de Impressão)**.

---

## 📂 Novidades e Recursos do Sistema

### 1. 📂 Repositório Multi-Assistente Persistente
O sistema agora funciona como uma suíte centralizadora para várias aplicações:
- **Dashboard de Projetos**: A tela inicial exibe um repositório com todos os assistentes já gerados.
- **Persistência Local**: Salva automaticamente os dados pós-varredura, customizações de nome, avatares e manuais complementares no `localStorage` do navegador.
- **Alternância Rápida**: Botões para abrir o painel operacional de cada assistente ou excluí-lo, além de um botão de navegação para retornar ao repositório a partir de qualquer assistente ativo.

### 2. 📄 Upload e Cruzamento de Documentação (README)
- **Análise Técnica**: Botão de upload de arquivos de documentação (`README.md` ou `.txt`) integrado ao cabeçalho.
- **Fidelidade da Base**: O parser lê o arquivo e enriquece o JSON extraindo:
  - O nome correto da aplicação (a partir do título `#`).
  - Parágrafos específicos de funcionamento para complementar descrições e passos de cada módulo.
  - Perguntas e respostas do documento (`Q: / A:`) convertidas automaticamente em FAQs do chatbot.
  - Artigos de suporte segmentados gerados a partir de subtópicos (`##`).

### 3. ✍️ Treinamento Manual Complementar
- **Manual do Usuário**: Textarea na barra lateral para digitar instruções operacionais personalizadas e regras de negócio exclusivas da empresa.
- **Busca Semântica Offline**: O chatbot local do painel e do widget exportado analisa este manual complementar e responde dúvidas dos novos usuários extraindo parágrafos precisos por correspondência de palavras-chave.

### 4. 🎓 Suíte de Onboarding e Treinamento (LMS)
Uma aba dedicada dividida em três ferramentas didáticas interativas:
- **📊 Apresentação (Slides)**:
    - Roteiro interativo de 5 slides explicativos baseados na varredura (introdução, módulos, fluxos cruciais, erros comuns e boas práticas).
    - Controles de avanço/retorno e barra de progresso horizontal superior.
- **📝 Quiz de Validação**:
    - Questionários interativos com 3 perguntas de múltipla escolha para cada módulo operacional.
    - **Modo Online**: Geração dinâmica contextualizada usando a API do Gemini 1.5 Flash em formato JSON estruturado.
    - **Modo Offline**: Geração algorítmica instantânea a partir das tabelas, inputs e erros escaneados da tela.
    - Validação instantânea (verde/vermelho) com justificativa de resposta e painel de score final.
- **📋 Cartilha de Bolso (Playbook) para Impressão**:
    - Resumo de consulta rápida com atalhos, boas práticas e prevenção de erros.
    - **Impressão Física (`window.print()`)**: Estilização via CSS `@media print` que oculta o dashboard escuro, botões e barras laterais, formatando a cartilha em um folheto limpo em preto e branco perfeito para impressão física ou PDF.

---

## 📂 Estrutura de Pastas e Arquivos

O projeto segue a estrutura padrão de uma aplicação React moderna construída com Vite e TypeScript:

```bash
modulo-assistente/
├── public/                 # Recursos estáticos acessíveis diretamente pela aplicação
│   ├── male_avatar.png     # Retrato realista do assistente Lucas (Masc)
│   ├── female_avatar.png   # Retrato realista da assistente Sofia (Fem)
│   └── favicon.svg         # Favorito da aba do navegador
├── src/
│   ├── assets/             # Ativos e imagens consumidos pelo React
│   ├── components/         # Componentes organizados do Portal
│   │   ├── ScannerConsole.tsx     # Terminal animado que simula a varredura (Crawler)
│   │   └── modulo-assistente/     # Módulo embarcado
│   │       ├── AssistantDrawer.tsx # Componente de drawer flutuante do assistente
│   │       └── assistant_guide.json # Base gerada
│   ├── App.tsx             # Arquivo central (Configurador, Chat, Podcast, Treinamento, Exportador)
│   ├── index.css           # Design system premium dark/glassmorphic e regras de impressão (@media print)
│   ├── main.tsx            # Ponto de entrada da renderização React
│   └── types.ts            # Tipagens do TypeScript
├── scratch/                # Scripts auxiliares e de automação
│   └── push_to_github.js   # Script CLI para criação automática de repositórios no GitHub
├── eslint.config.js        # Configurações de padronização de código
├── tsconfig.json           # Configurações gerais do compilador TypeScript
├── vite.config.ts          # Arquivo de configuração de empacotamento do Vite
└── README.md               # Este arquivo (Manual Geral do Desenvolvedor)
```

---

## 🛠️ Tecnologias Utilizadas

1. **Core**: React (v19) com TypeScript (v5) e Vite (v6).
2. **Estilização**: Vanilla CSS com variáveis CSS, Glassmorphism, animações fluídas de HMR e regras especializadas para folha de impressão física.
3. **Áudio & Voz (TTS)**:
   - **Online**: API do Google AI Studio (Gemini 1.5 Flash) configurando `responseModalities: ["AUDIO"]` para saída de áudio com as vozes de estúdio ultra-realistas `Puck` (Lucas) e `Aoede` (Sofia).
   - **Offline (Fallback)**: API de Síntese de Voz Nativa do Navegador (`SpeechSynthesis`) filtrando vozes locais de português.
4. **Armazenamento**: `localStorage` do navegador para persistência da chave de API e do repositório de assistentes.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js instalado (versão 18 ou superior).
- NPM (gerenciador de pacotes).

### Passo 1: Instalar as Dependências
Abra o terminal na pasta do projeto e execute:
```bash
npm install
```

### Passo 2: Iniciar o Servidor de Desenvolvimento
Inicie a aplicação localmente:
```bash
npm run dev
```
O servidor estará disponível no endereço: **[http://localhost:5174/](http://localhost:5174/)**

### Passo 3: Compilar para Produção (Build)
Para compilar o código e validar a corretude das tipagens estritas do TypeScript:
```bash
npm run build
```
O resultado de distribuição otimizada será salvo na pasta `dist/`.

---

## 💬 Exportação do Chat Flutuante (Widget)

O portal permite baixar um arquivo autossuficiente chamado `[nome_do_sistema]_widget.html`:
- Contém todo o JSON da base de conhecimento (incluindo o manual complementar e documentação do README) embutido.
- Fornece um chat flutuante completo com inteligência artificial local de correspondência de gatilhos (NLP local sem consumo de tokens).
- Oferece suporte nativo de áudio gratuito utilizando a síntese do próprio navegador, de acordo com o avatar selecionado (Lucas ou Sofia).
- A caixa de busca do widget realiza pesquisas inteligentes parágrafo por parágrafo do manual de treinamento suplementar de forma autônoma e offline.

---

## ✍️ Guia de Orientações no Código (`App.tsx`)

Ao abrir o arquivo `src/App.tsx`, você encontrará orientações comentadas sobre:
- **`generateErpJson`**: Função programática que monta o JSON de conhecimento (módulos, FAQs, gatilhos, etc.).
- **`enrichJsonWithReadme`**: Parser local que analisa o conteúdo da documentação Markdown carregada para injetar regras operacionais nos módulos e FAQs correspondentes.
- **`fetchGeminiAudio`**: Integração com as vozes de estúdio Gemini configurando modality de AUDIO nativa.
- **`generateOfflineQuiz` / `fetchGeminiQuiz`**: Motores de questionário didático de múltipla escolha para validação de onboarding.
- **`triggerChatResponse`**: Motor de correspondência semântica NLP que localiza FAQs, fluxos operacionais e parágrafos do manual complementar sem consumo de internet ou tokens.
