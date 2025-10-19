import { Link } from 'react-router-dom'

export default function BlogArticle({ article }) {
  const resolveImage = (relativePath) => {
    if (!relativePath) return null
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href
    } catch (_) {
      return relativePath
    }
  }

  return (
    <article className="blog-article">
      {/* Header */}
      <header className="blog-article-header">
        <h1 className="blog-article-title">{article.title}</h1>
        <p className="blog-article-meta">
          Por {article.author} | {article.date}
        </p>
      </header>

      {/* Imagen principal */}
      <div className="blog-article-image">
        <img 
          src={resolveImage(article.image)} 
          alt={article.title}
        />
        <p className="blog-article-caption">{article.description}</p>
      </div>

      {/* Contenido */}
      <div className="blog-article-content">
        {/* Ingredientes */}
        {article.content.ingredients && article.content.ingredients.length > 0 && (
          <section className="blog-section">
            <h2 className="blog-section-title">Ingredientes</h2>
            <ul className="blog-list">
              {article.content.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Paso a paso */}
        {article.content.steps && article.content.steps.length > 0 && (
          <section className="blog-section">
            <h2 className="blog-section-title">Paso a paso</h2>
            <ol className="blog-list blog-list-numbered">
              {article.content.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {/* Volver */}
      <Link to="/recetas-blogs" className="blog-back-link">
        ← Volver a Recetas
      </Link>
    </article>
  )
}
