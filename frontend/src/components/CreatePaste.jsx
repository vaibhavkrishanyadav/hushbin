import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { createPaste } from '../lib/api';

const LANGUAGES = ['plaintext', 'javascript', 'python', 'html', 'css', 'json', 'bash'];

export default function CreatePaste() {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleCreate() {
    if (!content.trim()) {
      setError('Write something before sharing.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { id } = await createPaste(content, language);
      navigate(`/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-paste">
      <header className="topbar">
        <h1>Hushbin</h1>
        <p className="tagline">Share code and text, quick and quiet.</p>
      </header>

      <div className="toolbar">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <button onClick={handleCreate} disabled={loading}>
          {loading ? 'Sharing…' : 'Share'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="editor-wrap">
        <Editor
          height="60vh"
          language={language}
          value={content}
          onChange={(val) => setContent(val || '')}
          theme="vs-dark"
          options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
        />
      </div>
    </div>
  );
}