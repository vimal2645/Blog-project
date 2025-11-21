import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`https://blog-project-uvhu.onrender.com/api/articles/${id}?populate=*`)

        .then(res => {
          if (!res.ok) throw new Error('Article not found');
          return res.json();
        })
        .then(data => {
          // Support different response formats
          if (data.attributes) {
            setArticle(data);
          } else if (data.data && data.data.attributes) {
            setArticle(data.data);
          } else if (data) {
            setArticle(data);
          } else {
            setArticle(null);
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load article');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container">
        <div className="error">{error || 'Article not found'}</div>
        <Link href="/" className="back-link">← Back to Articles</Link>
      </div>
    );
  }

  const attr = article.attributes || article;
  
  // Extract image URL
  let imageUrl = '';
  if (attr.coverImage?.url) {
  imageUrl = `https://blog-project-uvhu.onrender.com${attr.coverImage.url}`;
} else if (attr.CoverImage?.data?.attributes?.url) {
  imageUrl = `https://blog-project-uvhu.onrender.com${attr.CoverImage.data.attributes.url}`;
}

  // Extract tags
  const tags = Array.isArray(attr.tags || attr.Tags)
    ? (attr.tags || attr.Tags).join(', ')
    : attr.tags || attr.Tags || '';

  // Format date
  const publishDate = new Date(attr.publishedAt || attr.PublishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container">
      <Link href="/" className="back-link">← Back to Articles</Link>
      
      <article className="article-detail">
        <header className="article-header">
          <h1 className="article-title">{attr.title || attr.Title}</h1>
          
          <div className="article-meta-info">
            <span className="meta-author">By {attr.author || attr.Author}</span>
            <span className="separator">•</span>
            <span className="meta-date">{publishDate}</span>
            <span className="separator">•</span>
            <span className="meta-read-time">{attr.readTime || attr.ReadTime} min read</span>
            {attr.category && (
              <>
                <span className="separator">•</span>
                <span className="meta-category">{attr.category}</span>
              </>
            )}
          </div>
        </header>

        {imageUrl && (
          <div className="article-image-wrapper">
            <img
              src={imageUrl}
              alt={attr.title || attr.Title}
              className="article-image"
            />
          </div>
        )}

        <div className="article-body">
          <div className="article-content">
            {attr.content || attr.Content}
          </div>

          {tags && (
            <div className="article-tags">
              <strong>Tags:</strong> {tags}
            </div>
          )}
        </div>

        <footer className="article-footer">
          <Link href="/" className="back-to-list-btn">
            ← Back to All Articles
          </Link>
        </footer>
      </article>
    </div>
  );
}
