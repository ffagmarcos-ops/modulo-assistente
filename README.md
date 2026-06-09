# 🎙️ Módulo Assistente Virtual & Onboarding Explicativo

Este projeto é um portal inteligente para **rastreamento, geração de manuais didáticos e criação de assistentes de onboarding** para sistemas web (ERPs, CRMs, etc.). Ele simula o crawler de um sistema e compila um manual completo em formato JSON contendo módulos, fluxos de trabalho, base de conhecimento e gatilhos semânticos de linguagem natural (NLP).

O portal inclui um **Chat Explicativo** e um **Player de Podcast (Diálogo Falado)** integrado com as vozes ultra-realistas do **Google AI Studio**, permitindo também a exportação de um widget flutuante HTML 100% autossuficiente e offline.

---

## 📂 Estrutura de Pastas e Arquivos

O projeto segue a estrutura padrão de uma aplicação React moderna construída com Vite e TypeScript:

```bash
modulo-assistente/
├── public/                 # Recursos estáticos acessíveis diretamente pela aplicação
│   ├── male_avatar.png     # Retrato realista do assistente Lucas (Masc)
│   ├── female_avatar.png   # Retrato realista da assistente Sofia (Fem)
│   └── favicon.svg         # Ícone da aba do navegador
├── src/
│   ├── assets/             # Ativos e imagens consumidos pelo React
│   ├── components/         # Componentes organizados do Portal
│   │   ├── ScannerConsole.tsx     # Terminal animado que simula a varredura (Crawler)
│   │   └── modulo-assistente/     # Widget embarcado reusável
│   │       ├── AssistantDrawer.tsx # Drawer flutuante do assistente
│   │       └── assistant_guide.json # Base de conhecimento gerada para o ERP
│   ├── App.tsx             # Arquivo central da aplicação (Configurador, Chat, Podcast, Exportador)
│   ├── index.css           # Estilização global com design system premium dark/glassmorphic
│   ├── main.tsx            # Ponto de entrada da renderização React
│   └── types.ts            # Tipagens compartilhadas do TypeScript
├── scratch/                # Pasta local (ignorada pelo Git) para scripts auxiliares
│   └── push_to_github.js   # Script CLI automatizado para criação e push do repositório
├── eslint.config.js        # Configuração de linting e regras de qualidade de código
├── tsconfig.json           # Configurações gerais do TypeScript
├── vite.config.ts          # Arquivo de configuração de compilação do Vite
└── README.md               # Este arquivo (Manual Geral do Leitor)
```

---

## 🛠️ Tecnologias Utilizadas

1. **Frontend**: React (v19) com TypeScript (v5) e Vite.
2. **Estilização**: Vanilla CSS com design responsivo, Glassmorphism, Neon Glows e animações de onda sonora.
3. **Áudio & Voz (TTS)**:
   - **Online**: API do Google AI Studio (Gemini 1.5 Flash) via requisições HTTP POST com retorno do tipo `AUDIO` (Vozes Puck e Aoede).
   - **Offline (Fallback)**: API de Síntese de Voz Nativa do Navegador (`SpeechSynthesis`) filtrando vozes masculinas e femininas de português.
4. **Armazenamento**: `localStorage` do navegador para guardar de forma segura a chave de API do Gemini.
5. **Automação Git**: GitHub CLI (`gh`) via scripts NodeJS.

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
Para compilar o código em arquivos HTML, CSS e JS altamente otimizados e prontos para distribuição:
```bash
npm run build
```
O resultado será salvo na pasta `dist/`.

---

## 🎙️ Como Configurar a Voz Ultra-Realista (Google AI Studio)

1. Vá para o portal [Google AI Studio](https://aistudio.google.com/) e obtenha uma chave de API gratuita.
2. Acesse a aplicação local em seu navegador.
3. Rastreie qualquer link (ou use o link de teste padrão) para liberar o assistente.
4. Na barra lateral esquerda, insira sua chave no campo **"Voz Realista Google AI Studio (Gemini)"**.
5. Vá na aba **"Diálogo Falado"**, escolha um módulo e clique em **"Gerar Diálogo Didático"**.
6. Clique no botão de Play e escute o diálogo ultra-realista entre Lucas (Puck) e Sofia (Aoede).

---

## 💬 Exportação do Chat Flutuante (Widget)

O portal permite baixar um arquivo autossuficiente chamado `[nome_do_sistema]_widget.html`:
- Contém a base de conhecimento gerada inteira embutida em formato de string JSON.
- Fornece um chat flutuante completo com inteligência artificial local de correspondência de gatilhos (NLP local sem consumo de tokens).
- Oferece suporte nativo de áudio gratuito utilizando a síntese do próprio navegador, de acordo com o avatar selecionado (Lucas ou Sofia).

---

## ✍️ Guia de Orientações no Código (`App.tsx`)

Ao abrir o arquivo `src/App.tsx`, você encontrará orientações comentadas sobre:
- **`generateErpJson`**: Função programática que monta a árvore JSON de conhecimento (módulos, FAQs, gatilhos, etc.).
- **`fetchGeminiAudio`**: Função que faz o payload com `responseModalities: ["AUDIO"]` e seleciona as vozes nativas de estúdio.
- **`playDialogueLine`**: Sequenciador que sincroniza a troca de turnos e faz o pré-carregamento dos buffers de áudio.
- **`fallbackToBrowserSpeech`**: Motor resiliente local que garante acessibilidade e evita interrupções se a internet falhar.
