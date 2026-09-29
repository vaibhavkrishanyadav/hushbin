import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { createPaste } from '../lib/api';
import { useTheme } from '../hooks/useTheme';
import Header from './Header';
import ThemeToggle from './ThemeToggle';

const LANGUAGES = ['plaintext', 'sql', 'javascript', 'python', 'html', 'css', 'json', 'bash'];

const EXPIRY_CHOICES = [
  { value: 'never', label: 'Never' },
  { value: '1h', label: '1 hour' },
  { value: '24h', label: '24 hours' },
  { value: '48h', label: '48 hours' },
  { value: '7d', label: '7 days' }
];

export default function CreatePaste() {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [editable, setEditable] = useState(false);
  const [expiry, setExpiry] = useState('never');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  async function handleCreate() {
    if (!content.trim()) {
      setError('Write something before sharing.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { id } = await createPaste(content, language, editable, expiry);
      navigate(`/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <Header>
        <select className="select-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <select className="select-input" value={expiry} onChange={(e) => setExpiry(e.target.value)}>
          {EXPIRY_CHOICES.map((choice) => (
            <option key={choice.value} value={choice.value}>Expires: {choice.label}</option>
          ))}
        </select>

        <label className="editable-toggle">
          <input
            type="checkbox"
            checked={editable}
            onChange={(e) => setEditable(e.target.checked)}
          />
          Allow live editing
        </label>

        <ThemeToggle theme={theme} onToggle={toggleTheme} />

        <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
          {loading ? 'Sharing…' : 'Share'}
        </button>
      </Header>

      {error && <div className="error-banner">{error}</div>}

      <div className="editor-wrap">
        <Editor
          height="100%"
          language={language}
          value={content}
          onChange={(val) => setContent(val || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on', automaticLayout: true }}
        />
      </div>
    </div>
  );
}