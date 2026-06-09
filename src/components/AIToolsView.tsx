import React, { useState } from 'react';

export const AIToolsView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ copy: string; details: string; hashtags: string } | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsLoading(true);
    setResult(null);

    // Simulate AI generation
    setTimeout(() => {
      setResult({
        copy: `🔥 O SABOR QUE CONQUISTA! 🔥\n\nChegou o novo *${topic}* na Burger Delight! A combinação perfeita de ingredientes selecionados, grelhado na brasa para garantir aquele sabor suculento incomparável. 🤤🍔\n\nPeça já pelo link da bio ou venha nos visitar! Corra antes que acabe! 🏃‍♂️💨`,
        details: `💡 **Sugestões Visuais de Produção:**\n- **Cores principais:** Vermelho vibrante (gatilho de fome) e tons dourados para o queijo derretido.\n- **Layout:** Hambúrguer centralizado em ângulo contra-plongée (baixo para cima) para parecer maior e imponente.\n- **Trilha de Áudio sugerida (Reels):** Batida de hip-hop instrumental moderna com efeitos sonoros de grelha quente.`,
        hashtags: `#BurgerDelight #HamburguerArtesanal #Fome #FoodPorn #Burgers #MarketingGastronomico`,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Inteligência Artificial de Marketing</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Gere briefings visuais completos, roteiros e textos comerciais de alta conversão para suas redes sociais.
        </p>
      </div>

      <div className="grid-2">
        {/* Generator Input */}
        <div className="glass-card">
          <h3 style={{ fontSize: '0.95rem', marginBottom: '16px' }}>Criador de Briefing Inteligente</h3>
          <form onSubmit={handleGenerate}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Tema ou Produto da Campanha</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Combo Burger Supremo, Coleção de Óculos Escuros, etc."
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 700 }}>Tom de Voz da Marca</label>
                <select
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', outline: 'none' }}
                >
                  <option>Descontraído & Moderno</option>
                  <option>Corporativo & Profissional</option>
                  <option>Urgente & Promocional</option>
                  <option>Inspirador & Luxuoso</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%', padding: '12px', justifyContent: 'center', fontWeight: 800 }}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processando Brainstorming...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i> Gerar Briefing & Copy com IA
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Output Results */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '16px' }}>Resultado Sugerido</h3>

          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.78rem', animation: 'fadeIn 0.3s ease' }}>
              <div>
                <strong style={{ color: 'var(--color-purple)', display: 'block', marginBottom: '4px' }}>Texto Comercial Copiado</strong>
                <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                  {result.copy}
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>Sugestões de Arte e Mídia</strong>
                <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                  {result.details}
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--color-success)', display: 'block', marginBottom: '4px' }}>Hashtags Estratégicas</strong>
                <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace' }}>
                  {result.hashtags}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.8rem' }}>
              <i className="fas fa-brain" style={{ fontSize: '2rem', color: 'var(--border-color)', marginBottom: '12px' }}></i>
              Preencha os dados à esquerda e clique em gerar para ver o poder da IA.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
