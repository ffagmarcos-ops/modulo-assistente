import React, { useState } from 'react';
import type { Company } from '../types';

interface CRMViewProps {
  currentUserRole: string;
}

export const CRMView: React.FC<CRMViewProps> = ({ currentUserRole }) => {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'Burger Delight',
      logoText: 'BD',
      contactName: 'Carlos Silva',
      contactPhone: '+5511999999999',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    },
    {
      id: '2',
      name: 'Hype Fashion',
      logoText: 'HF',
      contactName: 'Juliana Mendes',
      contactPhone: '+5511888888888',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juliana',
    },
    {
      id: '3',
      name: 'Clinica Vitta',
      logoText: 'CV',
      contactName: 'Dr. Roberto Souza',
      contactPhone: '+5511777777777',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=roberto',
    },
  ]);

  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactName || !contactPhone) return;

    const newCompany: Company = {
      id: Date.now().toString(),
      name,
      logoText: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      contactName,
      contactPhone,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${contactName}`,
    };

    setCompanies([...companies, newCompany]);
    setName('');
    setContactName('');
    setContactPhone('');
    setShowAddForm(false);
    
    setToastMsg(`Cliente "${name}" cadastrado com sucesso!`);
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
          <i className="fas fa-check-circle" style={{ color: 'var(--color-success)' }}></i>
          {toastMsg}
        </div>
      )}

      <div className="flex-between">
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>CRM & Contatos Operacionais</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Gerencie as empresas e seus respectivos contatos responsáveis pelo fluxo de aprovação das peças e recebimento de alertas do WhatsApp.
          </p>
        </div>
        {isAgencyOrAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <i className="fas fa-plus"></i> Novo Cliente
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ animation: 'fadeIn 0.25s ease' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '16px' }}>Cadastrar Empresa & Contato</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Nome da Empresa</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Tech Soluções"
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Nome do Contato Principal</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ex: Ricardo Santos"
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Telefone WhatsApp</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Ex: +5511999999999"
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Cadastrar</button>
            </div>
          </form>
        </div>
      )}

      {/* CRM list of companies */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {companies.map((comp) => (
          <div className="crm-item animate-hover" key={comp.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="company-logo">
                {comp.logoText}
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>{comp.name}</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>ID Cliente: #{comp.id}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={comp.avatarUrl}
                  alt={comp.contactName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e5e7eb' }}>{comp.contactName}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Aprovador Oficial</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.75rem' }}>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{comp.contactPhone}</span>
                <span style={{ fontSize: '0.62rem', color: '#25D366', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <i className="fab fa-whatsapp"></i> Ativo para Aprovações
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
