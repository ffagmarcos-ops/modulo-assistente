import React, { useState } from 'react';
import type { Demand } from '../types';

interface KanbanViewProps {
  demands: Demand[];
  updateDemandStatus: (id: string, newStatus: Demand['status']) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  demands,
  updateDemandStatus,
}) => {
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const columns: { id: Demand['status']; title: string; icon: string; color: string }[] = [
    { id: 'solicitado', title: 'Solicitado', icon: 'fa-inbox', color: 'var(--color-primary)' },
    { id: 'producao', title: 'Em Produção', icon: 'fa-cogs', color: 'var(--color-purple)' },
    { id: 'aprovacao', title: 'Aprovação', icon: 'fa-hourglass-half', color: 'var(--color-warning)' },
    { id: 'publicado', title: 'Publicado', icon: 'fa-paper-plane', color: 'var(--color-success)' },
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getClientColor = (client: string) => {
    switch (client) {
      case 'Burger Delight': return 'rgba(239, 68, 68, 0.15)';
      case 'Hype Fashion': return 'rgba(131, 56, 236, 0.15)';
      case 'Clinica Vitta': return 'rgba(16, 185, 129, 0.15)';
      default: return 'rgba(58, 134, 255, 0.15)';
    }
  };

  const getClientTextColor = (client: string) => {
    switch (client) {
      case 'Burger Delight': return '#ef4444';
      case 'Hype Fashion': return '#8338ec';
      case 'Clinica Vitta': return '#10b981';
      default: return '#3a86ff';
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
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

      {/* Columns Grid */}
      <div className="kanban-board">
        {columns.map((col) => {
          const colDemands = demands.filter((d) => d.status === col.id);
          return (
            <div key={col.id} className="kanban-column">
              <div className="kanban-column-header">
                <span className="kanban-column-title" style={{ color: col.color }}>
                  <i className={`fas ${col.icon}`}></i> {col.title}
                </span>
                <span className="kanban-badge">{colDemands.length}</span>
              </div>
              <div className="kanban-cards">
                {colDemands.map((demand) => (
                  <div
                    key={demand.id}
                    className="kanban-card"
                    onClick={() => setSelectedDemand(demand)}
                  >
                    <span
                      className="kanban-card-tag"
                      style={{
                        backgroundColor: getClientColor(demand.client),
                        color: getClientTextColor(demand.client),
                      }}
                    >
                      {demand.client}
                    </span>
                    <h4 className="kanban-card-title">{demand.title}</h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                      <i className="fas fa-photo-video"></i>
                      <span>{demand.channel}</span>
                    </div>

                    <div className="kanban-card-footer">
                      <span>{demand.date}</span>
                      <img
                        className="kanban-avatar"
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${demand.client}&backgroundColor=3a86ff`}
                        alt={demand.client}
                      />
                    </div>
                  </div>
                ))}
                {colDemands.length === 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.75rem',
                    border: '1px dashed rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    fontStyle: 'italic'
                  }}>
                    Sem demandas
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Demand Details Modal */}
      {selectedDemand && (
        <div className="modal-overlay" onClick={() => setSelectedDemand(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="status-badge"
                  style={{
                    backgroundColor: getClientColor(selectedDemand.client),
                    color: getClientTextColor(selectedDemand.client),
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.62rem',
                    fontWeight: 800
                  }}
                >
                  {selectedDemand.client}
                </span>
                <span className={`status-badge ${selectedDemand.status}`}>
                  {selectedDemand.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedDemand(null)}
                style={{ background: 'none', border: 'none', color: '#B5B5B5', fontSize: '1.1rem', cursor: 'pointer', outline: 'none' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>{selectedDemand.title}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8rem' }}>
                <div>
                  <strong style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Canal de Veiculação</strong>
                  <span><i className="fas fa-photo-video" style={{ marginRight: '6px', color: 'var(--color-primary)' }}></i>{selectedDemand.channel}</span>
                </div>

                <div>
                  <strong style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Briefing Criativo</strong>
                  <p style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', lineHeight: '1.5' }}>
                    {selectedDemand.briefing}
                  </p>
                </div>

                <div>
                  <strong style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Data Limite de Postagem</strong>
                  <span><i className="far fa-calendar-alt" style={{ marginRight: '6px', color: 'var(--color-purple)' }}></i>{selectedDemand.date}</span>
                </div>

                {selectedDemand.approvalSign && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px', color: 'var(--color-success)', fontSize: '0.75rem' }}>
                    <strong><i className="fas fa-check-double" style={{ marginRight: '6px' }}></i>Aprovação Eletrônica Efetuada</strong>
                    <div style={{ marginTop: '4px', fontFamily: 'monospace' }}>{selectedDemand.approvalSign}</div>
                  </div>
                )}

                {/* WhatsApp Manual Notification section */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '10px' }}>
                  <strong style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ações Operacionais de Aprovação</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      onClick={() => showToast(`Notificação de Lembrete enviada para ${selectedDemand.whatsappContact}!`)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.7rem' }}
                    >
                      <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> Lembrete Rápido
                    </button>
                    <button
                      onClick={() => showToast(`Notificação de Urgência enviada para ${selectedDemand.whatsappContact}!`)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.7rem' }}
                    >
                      <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> Alerta Urgente
                    </button>
                    <button
                      onClick={() => showToast(`Mensagem de Agradecimento enviada para ${selectedDemand.whatsappContact}!`)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.7rem' }}
                    >
                      <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> Agradecer Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedDemand(null)}>Fechar</button>
              
              {/* Move steps buttons */}
              {selectedDemand.status === 'solicitado' && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    updateDemandStatus(selectedDemand.id, 'producao');
                    setSelectedDemand(null);
                    showToast('Demanda movida para "Em Produção"!');
                  }}
                >
                  Iniciar Produção <i className="fas fa-cogs"></i>
                </button>
              )}
              {selectedDemand.status === 'producao' && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    updateDemandStatus(selectedDemand.id, 'aprovacao');
                    setSelectedDemand(null);
                    showToast('Demanda enviada para "Aprovação" do cliente!');
                  }}
                >
                  Enviar p/ Aprovação <i className="fas fa-hourglass-half"></i>
                </button>
              )}
              {selectedDemand.status === 'aprovacao' && (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    updateDemandStatus(selectedDemand.id, 'publicado');
                    setSelectedDemand(null);
                    showToast('Demanda aprovada e publicada!');
                  }}
                >
                  Aprovar & Publicar <i className="fas fa-check-circle"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
