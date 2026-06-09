import React, { useState } from 'react';
import type { Demand } from '../types';

interface PlannerViewProps {
  addDemand: (newDemand: Omit<Demand, 'id'>) => void;
  currentUserRole: string;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  addDemand,
  currentUserRole,
}) => {
  // Let's model drafts as demands with status 'planning'. Wait, we can keep them in the same array,
  // or define a local drafts list, or just use a custom status.
  // Actually, keeping them as 'solicitado' is good, but drafts can be represented as demands that haven't been sent to Kanban yet.
  // Let's maintain a local drafts state or use a subset of demands.
  // Let's create a local drafts state initialized with a few sample drafts, which can be promoted.
  const [drafts, setDrafts] = useState<Omit<Demand, 'status' | 'id'>[]>([
    {
      title: 'Promoção Dia dos Pais 2026',
      client: 'Burger Delight',
      briefing: 'Divulgar o combo Burger Supremo + Bebida Grande por preço promocional. Arte com foto em alta resolução do hambúrguer e tema de pais.',
      channel: 'Instagram Feed',
      date: '2026-08-09',
      whatsappContact: '+5511999999999',
    },
    {
      title: 'Lançamento Coleção Inverno',
      client: 'Hype Fashion',
      briefing: 'Criar vídeo do desfile de moda mostrando os casacos e gorros de lã para o lançamento digital da coleção.',
      channel: 'Instagram Reels',
      date: '2026-06-21',
      whatsappContact: '+5511888888888',
    },
    {
      title: 'Post Informativo Exames Prev.',
      client: 'Clinica Vitta',
      briefing: 'Infográfico detalhando a importância dos exames anuais de rotina para saúde do coração.',
      channel: 'Facebook Post',
      date: '2026-06-15',
      whatsappContact: '+5511777777777',
    }
  ]);

  // Form State
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('Burger Delight');
  const [channel, setChannel] = useState('Instagram Feed');
  const [briefing, setBriefing] = useState('');
  const [date, setDate] = useState('2026-06-12');
  const [whatsappContact, setWhatsappContact] = useState('+5511999999999');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !briefing) return;
    
    const newDraft: Omit<Demand, 'status' | 'id'> = {
      title,
      client,
      channel,
      briefing,
      date,
      whatsappContact,
    };
    
    setDrafts([...drafts, newDraft]);
    setTitle('');
    setBriefing('');
    setShowAddForm(false);
    
    setToastMsg('Rascunho de post planejado com sucesso!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendToProduction = (draftIndex: number) => {
    const draft = drafts[draftIndex];
    addDemand({
      ...draft,
      status: 'solicitado'
    });
    
    // Remove from local drafts
    setDrafts(drafts.filter((_, idx) => idx !== draftIndex));
    
    setToastMsg(`🚀 "${draft.title}" enviado para produção no Kanban!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isAgencyOrAdmin = ['superadmin', 'agencia', 'gestor'].includes(currentUserRole);

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
          <i className="fas fa-rocket" style={{ color: 'var(--color-primary)' }}></i>
          {toastMsg}
        </div>
      )}

      <div className="flex-between">
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Planejamento de Campanhas (Rascunhos)</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Cadastre rascunhos de posts, gerencie briefings e envie para o time de produção quando estiver pronto.
          </p>
        </div>
        {isAgencyOrAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <i className="fas fa-plus"></i> Novo Post Planejado
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ animation: 'fadeIn 0.25s ease' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '16px' }}>Novo Planejamento de Post</h3>
          <form onSubmit={handleCreateDraft}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Título do Post</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Oferta Combo Família"
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Cliente / Marca</label>
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
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Canal de Mídia</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                >
                  <option value="Instagram Feed">Instagram Feed</option>
                  <option value="Instagram Stories">Instagram Stories</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="Facebook Post">Facebook Post</option>
                  <option value="E-mail Marketing">E-mail Marketing</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Data Limite de Postagem</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Briefing Criativo</label>
                <textarea
                  value={briefing}
                  onChange={(e) => setBriefing(e.target.value)}
                  placeholder="Descreva as instruções de arte, cores, textos sugeridos e referências..."
                  required
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Contato para Aprovação (WhatsApp)</label>
                <input
                  type="text"
                  value={whatsappContact}
                  onChange={(e) => setWhatsappContact(e.target.value)}
                  placeholder="Ex: +5511999999999"
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Salvar Rascunho</button>
            </div>
          </form>
        </div>
      )}

      {/* Drafts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {drafts.map((draft, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>
                  {draft.client}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                  <i className="fas fa-photo-video" style={{ marginRight: '4px' }}></i>{draft.channel}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                  <i className="far fa-calendar-alt" style={{ marginRight: '4px' }}></i>{draft.date}
                </span>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>{draft.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{draft.briefing}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
              {isAgencyOrAdmin ? (
                <button
                  className="btn btn-primary"
                  onClick={() => handleSendToProduction(idx)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  🚀 Enviar Produção
                </button>
              ) : (
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  Aguardando Agência
                </span>
              )}
            </div>
          </div>
        ))}

        {drafts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
            border: '1px dashed var(--border-color)',
            borderRadius: '12px'
          }}>
            Nenhum rascunho de post planejado. Crie um novo rascunho acima!
          </div>
        )}
      </div>
    </div>
  );
};
