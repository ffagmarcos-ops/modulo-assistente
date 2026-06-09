# Módulo Assistente Virtual (Guia de Ajuda) Decoplado

Este módulo contém um componente de ajuda lateral (Drawer) totalmente isolado, desenvolvido em **React** com **TypeScript**. Ele foi desenhado para ser integrado facilmente em qualquer outro projeto web (usando frameworks modernos como Vite, Next.js, etc.).

## 📁 Estrutura do Módulo

O módulo é composto por apenas 3 arquivos fundamentais:

1. `AssistantDrawer.tsx`: O componente React contendo a interface do drawer de ajuda, com estilos embutidos (*inline styles*) para garantir isolamento estético completo em qualquer projeto, livre de conflitos com frameworks de CSS (como TailwindCSS ou Bootstrap).
2. `assistant_guide.json`: Arquivo de configuração que mapeia todos os módulos do sistema, títulos, ícones do FontAwesome, perfis de usuários permitidos e as instruções passo a passo.
3. `README.md`: Este manual explicativo de integração.

---

## 🛠️ Pré-requisitos

Para que o componente funcione perfeitamente, garanta que seu projeto destino possua instalado:
* **React** (v17 ou superior)
* **FontAwesome** (v6 ou superior - adicionado globalmente no seu `index.html` ou importado no projeto para renderizar os ícones do menu lateral). Exemplo de CDN para o `index.html`:
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  ```

---

## 🚀 Como Integrar em outro Projeto

### Passo 1: Copiar a pasta do módulo
Copie a pasta inteira `modulo-assistente` para dentro do diretório de componentes do seu novo projeto (por exemplo, `src/components/modulo-assistente`).

### Passo 2: Importar e Usar o Componente
No arquivo de layout ou na página principal onde você deseja que o assistente seja carregado, monte o componente passando as propriedades necessárias:

```tsx
import React, { useState } from 'react';
import { AssistantDrawer } from './components/modulo-assistente/AssistantDrawer';

function App() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Exemplo de papel do usuário logado (pode vir de um contexto de Auth)
  const userRole = 'gestor'; 

  // Função para navegar entre os módulos quando o usuário clica no CTA "Acessar Módulo"
  const handleNavigation = (modulo: string) => {
    console.log(`Navegando para o módulo: ${modulo}`);
    setCurrentView(modulo); // Altera o estado de rota/view interna do seu app
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Minha Aplicação Principal</h1>
      
      {/* Botão para abrir o assistente */}
      <button 
        onClick={() => setIsAssistantOpen(true)}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        <i className="fas fa-question-circle"></i> Abrir Assistente
      </button>

      {/* Renderização do Drawer do Assistente */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentUserRole={userRole}
        onNavigate={handleNavigation}
      />
    </div>
  );
}

export default App;
```

---

## ⚙️ Entendendo e Customizando o Guia (`assistant_guide.json`)

O arquivo `assistant_guide.json` funciona como o banco de dados dinâmico de ajuda do sistema. Sua estrutura permite alterar os fluxos, adicionar passos ou traduzir termos sem precisar alterar uma linha de código React.

### Estrutura do arquivo JSON:

```json
{
  "nome_sistema": "Nome da Sua Plataforma",
  "descricao": "Texto de introdução exibido no topo do assistente.",
  "passos": [
    {
      "modulo": "chave_identificadora_do_modulo",
      "titulo": "Título Completo do Módulo",
      "icon": "classe-do-fontawesome-para-o-icone",
      "roles": ["roles", "que", "podem", "ver", "este", "passo"],
      "instrucoes": [
        "Passo 1 de instrução detalhada para o usuário.",
        "Passo 2 de instrução detalhada para o usuário.",
        "Passo 3 de instrução detalhada para o usuário."
      ]
    }
  ]
}
```

### 💡 Dicas de Aplicação em Projetos Futuros:
* **Filtro por Perfis (Roles):** Se um módulo do seu app é visível apenas para administradores, coloque `"roles": ["admin"]`. O componente filtrará automaticamente e apenas usuários com esse perfil visualizarão o respectivo card de ajuda.
* **Flexibilidade de Navegação:** O callback `onNavigate` repassa a chave do `modulo` quando clicado. Isso significa que você pode mapear qualquer rotina de troca de tela (como React Router `navigate('/caminho')` ou alteração de abas de estado).
* **Manutenção Limpa:** Se você adicionar uma nova tela no futuro, basta criar uma nova entrada na lista de `"passos"` do JSON com as respectivas instruções. O menu de navegação e os cards serão desenhados automaticamente!
