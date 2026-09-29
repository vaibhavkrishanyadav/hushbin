import { Link } from 'react-router-dom';

export default function Header({ live, children }) {
  return (
    <header className="app-header">
      <div className="brand-group">
        <Link to="/" className="brand" aria-label="Hushbin home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7.25 3.75h6.2l4.8 4.8v11.7H7.25a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5Z" />
              <path d="M13.25 3.9v4.85h4.8M9 12h6.5M9 15.5h6.5M9 19h3.3" />
            </svg>
          </span>
          <span className="brand-wordmark"><span>Hush</span><span className="brand-accent">Bin</span></span>
        </Link>
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