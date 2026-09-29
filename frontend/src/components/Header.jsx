import { Link } from 'react-router-dom';

export default function Header({ live, children }) {
  return (
    <header className="app-header">
      <div className="brand-group">
        <Link to="/" className="brand">Hushbin</Link>
        {live && (
          <span className="live-badge">
            <span className="live-dot" />
            live
          </span>
        )}
      </div>
      <div className="toolbar">{children}</div>
    </header>
  );
}