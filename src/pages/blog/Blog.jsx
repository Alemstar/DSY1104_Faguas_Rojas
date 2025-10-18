import { useLoaderData } from 'react-router-dom'
import BlogCard from '../../components/blog/BlogCard'
import './blog.css'

export default function Blog() {
  const { articles } = useLoaderData()

  return (
    <div className="blog-page">
      <h1 className="blog-page-title">Noticias importantes</h1>
      
      <div className="blog-articles-container">
        {articles.map(article => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
