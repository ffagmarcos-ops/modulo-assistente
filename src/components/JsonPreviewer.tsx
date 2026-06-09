import React, { useState } from 'react';

interface JsonPreviewerProps {
  jsonData: any;
}

export const JsonPreviewer: React.FC<JsonPreviewerProps> = ({ jsonData }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  const jsonString = JSON.stringify(jsonData, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${jsonData.sistema?.toLowerCase().replace(/\s+/g, '_') || 'assistant'}_guide.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Simple filtering mockup to display relevant nodes matching a search query
  const getFilteredDisplay = () => {
    if (!searchKey.trim()) return jsonString;
    
    // Split lines and filter those matching the keyword
    const lines = jsonString.split('\n');
    const filteredLines = lines.map((line) => {
      if (line.toLowerCase().includes(searchKey.toLowerCase())) {
        return `<span style="background-color: rgba(131,56,236,0.3); color: #fff;">${line}</span>`;
      }
      return line;
    });
    
    return filteredLines.join('\n');
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0c0c0f',
      border: '1px solid var(--border-color)',
      borderRadius: '10px',
      overflow: 'hidden'
    }}>
      {/* Top Header Controls */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#16161e',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-file-code" style={{ color: '#8338ec' }}></i>
          <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>assistant_guide.json</span>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '200px' }}>
          <input
            type="text"
            placeholder="Pesquisar chave..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            style={{
              width: '100%',
              padding: '4px 10px 4px 24px',
              backgroundColor: '#0a0a0c',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.68rem',
              outline: 'none'
            }}
          />
          <i className="fas fa-search" style={{ position: 'absolute', left: '8px', top: '7px', fontSize: '0.6rem', color: '#666' }}></i>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ fontSize: '0.65rem', padding: '4px 8px', borderColor: copySuccess ? 'var(--color-success)' : 'var(--border-color)' }}
          >
            {copySuccess ? (
              <>
                <i className="fas fa-check" style={{ color: 'var(--color-success)' }}></i> Copiado!
              </>
            ) : (
              <>
                <i className="far fa-copy"></i> Copiar Código
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ fontSize: '0.65rem', padding: '4px 10px', backgroundColor: '#8338ec' }}
          >
            <i className="fas fa-download"></i> Baixar JSON
          </button>
        </div>
      </div>

      {/* Code Textarea Display */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflow: 'auto',
        maxHeight: '320px',
        margin: 0,
        backgroundColor: '#07070a'
      }}>
        <pre style={{
          margin: 0,
          fontFamily: '"Fira Code", monospace',
          fontSize: '0.65rem',
          color: '#a1a6b4',
          lineHeight: '1.4',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {searchKey ? (
            <code dangerouslySetInnerHTML={{ __html: getFilteredDisplay() }} />
          ) : (
            <code>{jsonString}</code>
          )}
        </pre>
      </div>
    </div>
  );
};
