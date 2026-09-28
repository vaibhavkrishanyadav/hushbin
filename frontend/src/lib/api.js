const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export async function createPaste(content, language, editable, expiry) {
  const res = await fetch(`${API_BASE}/paste`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, language, editable, expiry })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create snippet');
  }
  return res.json();
}

export async function fetchPaste(id) {
  const res = await fetch(`${API_BASE}/paste/${id}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Snippet not found');
  }
  return res.json();
}