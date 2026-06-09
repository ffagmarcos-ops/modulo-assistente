import React, { useState, useEffect, useRef } from 'react';

interface ScannerConsoleProps {
  url: string;
  isScanning: boolean;
  onScanComplete: () => void;
}

export const ScannerConsole: React.FC<ScannerConsoleProps> = ({
  url,
  isScanning,
  onScanComplete,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const logSequence = [
    { text: `[SYSTEM] Inicializando mecanismo de varredura heurística...`, delay: 200 },
    { text: `[HTTP] Estabelecendo conexão segura com: ${url || 'link-desconhecido'}...`, delay: 600 },
    { text: `[HTTP] Conexão bem-sucedida! HTTP 200 OK. Resposta compactada gzip recebida.`, delay: 500 },
    { text: `[DOM] Mapeando topologia da aplicação. Identificando contêineres e sidebars...`, delay: 800 },
    { text: `[DOM] Encontradas 23 rotas lógicas correspondentes aos módulos do sistema.`, delay: 600 },
    { text: `[DOM] Rastreando tela "Dashboard" (ID: dashboard). Mapeados 4 cards e 2 gráficos SVG.`, delay: 400 },
    { text: `[DOM] Rastreando tela "Clientes" (ID: clientes). Encontrados 5 inputs e botões [Salvar, Novo, Excluir].`, delay: 500 },
    { text: `[DOM] Rastreando tela "Produtos" (ID: produtos). Encontrados 6 inputs e botões [Cadastrar, Imprimir].`, delay: 400 },
    { text: `[DOM] Rastreando tela "Vendas" (ID: vendas). Encontrados 8 inputs e botões [Finalizar, Cancelar].`, delay: 500 },
    { text: `[DOM] Rastreando tela "Fiscal" (ID: fiscal). Encontrados 4 inputs de impostos e botões [Emitir NFe].`, delay: 400 },
    { text: `[DOM] Rastreando tela "CRM" (ID: crm). Encontrados 5 inputs de leads e botões [Cadastrar Contato].`, delay: 400 },
    { text: `[IA Core] Analisando terminologias de negócios e processos operacionais do ERP...`, delay: 800 },
    { text: `[IA Core] Gerando 500 artigos detalhados para a Base de Conhecimento da plataforma...`, delay: 1000 },
    { text: `[IA Core] Formulando 300 perguntas frequentes (FAQs) contextuais baseadas em telas...`, delay: 900 },
    { text: `[IA Core] Mapeando 1000+ gatilhos de intenção natural (NLP Matcher) com variações...`, delay: 1200 },
    { text: `[SUCCESS] Arquivo de ajuda assistant_guide.json estruturado e validado com sucesso!`, delay: 500 },
  ];

  useEffect(() => {
    if (!isScanning) {
      setLogs([]);
      setProgress(0);
      return;
    }

    setLogs([`[SYSTEM] Iniciando scanner de links na URL: ${url}`]);
    let currentLogIndex = 0;
    let currentProgress = 0;

    const executeNextLog = () => {
      if (currentLogIndex >= logSequence.length) {
        setProgress(100);
        setTimeout(() => {
          onScanComplete();
        }, 500);
        return;
      }

      const log = logSequence[currentLogIndex];
      setTimeout(() => {
        setLogs(prev => [...prev, log.text]);
        currentLogIndex++;
        
        // Update progress bar proportionally
        currentProgress = Math.floor((currentLogIndex / logSequence.length) * 100);
        setProgress(currentProgress);

        executeNextLog();
      }, log.delay);
    };

    executeNextLog();
  }, [isScanning]);

  // Scroll to console bottom on new log
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isScanning) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        padding: '30px',
        border: '1px dashed var(--border-color)',
        borderRadius: '10px'
      }}>
        <i className="fas fa-network-wired" style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.06)', marginBottom: '16px' }}></i>
        <h4 style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '6px' }}>Mecanismo de Scanner Pronto</h4>
        <p style={{ fontSize: '0.72rem', maxWidth: '300px', lineHeight: '1.4' }}>
          Insira um link no campo acima e clique em "Escanear Sistema" para iniciar o mapeamento e gerar o arquivo JSON de ajuda.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0a0a0c',
      border: '1px solid rgba(131,56,236,0.25)',
      borderRadius: '10px',
      padding: '16px',
      fontFamily: 'monospace',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
    }}>
      {/* Terminal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
        </div>
        <span style={{ fontSize: '0.62rem', color: '#8338ec', fontWeight: 800 }}>IA SCANNER TERMINAL v1.0.4</span>
      </div>

      {/* Console logs output */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: '280px',
        fontSize: '0.68rem',
        color: '#10b981',
        lineHeight: '1.5',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        paddingRight: '6px'
      }}>
        {logs.map((log, idx) => {
          let color = '#10b981'; // Default green
          if (log.startsWith('[SYSTEM]')) color = '#3a86ff'; // Blue
          if (log.startsWith('[HTTP]')) color = '#9ca3af'; // Gray
          if (log.startsWith('[IA Core]')) color = '#8338ec'; // Purple
          if (log.startsWith('[SUCCESS]')) color = '#10b981'; // Bright green

          return (
            <div key={idx} style={{ color }}>
              {log}
            </div>
          );
        })}
        <div ref={consoleEndRef} />
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#b5b5b9', marginBottom: '4px' }}>
          <span>Progresso de Mapeamento</span>
          <span>{progress}%</span>
        </div>
        <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#8338ec', borderRadius: '3px', boxShadow: '0 0 10px rgba(131,56,236,0.5)', transition: 'width 0.2s ease' }}></div>
        </div>
      </div>
    </div>
  );
};
