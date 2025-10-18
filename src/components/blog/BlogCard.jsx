export default function BlogCard({ article }) {
  const resolveImage = (relativePath) => {
    if (!relativePath) return null
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href
    } catch (_) {
      return relativePath
    }
  }

  return (
    <article className="blog-card">
      <div className="blog-card-content">
        <h2 className="blog-card-title">{article.title}</h2>
        
        <p className="blog-card-meta">
          {article.category} — {article.date}
        </p>
        
        <p className="blog-card-description">
          {article.description}
        </p>
        
        <button className="blog-card-button">
          VER CASO
        </button>
      </div>

      <div className="blog-card-image">
        <img 
          src={resolveImage(article.image)} 
          alt={article.title}
        />
      </div>
    </article>
  )
}
