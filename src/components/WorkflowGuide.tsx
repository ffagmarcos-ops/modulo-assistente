import React, { useState } from 'react';

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
  quando_utilizar?: string;
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

interface Etapa {
  ordem: number;
  titulo: string;
  descricao: string;
}

interface Fluxo {
  nome: string;
  etapas: Etapa[];
}

interface WorkflowGuideProps {
  guideData: {
    sistema: string;
    modulos?: Modulo[];
    fluxos?: Fluxo[];
  };
  onTestInSimulator: (moduloId: string) => void;
  activeModuloId: string;
  setActiveModuloId: (moduloId: string) => void;
}

export const WorkflowGuide: React.FC<WorkflowGuideProps> = ({
  guideData,
  onTestInSimulator,
  activeModuloId,
  setActiveModuloId,
}) => {
  const modulos = guideData.modulos || [];
  const fluxos = guideData.fluxos || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'recursos' | 'passo_a_passo'>('passo_a_passo');
  
  // Track active step for the current module's stepper
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  // Filter modules by search
  const filteredModulos = modulos.filter((m) =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Active module selection
  const currentModulo = modulos.find((m) => m.id === activeModuloId) || modulos[0];

  // When changing module, reset stepper index
  const handleSelectModule = (id: string) => {
    setActiveModuloId(id);
    setActiveStepIdx(0);
  };

  // Find a specific guided flow for this module, or construct a generic one from steps
  const getWorkflowSteps = (): Etapa[] => {
    if (!currentModulo) return [];

    // Try to find matching flow in the guide data
    const matchedFlow = fluxos.find((f) =>
      f.nome.toLowerCase().includes(currentModulo.nome.toLowerCase()) ||
      currentModulo.nome.toLowerCase().includes(f.nome.toLowerCase())
    );

    if (matchedFlow) {
      return matchedFlow.etapas;
    }

    // Fallback: Build stepper steps using screens passos
    const mainTela = currentModulo.telas?.[0];
    if (mainTela && mainTela.passos && mainTela.passos.length > 0) {
      return mainTela.passos.map((passo, idx) => ({
        ordem: idx + 1,
        titulo: passo.split('.')[0] || `Etapa ${idx + 1}`,
        descricao: passo,
      }));
    }

    // Secondary fallback if no steps defined
    return [
      { ordem: 1, titulo: `Acessar ${currentModulo.nome}`, descricao: `Abra a tela de ${currentModulo.nome.toLowerCase()} no menu lateral do sistema.` },
      { ordem: 2, titulo: "Visualizar Informações", descricao: "Confira a listagem de registros e relatórios consolidados do painel." },
      { ordem: 3, titulo: "Efetuar Operações", descricao: "Utilize os botões de ação e preencha os formulários correspondentes." },
    ];
  };

  const steps = getWorkflowSteps();
  const currentStep = steps[activeStepIdx] || steps[0];

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      backgroundColor: '#0c0c0f',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    }}>
      {/* Sidebar: Module selection */}
      <div style={{
        width: '180px',
        backgroundColor: '#111115',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 8px',
        gap: '8px'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar módulo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px 6px 24px',
              fontSize: '0.68rem',
              backgroundColor: '#07070a',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: '#fff',
              outline: 'none'
            }}
          />
          <i className="fas fa-search" style={{ position: 'absolute', left: '8px', top: '7px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}></i>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '2px' }}>
          {filteredModulos.map((m) => {
            const isSelected = m.id === activeModuloId;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectModule(m.id)}
                style={{
                  padding: '8px 10px',
                  backgroundColor: isSelected ? 'rgba(131, 56, 236, 0.12)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: isSelected ? '#a16cff' : 'rgba(255,255,255,0.4)',
                  fontSize: '0.7rem',
                  fontWeight: isSelected ? 800 : 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <i className="fas fa-cube" style={{ fontSize: '0.55rem', opacity: isSelected ? 1 : 0.4 }}></i>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.nome}</span>
              </button>
            );
          })}
          {filteredModulos.length === 0 && (
            <span style={{ fontSize: '0.62rem', color: '#444', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>Nenhum módulo.</span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {currentModulo ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#07070a' }}>
          
          {/* Header */}
          <div style={{
            padding: '16px',
            backgroundColor: '#111115',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.6rem', color: '#8338ec', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Módulo Operacional</span>
              <button
                onClick={() => onTestInSimulator(currentModulo.id)}
                style={{
                  backgroundColor: 'rgba(131,56,236,0.15)',
                  border: '1px solid #8338ec',
                  color: '#a16cff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fas fa-desktop"></i> Testar no Simulador
              </button>
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', margin: 0 }}>{currentModulo.nome}</h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
              {currentModulo.descricao}
            </p>
            <div style={{
              marginTop: '6px',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255,255,255,0.01)',
              padding: '6px 8px',
              borderRadius: '4px',
              borderLeft: '2px solid #8338ec'
            }}>
              <strong>Objetivo principal:</strong> {currentModulo.objetivo}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: '#111115',
            padding: '0 16px'
          }}>
            <button
              onClick={() => setSelectedTab('passo_a_passo')}
              style={{
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                borderBottom: selectedTab === 'passo_a_passo' ? '2px solid #8338ec' : '2px solid transparent',
                color: selectedTab === 'passo_a_passo' ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fas fa-list-ol" style={{ marginRight: '6px' }}></i> Assistente de Fluxo
            </button>
            <button
              onClick={() => setSelectedTab('recursos')}
              style={{
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                borderBottom: selectedTab === 'recursos' ? '2px solid #8338ec' : '2px solid transparent',
                color: selectedTab === 'recursos' ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fas fa-keyboard" style={{ marginRight: '6px' }}></i> Recursos e Campos
            </button>
          </div>

          {/* Tab Content Panel */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
            {selectedTab === 'passo_a_passo' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Stepper visual progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${((activeStepIdx + 1) / steps.length) * 100}%`,
                      height: '100%',
                      backgroundColor: '#8338ec',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                    {activeStepIdx + 1} de {steps.length}
                  </span>
                </div>

                {/* Highlighted current step card */}
                {currentStep && (
                  <div style={{
                    backgroundColor: '#111115',
                    border: '1px solid rgba(131,56,236,0.15)',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#8338ec',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.68rem',
                        fontWeight: 900
                      }}>
                        {currentStep.ordem}
                      </span>
                      <strong style={{ fontSize: '0.8rem', color: '#fff' }}>{currentStep.titulo}</strong>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#e5e7eb', margin: 0, lineHeight: '1.4' }}>
                      {currentStep.descricao}
                    </p>

                    {/* Show dynamic tip depending on the step context */}
                    {currentModulo.telas?.[0]?.erros_comuns && currentModulo.telas[0].erros_comuns.length > 0 && activeStepIdx === steps.length - 1 && (
                      <div style={{
                        marginTop: '4px',
                        backgroundColor: 'rgba(239, 68, 68, 0.03)',
                        border: '1px solid rgba(239, 68, 68, 0.1)',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        color: '#ef4444'
                      }}>
                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '6px' }}></i>
                        <strong>Erro Comum a Evitar:</strong> {currentModulo.telas[0].erros_comuns[0]}
                      </div>
                    )}
                  </div>
                )}

                {/* Stepper actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
                    disabled={activeStepIdx === 0}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: activeStepIdx === 0 ? 'rgba(255,255,255,0.1)' : '#fff',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: activeStepIdx === 0 ? 'default' : 'pointer',
                      outline: 'none'
                    }}
                  >
                    <i className="fas fa-chevron-left" style={{ marginRight: '4px' }}></i> Passo Anterior
                  </button>

                  <button
                    onClick={() => setActiveStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
                    disabled={activeStepIdx === steps.length - 1}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: activeStepIdx === steps.length - 1 ? 'rgba(255,255,255,0.02)' : '#8338ec',
                      border: 'none',
                      color: activeStepIdx === steps.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: activeStepIdx === steps.length - 1 ? 'default' : 'pointer',
                      outline: 'none'
                    }}
                  >
                    Próximo Passo <i className="fas fa-chevron-right" style={{ marginLeft: '4px' }}></i>
                  </button>
                </div>

                {/* Step list for preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.62rem', color: '#8b8e99', textTransform: 'uppercase', fontWeight: 800 }}>Etapas de Fluxo de Trabalho</span>
                  {steps.map((s, idx) => {
                    const isPassed = idx < activeStepIdx;
                    const isCurrent = idx === activeStepIdx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveStepIdx(idx)}
                        style={{
                          padding: '10px',
                          backgroundColor: isCurrent ? 'rgba(131,56,236,0.03)' : '#111115',
                          border: isCurrent ? '1px solid #8338ec' : '1px solid rgba(255,255,255,0.03)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          opacity: isCurrent || isPassed ? 1 : 0.5
                        }}
                      >
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: isPassed ? '#10b981' : isCurrent ? '#8338ec' : '#333',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.5rem',
                          fontWeight: 900
                        }}>
                          {isPassed ? <i className="fas fa-check" style={{ fontSize: '0.45rem' }}></i> : s.ordem}
                        </div>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: isCurrent ? 800 : 500,
                          color: isCurrent ? '#fff' : '#b5b5b9'
                        }}>{s.titulo}</span>
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Fields list */}
                {currentModulo.telas?.[0]?.campos && currentModulo.telas[0].campos.length > 0 ? (
                  <div>
                    <span style={{ fontSize: '0.62rem', color: '#8b8e99', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                      Campos do Formulário
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {currentModulo.telas[0].campos.map((field, idx) => (
                        <div key={idx} style={{
                          padding: '10px',
                          backgroundColor: '#111115',
                          borderRadius: '6px',
                          borderLeft: field.obrigatorio ? '3px solid #ef4444' : '3px solid #3a86ff',
                          border: '1px solid rgba(255,255,255,0.02)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '0.75rem', color: '#fff' }}>{field.nome}</strong>
                            <span style={{
                              fontSize: '0.55rem',
                              backgroundColor: field.obrigatorio ? 'rgba(239, 68, 68, 0.1)' : 'rgba(58, 134, 255, 0.1)',
                              color: field.obrigatorio ? '#ef4444' : '#3a86ff',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}>
                              {field.tipo} {field.obrigatorio ? '* Obrigatório' : ''}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.68rem', color: '#b5b5b9', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                            {field.descricao}
                          </p>
                          {field.exemplo && (
                            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', display: 'block' }}>
                              <strong>Exemplo de Preenchimento:</strong> {field.exemplo}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#444', fontSize: '0.7rem' }}>Nenhum campo mapeado.</div>
                )}

                {/* Buttons list */}
                {currentModulo.telas?.[0]?.botoes && currentModulo.telas[0].botoes.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.62rem', color: '#8b8e99', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                      Ações e Botões Operacionais
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {currentModulo.telas[0].botoes.map((btn, idx) => (
                        <div key={idx} style={{
                          padding: '8px 10px',
                          backgroundColor: '#111115',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.02)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <strong style={{ fontSize: '0.72rem', color: '#fff' }}>{btn.nome}</strong>
                            <p style={{ fontSize: '0.65rem', color: '#b5b5b9', margin: '2px 0 0 0' }}>{btn.descricao}</p>
                          </div>
                          <code style={{
                            fontSize: '0.58rem',
                            color: '#a16cff',
                            backgroundColor: 'rgba(131,56,236,0.08)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {btn.acao}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
          Selecione um módulo no painel esquerdo para carregar o assistente explicativo.
        </div>
      )}
    </div>
  );
};
