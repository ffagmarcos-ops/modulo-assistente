import React, { useState } from 'react';
import type { Demand } from '../types';

interface CalendarViewProps {
  demands: Demand[];
  addDemand: (newDemand: Omit<Demand, 'id'>) => void;
  currentUserRole: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  demands,
  addDemand,
  currentUserRole,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('Burger Delight');
  const [channel, setChannel] = useState('Instagram Feed');
  const [briefing, setBriefing] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sample June 2026 dates (June 1st is Monday, June 30 days)
  const daysInMonth = 30;
  const startOffset = 0; // Monday
  const cellsCount = 35; // 5 weeks grid

  const getClientColor = (client: string) => {
    switch (client) {
      case 'Burger Delight': return '#ef4444';
      case 'Hype Fashion': return '#8338ec';
      case 'Clinica Vitta': return '#10b981';
      default: return '#3a86ff';
    }
  };

  const holidays: Record<number, string> = {
    12: 'Dia dos Namorados 💖',
    24: 'São João 🔥',
  };

  const handleCellClick = (day: number) => {
    if (['superadmin', 'agencia', 'gestor'].includes(currentUserRole)) {
      setSelectedDay(day);
    }
  };

  const handleSchedulePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedDay) return;

    addDemand({
      title,
      client,
      channel,
      briefing: briefing || 'Agendamento rápido pelo Calendário.',
      date: `2026-06-${selectedDay.toString().padStart(2, '0')}`,
      whatsappContact: '+5511999999999',
      status: 'solicitado',
    });

    setTitle('');
    setBriefing('');
    setSelectedDay(null);
    setToastMsg(`📅 Post agendado para dia ${selectedDay} de Junho!`);
    setTimeout(() => setToastMsg(null), 3000);
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
          border: '1px solid var(--color-primary)',
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
          <i className="far fa-calendar-check" style={{ color: 'var(--color-primary)' }}></i>
          {toastMsg}
        </div>
      )}

      <div className="flex-between">
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Calendário de Datas Temáticas e Postagens</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Visualize os prazos de publicação cruzados com as datas comemorativas nacionais. Clique em qualquer célula vazia para agendar um post direto na data.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 700, backgroundColor: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <i className="far fa-calendar-alt" style={{ color: 'var(--color-primary)' }}></i> Junho 2026
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div className="calendar-grid" style={{ gridTemplateRows: 'auto' }}>
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="calendar-header-day">{d}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {Array.from({ length: cellsCount }).map((_, idx) => {
            const dayNum = idx + 1 - startOffset;
            const isValidDay = dayNum > 0 && dayNum <= daysInMonth;
            
            if (!isValidDay) {
              return <div key={idx} className="calendar-cell inactive"><span className="calendar-cell-num">-</span></div>;
            }

            // Find posts scheduled for this day
            const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
            const dayDemands = demands.filter(d => d.date === dateStr);
            const holiday = holidays[dayNum];

            return (
              <div
                key={idx}
                className={`calendar-cell ${holiday ? 'has-holiday' : ''}`}
                onClick={() => handleCellClick(dayNum)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                  <span className="calendar-cell-num" style={{ color: holiday ? 'var(--color-purple)' : '#ffffff' }}>{dayNum}</span>
                  {holiday && (
                    <span style={{ fontSize: '0.6rem', color: 'var(--color-purple)', fontWeight: 800 }}>Feriado</span>
                  )}
                </div>

                {holiday && (
                  <div className="calendar-holiday-tag" style={{ fontSize: '0.55rem' }}>{holiday}</div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', width: '100%' }}>
                  {dayDemands.map(d => (
                    <div
                      key={d.id}
                      className="calendar-post-badge"
                      style={{ backgroundColor: getClientColor(d.client) }}
                      title={`${d.client}: ${d.title}`}
                    >
                      {d.client.split(' ')[0]}: {d.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Post Dialog */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                📅 Agendar Postagem para o Dia {selectedDay} de Junho
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                style={{ background: 'none', border: 'none', color: '#B5B5B5', fontSize: '1.1rem', cursor: 'pointer', outline: 'none' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSchedulePost}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Título da Peça</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Promoção São João"
                    required
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Cliente</label>
                    <select
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                    >
                      <option value="Burger Delight">Burger Delight</option>
                      <option value="Hype Fashion">Hype Fashion</option>
                      <option value="Clinica Vitta">Clinica Vitta</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Canal</label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                    >
                      <option value="Instagram Feed">Instagram Feed</option>
                      <option value="Instagram Reels">Instagram Reels</option>
                      <option value="Facebook Post">Facebook Post</option>
                      <option value="Stories">Stories</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Briefing Opcional</label>
                  <textarea
                    value={briefing}
                    onChange={(e) => setBriefing(e.target.value)}
                    placeholder="Ex: Utilizar cores quentes para celebrar o feriado nacional."
                    rows={3}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedDay(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Agendar Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
