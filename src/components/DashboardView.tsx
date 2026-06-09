import React from 'react';
import type { Demand } from '../types';

interface DashboardViewProps {
  demands: Demand[];
  onNavigate: (module: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ demands, onNavigate }) => {
  const inProduction = demands.filter(d => d.status === 'producao').length;
  const pendingApproval = demands.filter(d => d.status === 'aprovacao').length;
  const published = demands.filter(d => d.status === 'publicado').length;

  return (
    <div>
      <div className="grid-4 mb-20">
        {/* Metric 1: SLA */}
        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'var(--color-success-glow)', color: 'var(--color-success)' }}>
            <i className="fas fa-history"></i>
          </div>
          <div className="metric-info">
            <span className="metric-title">SLA Geral</span>
            <span className="metric-value">98.4%</span>
          </div>
        </div>

        {/* Metric 2: Production */}
        <div className="glass-card metric-card" onClick={() => onNavigate('kanban')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'var(--color-purple-glow)', color: 'var(--color-purple)' }}>
            <i className="fas fa-tasks"></i>
          </div>
          <div className="metric-info">
            <span className="metric-title">Em Produção</span>
            <span className="metric-value">{inProduction}</span>
          </div>
        </div>

        {/* Metric 3: Pending */}
        <div className="glass-card metric-card" onClick={() => onNavigate('approval')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'var(--color-warning-glow)', color: 'var(--color-warning)' }}>
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="metric-info">
            <span className="metric-title">Aprovações Pendentes</span>
            <span className="metric-value">{pendingApproval}</span>
          </div>
        </div>

        {/* Metric 4: Completed */}
        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(58, 134, 255, 0.15)', color: 'var(--color-primary)' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="metric-info">
            <span className="metric-title">Publicados</span>
            <span className="metric-value">{published}</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Engagement Analytics Chart mockup */}
        <div className="glass-card">
          <div className="flex-between mb-20">
            <h3 style={{ fontSize: '0.95rem' }}>Nível de Engajamento por Cliente</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Mês Atual</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            {[
              { client: 'Burger Delight', val: 88, color: 'var(--color-primary)' },
              { client: 'Hype Fashion', val: 72, color: 'var(--color-purple)' },
              { client: 'Clinica Vitta', val: 95, color: 'var(--color-success)' },
              { client: 'Tech Soluções', val: 40, color: 'var(--color-danger)' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className="flex-between" style={{ fontSize: '0.75rem' }}>
                  <span style={{ fontWeight: 600 }}>{item.client}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.val}%</span>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.val}%`, backgroundColor: item.color, borderRadius: '3px', transition: 'width 1s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="glass-card">
          <h3 style={{ fontSize: '0.95rem', marginBottom: '20px' }}>Atividades Recentes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { text: 'Aprovação recebida para post "Burger Lovers" via Portal.', time: 'Há 5 min', icon: 'fa-check-double', color: 'var(--color-success)' },
              { text: 'Novo rascunho de campanha adicionado pela Agência.', time: 'Há 25 min', icon: 'fa-calendar-plus', color: 'var(--color-primary)' },
              { text: 'Demanda "Black Friday Draft" movida para produção.', time: 'Há 1 hora', icon: 'fa-tasks', color: 'var(--color-purple)' },
              { text: 'WhatsApp enviado automaticamente para Clinica Vitta.', time: 'Há 3 horas', icon: 'fa-paper-plane', color: 'var(--color-warning)' },
            ].map((activity, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.78rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activity.color,
                  flexShrink: 0
                }}>
                  <i className={`fas ${activity.icon}`} style={{ fontSize: '0.7rem' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: '#e5e7eb', lineHeight: '1.4' }}>{activity.text}</p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
