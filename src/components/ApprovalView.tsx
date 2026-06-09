import React, { useState } from 'react';
import type { Demand } from '../types';

interface ApprovalViewProps {
  demands: Demand[];
  updateDemandStatus: (id: string, newStatus: Demand['status'], extra?: Partial<Demand>) => void;
  currentUserRole: string;
}

export const ApprovalView: React.FC<ApprovalViewProps> = ({
  demands,
  updateDemandStatus,
  currentUserRole,
}) => {
  const [activeDemandId, setActiveDemandId] = useState<string | null>(
    demands.find(d => d.status === 'aprovacao')?.id || null
  );
  
  const [adjustmentText, setAdjustmentText] = useState('');
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const pendingDemands = demands.filter(d => d.status === 'aprovacao');
  const activeDemand = demands.find(d => d.id === activeDemandId) || pendingDemands[0];

  const handleApprove = () => {
    if (!activeDemand) return;
    
    // Simulate electronic signature with IP and Date
    const mockIP = '192.168.1.104';
    const timestamp = new Date().toLocaleString('pt-BR');
    const signature = `Aprovado eletronicamente por ${currentUserRole.toUpperCase()} (IP: ${mockIP}) em ${timestamp}`;

    updateDemandStatus(activeDemand.id, 'publicado', {
      approvalSign: signature
    });

    setToastMsg(`✅ Arte "${activeDemand.title}" aprovada e assinada digitalmente!`);
    setTimeout(() => setToastMsg(null), 3000);
    
    // Switch to next pending
    const nextPending = pendingDemands.find(d => d.id !== activeDemand.id);
    setActiveDemandId(nextPending?.id || null);
  };

  const handleRequestAdjustments = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDemand || !adjustmentText.trim()) return;

    // Send back to production and add notes
    updateDemandStatus(activeDemand.id, 'producao', {
      notes: `Ajuste solicitado: ${adjustmentText}`
    });

    setToastMsg(`⚠️ Solicitação de ajuste registrada para a arte "${activeDemand.title}".`);
    setAdjustmentText('');
    setShowAdjustmentForm(false);
    setTimeout(() => setToastMsg(null), 3000);

    // Switch to next pending
    const nextPending = pendingDemands.find(d => d.id !== activeDemand.id);
    setActiveDemandId(nextPending?.id || null);
  };

  const handleReject = () => {
    if (!activeDemand) return;

    updateDemandStatus(activeDemand.id, 'solicitado');
    setToastMsg(`❌ Arte reprovada. Movida de volta para Solicitados.`);
    setTimeout(() => setToastMsg(null), 3000);

    // Switch to next pending
    const nextPending = pendingDemands.find(d => d.id !== activeDemand.id);
    setActiveDemandId(nextPending?.id || null);
  };

  const getClientColor = (client: string) => {
    switch (client) {
      case 'Burger Delight': return '#ef4444';
      case 'Hype Fashion': return '#8338ec';
      case 'Clinica Vitta': return '#10b981';
      default: return '#3a86ff';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#1b1b22',
          border: '1px solid var(--color-success)',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          color: '#ffffff',
          fontSize: '0.8rem',
          zIndex: 1010,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <i className="fas fa-check-circle" style={{ color: 'var(--color-success)' }}></i>
          {toastMsg}
        </div>
      )}

      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Portal de Aprovação de Artes</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Clientes analisam as artes geradas, efetuam assinaturas eletrônicas seguras com registro de IP ou solicitam ajustes pontuais com comentários.
        </p>
      </div>

      {pendingDemands.length > 0 && activeDemand ? (
        <div className="approval-showcase">
          {/* Left panel: Selected Artwork Preview */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-between">
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', backgroundColor: getClientColor(activeDemand.client) + '15', color: getClientColor(activeDemand.client), marginRight: '8px' }}>
                  {activeDemand.client}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Canal: {activeDemand.channel}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Prazo: {activeDemand.date}</span>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{activeDemand.title}</h3>

            {/* Simulated Smartphone post display */}
            <div className="artwork-container">
              <div style={{
                width: '280px',
                backgroundColor: '#161616',
                border: '1px solid var(--border-color)',
                borderRadius: '24px',
                padding: '12px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
                fontFamily: 'system-ui, sans-serif'
              }}>
                {/* Smartphone top status bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#666', marginBottom: '8px', padding: '0 8px' }}>
                  <span>09:41</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <i className="fas fa-signal"></i>
                    <i className="fas fa-wifi"></i>
                    <i className="fas fa-battery-three-quarters"></i>
                  </div>
                </div>

                {/* Instagram Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeDemand.client}&backgroundColor=3a86ff`}
                    style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                    alt={activeDemand.client}
                  />
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ffffff' }}>{activeDemand.client.toLowerCase().replace(' ', '')}</span>
                  <i className="fas fa-ellipsis-h" style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#666' }}></i>
                </div>

                {/* Instagram Image Content Mockup */}
                <div style={{
                  height: '240px',
                  width: '100%',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #2b1055, #7597de)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '16px 16px'
                  }} />
                  <i className="fas fa-bullhorn" style={{ fontSize: '2rem', color: '#ffffff', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))', marginBottom: '12px', zIndex: 1 }}></i>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff', zIndex: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {activeDemand.title}
                  </span>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.8)', zIndex: 1, marginTop: '8px' }}>
                    {activeDemand.channel} • M.O FLOW
                  </span>
                </div>

                {/* Instagram Footer Actions */}
                <div style={{ display: 'flex', gap: '10px', margin: '8px 0', fontSize: '0.75rem', color: '#ffffff' }}>
                  <i className="far fa-heart"></i>
                  <i className="far fa-comment"></i>
                  <i className="far fa-paper-plane"></i>
                  <i className="far fa-bookmark" style={{ marginLeft: 'auto' }}></i>
                </div>

                {/* Instagram Caption */}
                <div style={{ fontSize: '0.58rem', color: '#ffffff', lineHeight: '1.3' }}>
                  <span style={{ fontWeight: 700, marginRight: '4px' }}>{activeDemand.client.toLowerCase().replace(' ', '')}</span>
                  {activeDemand.title} #marketing #{activeDemand.client.split(' ')[0].toLowerCase()}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
              <button className="btn btn-success" onClick={handleApprove} style={{ padding: '10px 20px' }}>
                <i className="fas fa-check-double"></i> Aprovar Completo (Assinar)
              </button>
              
              <button className="btn btn-secondary" onClick={() => setShowAdjustmentForm(!showAdjustmentForm)} style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>
                <i className="fas fa-edit"></i> Solicitar Ajustes
              </button>

              <button className="btn btn-danger" onClick={handleReject}>
                <i className="fas fa-times"></i> Reprovar Peça
              </button>
            </div>

            {showAdjustmentForm && (
              <form onSubmit={handleRequestAdjustments} style={{ marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', animation: 'fadeIn 0.2s ease' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>O que precisa ser alterado?</label>
                <textarea
                  value={adjustmentText}
                  onChange={(e) => setAdjustmentText(e.target.value)}
                  placeholder="Ex: Mudar a cor do fundo para azul e corrigir o texto 'Supremo' para 'Premium'..."
                  required
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAdjustmentForm(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--color-warning)' }}>Enviar Alterações</button>
                </div>
              </form>
            )}
          </div>

          {/* Right panel: Pending Queue */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '4px' }}>
              Fila de Aprovação ({pendingDemands.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '400px' }}>
              {pendingDemands.map(d => (
                <div
                  key={d.id}
                  onClick={() => {
                    setActiveDemandId(d.id);
                    setShowAdjustmentForm(false);
                  }}
                  style={{
                    backgroundColor: activeDemandId === d.id ? 'rgba(58, 134, 255, 0.12)' : 'var(--bg-tertiary)',
                    border: activeDemandId === d.id ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: getClientColor(d.client) }}>
                      {d.client}
                    </span>
                    <span style={{ fontSize: '0.58rem', color: 'var(--color-text-muted)' }}>{d.date}</span>
                  </div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{d.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '50px', textAlign: 'center', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          <i className="fas fa-check-double" style={{ fontSize: '2.5rem', color: 'var(--color-success)', marginBottom: '16px', display: 'block' }}></i>
          Tudo em dia! Nenhuma peça aguardando sua aprovação neste momento.
        </div>
      )}
    </div>
  );
};
