import React, { useState } from 'react';

interface SystemPreviewerProps {
  guideData: any;
  onOpenAssistant: () => void;
  activeModuloId: string;
  setActiveModuloId: (id: string) => void;
}

export const SystemPreviewer: React.FC<SystemPreviewerProps> = ({
  guideData,
  onOpenAssistant,
  activeModuloId,
  setActiveModuloId,
}) => {
  const systemName = guideData?.sistema || guideData?.nome_sistema || 'SISTEMA WEB';
  const version = guideData?.versao || '1.0';
  const assistantName = guideData?.assistente?.nome || 'IA Assistant';

  const modulos = guideData?.modulos || [];

  // Local states for form simulations
  const [isNfeSent, setIsNfeSent] = useState(false);

  const handleSendNfe = () => {
    setIsNfeSent(true);
    setTimeout(() => setIsNfeSent(false), 3000);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c0c0f',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    }}>
      {/* Simulation Header / Browser Bar */}
      <div style={{
        backgroundColor: '#16161e',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Dot Controls */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
        </div>
        {/* Address Bar */}
        <div style={{
          flex: 1,
          backgroundColor: '#0a0a0c',
          borderRadius: '6px',
          padding: '4px 10px',
          fontSize: '0.62rem',
          color: 'rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <i className="fas fa-lock" style={{ fontSize: '0.55rem', color: '#10b981' }}></i>
          <span>http://localhost:3000/{activeModuloId || 'dashboard'}</span>
        </div>
      </div>

      {/* Workspace Inner App */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar Mockup */}
        <div style={{
          width: '150px',
          backgroundColor: '#111115',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 6px',
          gap: '4px'
        }}>
          <div style={{ padding: '0 8px 10px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#fff', letterSpacing: '0.02em' }}>{systemName}</span>
            <span style={{ display: 'block', fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)' }}>v{version}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto', flex: 1 }}>
            {modulos.length > 0 ? (
              modulos.map((m: any) => {
                const isActive = activeModuloId === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModuloId(m.id)}
                    style={{
                      padding: '6px 8px',
                      backgroundColor: isActive ? 'rgba(131, 56, 236, 0.1)' : 'transparent',
                      border: 'none',
                      color: isActive ? '#a16cff' : 'rgba(255,255,255,0.4)',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: isActive ? 800 : 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <i className="fas fa-cube" style={{ fontSize: '0.55rem' }}></i>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.nome}</span>
                  </button>
                );
              })
            ) : (
              <span style={{ fontSize: '0.6rem', color: '#666', fontStyle: 'italic', padding: '10px' }}>Aguardando scan...</span>
            )}
          </div>
        </div>

        {/* Content Frame Mockup */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#07070a' }}>
          
          {/* Header Bar */}
          <div style={{
            height: '48px',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#111115'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff' }}>
              {modulos.find((m: any) => m.id === activeModuloId)?.nome || 'Página Inicial'}
            </span>

            {/* Context Assistant trigger in system */}
            <button
              onClick={onOpenAssistant}
              style={{
                backgroundColor: 'rgba(131,56,236,0.15)',
                border: '1px solid #8338ec',
                color: '#a16cff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.62rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 10px rgba(131,56,236,0.15)'
              }}
            >
              <i className="fas fa-robot"></i> {assistantName}
            </button>
          </div>

          {/* Page body simulation */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', fontSize: '0.75rem', color: '#b5b5b9' }}>
            
            {activeModuloId === 'dashboard' && (
              <div>
                <p style={{ fontSize: '0.68rem', marginBottom: '12px' }}>Bem-vindo ao painel analítico geral do Keystone ERP.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: '#111115', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px' }}>
                    <span style={{ fontSize: '0.55rem', display: 'block', color: 'rgba(255,255,255,0.3)' }}>Faturamento Geral</span>
                    <strong style={{ fontSize: '1rem', color: '#fff', display: 'block', marginTop: '2px' }}>R$ 142.500,00</strong>
                  </div>
                  <div style={{ backgroundColor: '#111115', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px' }}>
                    <span style={{ fontSize: '0.55rem', display: 'block', color: 'rgba(255,255,255,0.3)' }}>Margem de Lucro</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--color-success)', display: 'block', marginTop: '2px' }}>32.4%</strong>
                  </div>
                  <div style={{ backgroundColor: '#111115', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px' }}>
                    <span style={{ fontSize: '0.55rem', display: 'block', color: 'rgba(255,255,255,0.3)' }}>Vendas Pendentes</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--color-warning)', display: 'block', marginTop: '2px' }}>12 pedidos</strong>
                  </div>
                </div>
                {/* Visual Chart mockup */}
                <div style={{ backgroundColor: '#111115', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', height: '100px' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, display: 'block', color: '#fff' }}>Evolução de Fluxo de Caixa (Junho)</span>
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: '50px', gap: '8px', marginTop: '10px' }}>
                    {[20, 40, 35, 60, 50, 75, 90, 85].map((h, i) => (
                      <div key={i} style={{ flex: 1, backgroundColor: '#8338ec', height: `${h}%`, borderRadius: '2px' }}></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeModuloId === 'clientes' && (
              <div>
                <p style={{ fontSize: '0.68rem', marginBottom: '12px' }}>Visualização da tela de cadastro de novos clientes do ERP.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Razão Social / Nome</label>
                    <input type="text" placeholder="Ex: Burger Delight" readOnly style={{ width: '100%', padding: '6px', fontSize: '0.68rem', backgroundColor: '#111115', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>CNPJ / CPF</label>
                    <input type="text" placeholder="Ex: 00.000.000/0001-00" readOnly style={{ width: '100%', padding: '6px', fontSize: '0.68rem', backgroundColor: '#111115', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.62rem', cursor: 'default' }}>Novo</button>
                  <button style={{ backgroundColor: '#8338ec', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.62rem', cursor: 'default' }}>Salvar Cliente</button>
                </div>
              </div>
            )}

            {activeModuloId === 'produtos' && (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.68rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'rgba(255,255,255,0.3)' }}>
                      <th style={{ padding: '6px' }}>CÓDIGO</th>
                      <th style={{ padding: '6px' }}>PRODUTO</th>
                      <th style={{ padding: '6px' }}>ESTOQUE</th>
                      <th style={{ padding: '6px' }}>PREÇO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '6px', color: '#fff' }}>#P001</td>
                      <td style={{ padding: '6px' }}>Burger Supremo</td>
                      <td style={{ padding: '6px', color: 'var(--color-success)' }}>140 un</td>
                      <td style={{ padding: '6px' }}>R$ 29,90</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '6px', color: '#fff' }}>#P002</td>
                      <td style={{ padding: '6px' }}>Casaco de Lã Inverno</td>
                      <td style={{ padding: '6px', color: 'var(--color-danger)' }}>12 un</td>
                      <td style={{ padding: '6px' }}>R$ 189,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeModuloId === 'fiscal' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ fontSize: '0.68rem', marginBottom: '12px' }}>Emissão instantânea de Nota Fiscal Eletrônica (NF-e).</p>
                
                {isNfeSent ? (
                  <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--color-success)', borderRadius: '6px', display: 'inline-block', fontSize: '0.68rem' }}>
                    <i className="fas fa-check-double" style={{ marginRight: '6px' }}></i> NF-e Transmitida com Sucesso p/ SEFAZ!
                  </div>
                ) : (
                  <button
                    onClick={handleSendNfe}
                    style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    <i className="fas fa-file-invoice"></i> TRANSMITIR NF-E SEFAZ
                  </button>
                )}
              </div>
            )}

            {/* Default page simulation if not custom coded */}
            {!['dashboard', 'clientes', 'produtos', 'fiscal'].includes(activeModuloId) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px', color: '#666', textAlign: 'center' }}>
                <i className="fas fa-window-maximize" style={{ fontSize: '2rem', marginBottom: '10px', color: 'rgba(255,255,255,0.04)' }}></i>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                  Tela de Simulação do Módulo "{activeModuloId}"
                </span>
                <span style={{ fontSize: '0.62rem', color: '#444', marginTop: '4px' }}>
                  Todos os campos, botões e gatilhos de ajuda já estão associados a esta tela!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
