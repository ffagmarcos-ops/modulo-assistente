import React from 'react';
import type { Demand } from '../types';

interface ReportsViewProps {
  demands: Demand[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ demands }) => {
  const publishedDemands = demands.filter(d => d.status === 'publicado');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Relatórios de Desempenho e SLA</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Monitore o tempo de aprovação de postagens, o cumprimento de prazos do time interno e exporte relatórios consolidados para seus clientes.
        </p>
      </div>

      <div className="grid-3 mb-20">
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Tempo Médio Resposta</span>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginTop: '6px' }}>2.4 Horas</h3>
          <span style={{ fontSize: '0.62rem', color: 'var(--color-success)', fontWeight: 700 }}><i className="fas fa-caret-up"></i> 12% mais rápido que mês anterior</span>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Aprovações sem Ajuste</span>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--color-purple)', marginTop: '6px' }}>82.1%</h3>
          <span style={{ fontSize: '0.62rem', color: 'var(--color-success)', fontWeight: 700 }}><i className="fas fa-caret-up"></i> +5.4% de precisão de briefing</span>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Postagens Agendadas</span>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--color-success)', marginTop: '6px' }}>{publishedDemands.length} posts</h3>
          <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)' }}>Mês de Junho/2026</span>
        </div>
      </div>

      {/* History of approvals table */}
      <div className="glass-card">
        <div className="flex-between mb-20">
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Histórico de Peças Aprovadas e Auditadas</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={() => alert('PDF exportado com sucesso (simulado).')} style={{ fontSize: '0.7rem', padding: '6px 12px' }}>
              <i className="far fa-file-pdf"></i> Exportar PDF
            </button>
            <button className="btn btn-secondary" onClick={() => alert('Excel exportado com sucesso (simulado).')} style={{ fontSize: '0.7rem', padding: '6px 12px' }}>
              <i className="far fa-file-excel"></i> Exportar XLS
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--color-text-muted)', fontWeight: 800 }}>
                <th style={{ padding: '12px' }}>MÓDULO</th>
                <th style={{ padding: '12px' }}>CLIENTE</th>
                <th style={{ padding: '12px' }}>TÍTULO DA PEÇA</th>
                <th style={{ padding: '12px' }}>DATA LIMITE</th>
                <th style={{ padding: '12px' }}>ASSINATURA DIGITAL / IP</th>
              </tr>
            </thead>
            <tbody>
              {publishedDemands.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#ffffff' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>{d.channel}</td>
                  <td style={{ padding: '12px' }}>{d.client}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{d.title}</td>
                  <td style={{ padding: '12px' }}>{d.date}</td>
                  <td style={{ padding: '12px', color: 'var(--color-success)', fontFamily: 'monospace', fontSize: '0.68rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                    {d.approvalSign || 'Aprovado via Central'}
                  </td>
                </tr>
              ))}

              {publishedDemands.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    Nenhuma peça publicada para auditar o SLA neste mês. Vá ao Portal de Aprovação e aprove uma peça!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
