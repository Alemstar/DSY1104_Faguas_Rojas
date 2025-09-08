import { BLOGS } from './blogs-data.js';

function parseDate(d) { return new Date(d); }

function createCard(post) {
  // container is a block with left text and right large image
  const wrapper = document.createElement('article');
  wrapper.className = 'blog-card';
  wrapper.style = 'display:flex; gap:1.5rem; align-items:center; padding:1.25rem; background:var(--surface); border:1px solid var(--border); border-radius:8px;';
  wrapper.tabIndex = 0; // focusable for keyboard

  // Left: text + CTA
  const left = document.createElement('div');
  left.style = 'flex:1; display:flex; flex-direction:column; gap:.75rem;';
  const h3 = document.createElement('h3'); h3.textContent = post.title; h3.style = 'margin:0; font-size:1.6rem;';
  const snippet = document.createElement('p'); snippet.textContent = post.snippet; snippet.style = 'margin:0; color:var(--text);';
  const meta = document.createElement('div'); meta.textContent = post.category + ' — ' + new Date(post.date).toLocaleDateString(); meta.style = 'color:var(--text-2); font-size:.95rem;';

  const cta = document.createElement('a');
  cta.href = `#post-${post.id}`;
  cta.className = 'btn-outline';
  cta.textContent = 'VER CASO';
  cta.style = 'display:inline-block; margin-top:.5rem; padding:.6rem 1rem; border-radius:6px; border:1px solid var(--border); background:var(--surface); color:var(--text); text-decoration:none;';

  left.appendChild(h3);
  left.appendChild(meta);
  left.appendChild(snippet);
  left.appendChild(cta);

  // Right: large image
  const right = document.createElement('div');
  right.style = 'flex:0 0 520px; display:flex; justify-content:center; align-items:center;';
  const img = document.createElement('img'); img.src = post.image; img.alt = post.title; img.style = 'width:100%; height:260px; object-fit:cover; border-radius:6px;';
  right.appendChild(img);

  wrapper.appendChild(left);
  wrapper.appendChild(right);

  // keyboard: make Enter on wrapper focus the CTA
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { cta.focus(); cta.click(); }
  });

  return wrapper;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('blogs-list');
  if (!container) return;
  // order by date desc
  const ordered = BLOGS.slice().sort((a,b) => parseDate(b.date) - parseDate(a.date));
  ordered.forEach(post => { container.appendChild(createCard(post)); });
});
