import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { fetchPaste } from '../lib/api';

export default function ViewPaste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPaste(id)
      .then(setPaste)
      .catch((err) => setError(err.message));
  }, [id]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (error) {
    return (
      <div className="view-paste">
        <header className="topbar">
          <Link to="/" className="brand">Hushbin</Link>
        </header>
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  if (!paste) {
    return <div className="view-paste loading">Loading…</div>;
  }

  return (
    <div className="view-paste">
      <header className="topbar">
        <Link to="/" className="brand">Hushbin</Link>
        <div className="paste-meta">
          <span className="lang-tag">{paste.language}</span>
          <button onClick={handleCopyLink}>{copied ? 'Copied!' : 'Copy link'}</button>
          <Link to="/" className="new-paste-btn">New paste</Link>
        </div>
      </header>

      <div className="editor-wrap">
        <Editor
          height="70vh"
          language={paste.language}
          value={paste.content}
          theme="vs-dark"
          options={{ fontSize: 14, minimap: { enabled: false }, readOnly: true, wordWrap: 'on' }}
        />
      </div>
    </div>
  );
}