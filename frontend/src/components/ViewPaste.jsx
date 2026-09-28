import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { fetchPaste } from '../lib/api';

const SOCKET_URL = import.meta.env.VITE_API_URL;

export default function ViewPaste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const suppressNextChange = useRef(false);

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
      if (position) editor.setPosition(position); // keep cursor from jumping to start
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
      <div className="view-paste">
        <header className="topbar"><Link to="/" className="brand">Hushbin</Link></header>
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  if (!paste) return <div className="view-paste loading">Loading snippet…</div>;

  return (
    <div className="view-paste">
      <header className="topbar">
        <Link to="/" className="brand">Hushbin</Link>
        <div className="paste-meta">
          <span className="lang-tag">{paste.language}</span>
          {paste.editable && <span className="live-tag">● Live</span>}
          <button onClick={handleCopyLink}>{copied ? 'Copied!' : 'Copy link'}</button>
          <Link to="/" className="new-paste-btn">New snippet</Link>
        </div>
      </header>

      <div className="editor-wrap">
        <Editor
          height="70vh"
          language={paste.language}
          defaultValue={paste.content}
          onMount={handleEditorMount}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{ fontSize: 14, minimap: { enabled: false }, readOnly: !paste.editable, wordWrap: 'on' }}
        />
      </div>
    </div>
  );
}