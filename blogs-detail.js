import { BLOGS } from './blogs-data.js';

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function renderBlogDetail(post) {
  const container = document.getElementById('blog-detail-container');
  if (!container || !post) {
    container.innerHTML = '<p>Artículo no encontrado.</p>';
    return;
  }
  const showRecipe = post.category === 'Recetas' || post.category === 'Tendencias';
  container.innerHTML = `
    <div class="blog-main">
      <article>
        <header class="blog-header">
          <h1 class="blog-title">${post.title}</h1>
          <div class="blog-meta">Por ${post.author || 'Autor desconocido'} | <time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time></div>
        </header>
        <figure class="blog-figure">
          <img src="${post.image}" alt="${post.imageAlt || post.title}" />
          <figcaption>${post.figcaption || post.title}</figcaption>
        </figure>
        ${post.story ? `<section class="blog-section"><div class="blog-story">${post.story}</div></section>` : ''}
        ${showRecipe && post.ingredients && post.ingredients.length > 0 ? `
          <section class="blog-section">
            <h2>Ingredientes</h2>
            <ul>
              ${post.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
          </section>
        ` : ''}
        ${showRecipe && post.steps && post.steps.length > 0 ? `
          <section class="blog-section">
            <h2>Paso a paso</h2>
            <ol>
              ${post.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </section>
        ` : ''}
        <nav class="blog-nav">
          <a href="recetasBlogs.html" rel="noopener noreferrer">← Volver a Recetas</a>
        </nav>
      </article>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getQueryParam('id');
  const post = BLOGS.find(b => String(b.id) === String(id));
  renderBlogDetail(post);
});
