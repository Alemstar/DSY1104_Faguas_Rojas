import { useLoaderData } from 'react-router-dom'
import BlogArticle from '../../components/blogDetail/BlogArticle'
import './blogDetail.css'

export default function BlogDetail() {
  const { article } = useLoaderData()

  return (
    <div className="blog-detail-page">
      <BlogArticle article={article} />
    </div>
  )
}
