import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { fetchPaste } from '../lib/api';
import { useTheme } from '../hooks/useTheme';
import Header from './Header';
import ThemeToggle from './ThemeToggle';

const SOCKET_URL = import.meta.env.VITE_API_URL;

export default function ViewPaste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const suppressNextChange = useRef(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchPaste(id)
      .then(setPaste)
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (!paste || !paste.editable) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit('join-paste', id);

    socket.on('content-change', (newContent) => {
      const editor = editorRef.current;
      if (!editor || editor.getValue() === newContent) return;

      suppressNextChange.current = true;
      const position = editor.getPosition();
      editor.setValue(newContent);
      if (position) editor.setPosition(position);
    });

    return () => socket.disconnect();
  }, [paste?.editable, id]);

  function handleEditorMount(editor) {
    editorRef.current = editor;
  }

  function handleEditorChange(value) {
    if (suppressNextChange.current) {
      suppressNextChange.current = false;
      return;
    }
    socketRef.current?.emit('content-change', { id, content: value });
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (error) {
    return (
      <div className="page">
        <Header>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </Header>
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  if (!paste) return <div className="view-paste loading">Loading snippet…</div>;

  return (
    <div className="page">
      <Header live={paste.editable}>
        <span className="lang-tag">{paste.language}</span>
        <button className="btn" onClick={handleCopyLink}>{copied ? 'Copied!' : 'Copy link'}</button>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <Link to="/" className="btn btn-primary">New snippet</Link>
      </Header>

      <div className="editor-wrap">
        <Editor
          height="100%"
          language={paste.language}
          defaultValue={paste.content}
          onMount={handleEditorMount}
          onChange={handleEditorChange}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{ fontSize: 14, minimap: { enabled: false }, readOnly: !paste.editable, wordWrap: 'on', automaticLayout: true }}
        />
      </div>
    </div>
  );
}