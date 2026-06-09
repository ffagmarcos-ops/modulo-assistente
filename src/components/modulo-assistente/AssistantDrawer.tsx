import React, { useState, useEffect, useRef } from 'react';
import defaultGuide from './assistant_guide.json';

// Types for the new rich assistant structure
interface Campo {
  nome: string;
  tipo: string;
  descricao: string;
  exemplo: string;
  obrigatorio: boolean;
}

interface Botao {
  nome: string;
  acao: string;
  descricao: string;
}

interface Tela {
  id: string;
  nome: string;
  descricao: string;
  quando_utilizar: string;
  campos: Campo[];
  botoes: Botao[];
  passos: string[];
  erros_comuns: string[];
}

interface Modulo {
  id: string;
  nome: string;
  descricao: string;
  objetivo: string;
  telas: Tela[];
}

interface Artigo {
  titulo: string;
  categoria: string;
  tags: string[];
  conteudo: string;
}

interface FaqItem {
  pergunta: string;
  resposta: string;
}

interface Etapa {
  ordem: number;
  titulo: string;
  descricao: string;
}

interface Fluxo {
  nome: string;
  etapas: Etapa[];
}

interface Gatilho {
  frase: string;
  intencao: string;
  resposta: string;
}

interface GuideData {
  sistema: string;
  versao: string;
  assistente: {
    nome: string;
    personalidade: string;
    idioma: string;
  };
  modulos?: Modulo[];
  base_conhecimento?: Artigo[];
  faq?: FaqItem[];
  fluxos?: Fluxo[];
  gatilhos?: Gatilho[];
  // Fallback support for the old structure
  nome_sistema?: string;
  descricao?: string;
  passos?: any[];
}

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: string;
  onNavigate?: (module: string) => void;
  guideData?: GuideData | null;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentUserRole = 'superadmin',
  onNavigate,
  guideData,
}) => {
  const guide = (guideData || defaultGuide) as GuideData;
  const isNewStructure = !!guide.sistema;

  // Active Main Tab: 'modulos' | 'artigos' | 'faq' | 'fluxos' | 'chat'
  const [activeMainTab, setActiveMainTab] = useState<string>('modulos');

  // New Structure States
  const [selectedModuloId, setSelectedModuloId] = useState<string>('');
  const [selectedTelaId, setSelectedTelaId] = useState<string>('');
  
  // Articles search
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Artigo | null>(null);

  // Guided Flows
  const [selectedFluxo, setSelectedFluxo] = useState<Fluxo | null>(null);

  // Chat/AI Triggers Mock
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Reset tab-specific selections when guide changes
  useEffect(() => {
    if (guide.modulos && guide.modulos.length > 0) {
      setSelectedModuloId(guide.modulos[0].id);
      if (guide.modulos[0].telas && guide.modulos[0].telas.length > 0) {
        setSelectedTelaId(guide.modulos[0].telas[0].id);
      } else {
        setSelectedTelaId('');
      }
    } else {
      setSelectedModuloId('');
      setSelectedTelaId('');
    }

    // Initialize chat messages
    const assistantName = guide.assistente?.nome || 'Assistente';
    const systemName = guide.sistema || guide.nome_sistema || 'ERP';
    setChatMessages([
      {
        sender: 'assistant',
        text: `Olá! Eu sou o ${assistantName}, seu especialista no ${systemName}. Como posso te ajudar hoje? Você pode me perguntar processos, tirar dúvidas ou pedir instruções de telas!`
      }
    ]);

    setSelectedArticle(null);
    setSelectedFluxo(null);
    setArticleSearch('');
  }, [guideData]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isOpen) return null;

  // Helpers for module & screen selection
  const selectedModulo = guide.modulos?.find(m => m.id === selectedModuloId);
  const selectedTela = selectedModulo?.telas?.find(t => t.id === selectedTelaId);

  // Handle Chat Submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // Process intent trigger
    setTimeout(() => {
      let matchedResponse = `Desculpe, não consegui encontrar uma resposta exata para "${userText}". Tente perguntar com termos como "como cadastrar", "onde vejo" ou utilize nossas abas de FAQ e Fluxos Guiados.`;

      if (guide.gatilhos && guide.gatilhos.length > 0) {
        // Search for a keyword match in triggers
        const queryNormalized = userText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const trigger = guide.gatilhos.find(g => {
          const phraseNorm = g.frase.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          return queryNormalized.includes(phraseNorm) || phraseNorm.includes(queryNormalized);
        });

        if (trigger) {
          matchedResponse = trigger.resposta;
        } else {
          // Check in FAQ questions too
          const faqMatch = guide.faq?.find(f => {
            const questionNorm = f.pergunta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            return queryNormalized.includes(questionNorm) || questionNorm.includes(queryNormalized);
          });
          if (faqMatch) {
            matchedResponse = faqMatch.resposta;
          }
        }
      }

      setChatMessages(prev => [...prev, { sender: 'assistant', text: matchedResponse }]);
    }, 800);
  };

  // Styles
  const drawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '450px',
    backgroundColor: '#111115',
    borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#ffffff',
    animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
  };

  const headerStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#17171e'
  };

  const navGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '4px',
    padding: '10px',
    backgroundColor: '#17171e',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const footerStyle: React.CSSProperties = {
    padding: '12px 20px',
    backgroundColor: '#17171e',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.4)'
  };

  // Filtered Articles
  const filteredArticles = guide.base_conhecimento?.filter(art => 
    art.titulo.toLowerCase().includes(articleSearch.toLowerCase()) ||
    art.categoria.toLowerCase().includes(articleSearch.toLowerCase()) ||
    art.tags.some(tag => tag.toLowerCase().includes(articleSearch.toLowerCase()))
  ) || [];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />

      <div style={drawerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#8338ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(131, 56, 236, 0.4)'
            }}>
              <i className="fas fa-brain" style={{ color: '#fff', fontSize: '0.9rem' }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>
                {guide.sistema || guide.nome_sistema} Assistant
              </h3>
              <span style={{ fontSize: '0.65rem', color: '#8b8e99' }}>
                Powered by {guide.assistente?.nome || 'Keystone AI'} (v{guide.versao || '1.0'})
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#8b8e99', fontSize: '1.1rem', cursor: 'pointer', outline: 'none' }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Navigation Tabs */}
        {isNewStructure && (
          <div style={navGridStyle}>
            {[
              { id: 'modulos', label: 'Telas', icon: 'fa-desktop' },
              { id: 'fluxos', label: 'Fluxos', icon: 'fa-project-diagram' },
              { id: 'artigos', label: 'Artigos', icon: 'fa-book-open' },
              { id: 'faq', label: 'Dúvidas', icon: 'fa-question-circle' },
              { id: 'chat', label: 'Chat IA', icon: 'fa-comments' },
            ].map((tab) => {
              const isActive = activeMainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMainTab(tab.id)}
                  style={{
                    backgroundColor: isActive ? 'rgba(131, 56, 236, 0.15)' : 'transparent',
                    border: 'none',
                    color: isActive ? '#a16cff' : '#8b8e99',
                    padding: '8px 2px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <i className={`fas ${tab.icon}`} style={{ fontSize: '0.8rem' }}></i>
                  <span style={{ fontSize: '0.58rem', fontWeight: 700 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Area */}
        <div style={contentStyle}>
          {activeMainTab === 'modulos' && guide.modulos ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.62rem', color: '#8b8e99', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Módulo</label>
                  <select
                    value={selectedModuloId}
                    onChange={(e) => {
                      setSelectedModuloId(e.target.value);
                      const mod = guide.modulos?.find(m => m.id === e.target.value);
                      if (mod?.telas && mod.telas.length > 0) {
                        setSelectedTelaId(mod.telas[0].id);
                      } else {
                        setSelectedTelaId('');
                      }
                    }}
                    style={{ width: '100%', padding: '6px', backgroundColor: '#1b1b22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', outline: 'none' }}
                  >
                    {guide.modulos.map(m => (
                      <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.62rem', color: '#8b8e99', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Tela</label>
                  <select
                    value={selectedTelaId}
                    onChange={(e) => setSelectedTelaId(e.target.value)}
                    style={{ width: '100%', padding: '6px', backgroundColor: '#1b1b22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', outline: 'none' }}
                    disabled={!selectedModulo || !selectedModulo.telas || selectedModulo.telas.length === 0}
                  >
                    {selectedModulo?.telas?.map(t => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    )) || <option value="">Sem telas</option>}
                  </select>
                </div>
              </div>

              {/* Screen Help Content */}
              {selectedTela ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>{selectedTela.nome}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#b5b5b9', lineHeight: '1.4', margin: 0 }}>{selectedTela.descricao}</p>
                    {selectedTela.quando_utilizar && (
                      <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#a16cff', fontStyle: 'italic' }}>
                        <strong>Quando usar:</strong> {selectedTela.quando_utilizar}
                      </div>
                    )}
                  </div>

                  {/* Fields */}
                  {selectedTela.campos && selectedTela.campos.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#8b8e99', marginBottom: '8px' }}>
                        <i className="fas fa-keyboard" style={{ marginRight: '6px' }}></i> Campos
                      </h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedTela.campos.map((field, idx) => (
                          <div key={idx} style={{ padding: '10px', backgroundColor: '#17171e', borderRadius: '6px', borderLeft: field.obrigatorio ? '3px solid #ef4444' : '3px solid #3a86ff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                              <span>{field.nome}</span>
                              <span style={{ fontSize: '0.62rem', color: '#8b8e99', fontWeight: 500 }}>{field.tipo} {field.obrigatorio ? '(Obrigatório)' : ''}</span>
                            </div>
                            <p style={{ fontSize: '0.7rem', color: '#b5b5b9', margin: '4px 0 0 0', lineHeight: '1.3' }}>{field.descricao}</p>
                            {field.exemplo && (
                              <div style={{ fontSize: '0.65rem', color: '#8b8e99', marginTop: '4px' }}>
                                <strong>Exemplo:</strong> {field.exemplo}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  {selectedTela.botoes && selectedTela.botoes.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#8b8e99', marginBottom: '8px' }}>
                        <i className="fas fa-mouse-pointer" style={{ marginRight: '6px' }}></i> Botões & Ações
                      </h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedTela.botoes.map((btn, idx) => (
                          <div key={idx} style={{ padding: '8px 10px', backgroundColor: '#17171e', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                            <div>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>{btn.nome}</span>
                              <p style={{ fontSize: '0.68rem', color: '#b5b5b9', margin: '2px 0 0 0' }}>{btn.descricao}</p>
                            </div>
                            <code style={{ fontSize: '0.6rem', color: '#a16cff', backgroundColor: 'rgba(131,56,236,0.1)', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start' }}>{btn.acao}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Steps */}
                  {selectedTela.passos && selectedTela.passos.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#8b8e99', marginBottom: '8px' }}>
                        <i className="fas fa-list-ol" style={{ marginRight: '6px' }}></i> Instruções de Uso
                      </h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {selectedTela.passos.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', lineHeight: '1.4' }}>
                            <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(131, 56, 236, 0.15)', color: '#a16cff', display: 'flex', alignItems: 'center', fontSize: '0.62rem', fontWeight: 700, flexShrink: 0, justifyContent: 'center', marginTop: '2px' }}>{idx + 1}</span>
                            <span style={{ color: '#e5e7eb' }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Errors */}
                  {selectedTela.erros_comuns && selectedTela.erros_comuns.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#8b8e99', marginBottom: '8px' }}>
                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '6px' }}></i> Evitar Erros Comuns
                      </h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedTela.erros_comuns.map((err, idx) => (
                          <div key={idx} style={{ padding: '8px 10px', backgroundColor: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '6px', color: '#ef4444', fontSize: '0.7rem', lineHeight: '1.4' }}>
                            <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i> {err}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: '#666', fontSize: '0.75rem' }}>
                  Selecione um módulo e uma tela para ver a ajuda.
                </div>
              )}
            </div>
          ) : activeMainTab === 'fluxos' && guide.fluxos ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {selectedFluxo ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <button
                    onClick={() => setSelectedFluxo(null)}
                    style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#a16cff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', outline: 'none', padding: 0 }}
                  >
                    <i className="fas fa-arrow-left" style={{ marginRight: '4px' }}></i> Voltar para Processos
                  </button>

                  <div style={{ padding: '12px', backgroundColor: 'rgba(131,56,236,0.05)', border: '1px solid rgba(131,56,236,0.15)', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-project-diagram" style={{ color: '#a16cff' }}></i> {selectedFluxo.nome}
                    </h4>
                    <span style={{ fontSize: '0.62rem', color: '#b5b5b9' }}>Siga o passo a passo para executar este processo no sistema</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', paddingLeft: '20px' }}>
                    {/* Visual timeline line */}
                    <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'rgba(255,255,255,0.05)' }} />

                    {selectedFluxo.etapas.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                        {/* Dot */}
                        <div style={{
                          position: 'absolute',
                          left: '-20px',
                          top: '2px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#111115',
                          border: '2px solid #a16cff',
                          color: '#a16cff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.55rem',
                          fontWeight: 800
                        }}>
                          {step.ordem}
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>{step.titulo}</span>
                          <p style={{ fontSize: '0.7rem', color: '#b5b5b9', margin: '4px 0 0 0', lineHeight: '1.4' }}>{step.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#8b8e99', marginBottom: '12px' }}>
                    Processos Disponíveis
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {guide.fluxos.map((fluxo, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedFluxo(fluxo)}
                        style={{
                          padding: '12px',
                          backgroundColor: '#17171e',
                          border: '1px solid rgba(255,255,255,0.04)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        className="animate-hover"
                      >
                        <div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{fluxo.nome}</span>
                          <span style={{ display: 'block', fontSize: '0.62rem', color: '#8b8e99', marginTop: '2px' }}>
                            {fluxo.etapas.length} etapas guiadas
                          </span>
                        </div>
                        <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', color: '#8b8e99' }}></i>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : activeMainTab === 'artigos' && guide.base_conhecimento ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {selectedArticle ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#a16cff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', outline: 'none', padding: 0 }}
                  >
                    <i className="fas fa-arrow-left" style={{ marginRight: '4px' }}></i> Voltar para Artigos
                  </button>

                  <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.62rem', color: '#a16cff', fontWeight: 800, textTransform: 'uppercase' }}>
                      {selectedArticle.categoria}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '4px 0 8px 0' }}>{selectedArticle.titulo}</h4>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {selectedArticle.tags.map((tag, idx) => (
                        <span key={idx} style={{ fontSize: '0.55rem', backgroundColor: 'rgba(255,255,255,0.05)', color: '#b5b5b9', padding: '2px 6px', borderRadius: '4px' }}>#{tag}</span>
                      ))}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#e5e7eb', lineHeight: '1.5', whiteSpace: 'pre-line', margin: 0 }}>
                    {selectedArticle.conteudo}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Search bar */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Pesquisar artigos da base..."
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px 8px 30px', backgroundColor: '#1b1b22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', outline: 'none' }}
                    />
                    <i className="fas fa-search" style={{ position: 'absolute', left: '10px', top: '9px', fontSize: '0.7rem', color: '#666' }}></i>
                  </div>

                  {/* Articles Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filteredArticles.map((art, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedArticle(art)}
                        style={{
                          padding: '12px',
                          backgroundColor: '#17171e',
                          border: '1px solid rgba(255,255,255,0.04)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '0.58rem', color: '#a16cff', fontWeight: 800, textTransform: 'uppercase' }}>{art.categoria}</span>
                        <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', margin: '2px 0 4px 0' }}>{art.titulo}</h4>
                        <p style={{ fontSize: '0.68rem', color: '#8b8e99', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', margin: 0 }}>
                          {art.conteudo}
                        </p>
                      </div>
                    ))}

                    {filteredArticles.length === 0 && (
                      <div style={{ padding: '30px', textAlign: 'center', color: '#666', fontSize: '0.72rem' }}>
                        Nenhum artigo encontrado.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : activeMainTab === 'faq' && guide.faq ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#8b8e99', marginBottom: '8px' }}>
                Perguntas Frequentes
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {guide.faq.map((faq, idx) => (
                  <details
                    key={idx}
                    style={{
                      backgroundColor: '#17171e',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <summary style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', outline: 'none' }}>
                      <span>{faq.pergunta}</span>
                      <i className="fas fa-chevron-down" style={{ fontSize: '0.62rem', color: '#8b8e99' }}></i>
                    </summary>
                    <p style={{ fontSize: '0.72rem', color: '#b5b5b9', lineHeight: '1.4', margin: '8px 0 0 0', cursor: 'default' }}>
                      {faq.resposta}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ) : activeMainTab === 'chat' ? (
            /* Chatbot interface */
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 170px)' }}>
              {/* Message thread */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '12px' }}>
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      backgroundColor: msg.sender === 'user' ? '#8338ec' : '#17171e',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                      borderBottomLeftRadius: msg.sender === 'assistant' ? '2px' : '12px',
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                      maxWidth: '85%'
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                <input
                  type="text"
                  placeholder="Pergunte ao especialista..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', backgroundColor: '#1b1b22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ padding: '8px 12px', backgroundColor: '#8338ec', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(guide.passos || [])
                .filter((p: any) => p.roles?.includes(currentUserRole))
                .map((step: any, idx: number) => (
                  <div key={idx} style={{ padding: '12px', backgroundColor: '#17171e', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className={`fas ${step.icon || 'fa-info-circle'}`} style={{ color: '#8338ec' }}></i>
                      {step.titulo}
                    </h4>
                    <ul style={{ paddingLeft: '16px', margin: '8px 0 0 0', fontSize: '0.72rem', color: '#b5b5b9', lineHeight: '1.4' }}>
                      {step.instrucoes?.map((ins: string, i: number) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{ins}</li>
                      ))}
                    </ul>
                    {onNavigate && (
                      <button
                        onClick={() => {
                          onNavigate(step.modulo);
                          onClose();
                        }}
                        style={{ marginTop: '10px', width: '100%', padding: '6px', backgroundColor: 'rgba(131,56,236,0.1)', border: '1px solid #8338ec', borderRadius: '4px', color: '#a16cff', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Acessar Módulo
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <span>Keystone AI • Ajuda Contextual</span>
          <span>Versão {guide.versao || '1.0'}</span>
        </div>
      </div>
    </>
  );
};
