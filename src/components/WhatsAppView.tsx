import React, { useState } from 'react';
import type { ChatMessage } from '../types';

interface WhatsAppViewProps {}

export const WhatsAppView: React.FC<WhatsAppViewProps> = () => {
  const [activeThread, setActiveThread] = useState<'burger' | 'hype' | 'vitta'>('burger');
  const [messages, setMessages] = useState<Record<'burger' | 'hype' | 'vitta', ChatMessage[]>>({
    burger: [
      { id: '1', text: 'Olá, a arte da promoção de hambúrguer já está pronta?', sender: 'received', timestamp: '09:15' },
      { id: '2', text: 'Olá Carlos! O designer está finalizando a peça.', sender: 'sent', timestamp: '09:20' },
      { id: '3', text: 'Beleza! Assim que estiver me manda aqui para eu dar uma olhada.', sender: 'received', timestamp: '09:22' },
    ],
    hype: [
      { id: '1', text: 'Precisamos ajustar a data de publicação da coleção de inverno.', sender: 'received', timestamp: 'Yesterday' },
      { id: '2', text: 'Tudo bem Juliana, alterei a data no cronograma para o dia 21/06.', sender: 'sent', timestamp: 'Yesterday' },
      { id: '3', text: 'Show! Muito obrigada pela agilidade.', sender: 'received', timestamp: 'Yesterday' },
    ],
    vitta: [
      { id: '1', text: 'O texto do post informativo foi aprovado pelo médico responsável.', sender: 'received', timestamp: '08:40' },
      { id: '2', text: 'Perfeito, Dr. Roberto! Vou encaminhar para a equipe criar o infográfico.', sender: 'sent', timestamp: '08:45' },
    ],
  });

  const [inputVal, setInputVal] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([
    'Olá! Verifiquei aqui e o seu post já está na coluna de Aprovação. Você pode aprovar direto pelo portal!',
    'Olá! A nossa equipe de design já está cuidando da sua peça. Estimamos o envio para as próximas 2 horas.',
    'Excelente! Peça aprovada com sucesso. Já agendamos a publicação para a data programada.'
  ]);

  const [isGeneratingIA, setIsGeneratingIA] = useState(false);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputVal,
      sender: 'sent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages({
      ...messages,
      [activeThread]: [...messages[activeThread], newMessage]
    });
    setInputVal('');
  };

  const handleSelectSuggestion = (text: string) => {
    setInputVal(text);
  };

  const generateNewIASuggestion = () => {
    setIsGeneratingIA(true);
    setTimeout(() => {
      const promptIdeas = [
        'Olá! Já disparamos o lembrete no WhatsApp do cliente com o link do Portal de Aprovação. Agradecemos o contato!',
        'Olá! Analisei seu briefing e incluí os canais sugeridos no Planner. O designer começará a arte em seguida.',
        'Combinado! Registrei sua solicitação de ajuste no Kanban e o time já está retrabalhando na peça. Te aviso em breve.'
      ];
      // pick one
      const random = promptIdeas[Math.floor(Math.random() * promptIdeas.length)];
      setSuggestions([random, ...suggestions.slice(0, 2)]);
      setIsGeneratingIA(false);
    }, 1200);
  };

  const getThreadInfo = () => {
    switch (activeThread) {
      case 'burger': return { name: 'Burger Delight (Carlos)', avatar: 'carlos' };
      case 'hype': return { name: 'Hype Fashion (Juliana)', avatar: 'juliana' };
      case 'vitta': return { name: 'Clinica Vitta (Dr. Roberto)', avatar: 'roberto' };
    }
  };

  const currentThreadInfo = getThreadInfo();

  return (
    <div className="chat-container">
      {/* Threads Sidebar */}
      <div className="chat-sidebar">
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 800, fontSize: '0.82rem' }}>
          Conversas Ativas
        </div>
        <div className="chat-list">
          {[
            { id: 'burger', name: 'Burger Delight', desc: 'Beleza! Assim que estiver...', active: activeThread === 'burger' },
            { id: 'hype', name: 'Hype Fashion', desc: 'Show! Muito obrigada...', active: activeThread === 'hype' },
            { id: 'vitta', name: 'Clinica Vitta', desc: 'Perfeito, Dr. Roberto!', active: activeThread === 'vitta' },
          ].map((thread) => (
            <div
              key={thread.id}
              className={`chat-thread-item ${thread.active ? 'active' : ''}`}
              onClick={() => setActiveThread(thread.id as any)}
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.id === 'burger' ? 'carlos' : thread.id === 'hype' ? 'juliana' : 'roberto'}`}
                alt={thread.name}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>{thread.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{thread.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentThreadInfo.avatar}`}
              alt={currentThreadInfo.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
            />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{currentThreadInfo.name}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--color-success)', fontWeight: 700 }}>
                <i className="fas fa-circle" style={{ fontSize: '0.45rem', marginRight: '4px', verticalAlign: 'middle' }}></i> Online
              </div>
            </div>
          </div>
        </div>

        {/* Message History */}
        <div className="chat-history">
          {messages[activeThread].map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div>{msg.text}</div>
              <div style={{ fontSize: '0.58rem', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: '4px' }}>
                {msg.timestamp}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua resposta operacional..."
          />
          <button className="btn btn-primary" onClick={handleSend} style={{ padding: '10px' }}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* AI Suggestion Panel */}
      <div className="ai-suggestions-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-purple)' }}>
          <i className="fas fa-brain"></i> Sugestões de Resposta IA
        </div>
        <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
          O assistente IA analisa a conversa atual e sugere respostas rápidas e profissionais para o cliente.
        </p>

        <button
          className="btn btn-secondary"
          onClick={generateNewIASuggestion}
          disabled={isGeneratingIA}
          style={{ width: '100%', fontSize: '0.7rem', padding: '6px 8px', justifyContent: 'center', borderColor: 'var(--color-purple)' }}
        >
          {isGeneratingIA ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Gerando...
            </>
          ) : (
            <>
              <i className="fas fa-sync"></i> Recalcular IA
            </>
          )}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="ai-suggestion-box"
              onClick={() => handleSelectSuggestion(sug)}
              title="Clique para usar esta resposta"
            >
              <div>{sug}</div>
              <div style={{ textAlign: 'right', color: 'var(--color-purple)', fontSize: '0.58rem', fontWeight: 800, marginTop: '6px' }}>
                USAR RESPOSTA <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
