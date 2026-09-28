const API_BASE = 'http://localhost:3000/api';

export async function createPaste(content, language, editable) {
  const res = await fetch(`${API_BASE}/paste`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, language, editable })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create paste');
  }
  return res.json();
}

export async function fetchPaste(id) {
  const res = await fetch(`${API_BASE}/paste/${id}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Paste not found');
  }

  return res.json(); // { id, content, language, created_at }
}