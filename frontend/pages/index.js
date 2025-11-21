import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('https://blog-project-uvhu.onrender.com/api/articles?populate=*')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setArticles(data);
        else if (Array.isArray(data.data)) setArticles(data.data);
        else setArticles([]);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load articles.');
        setLoading(false);
      });
  }, []);

  // Gather all categories for dropdown
  const categorySet = new Set();
  articles.forEach(article => {
    const attr = article.attributes || article;
    const category = attr.category || attr.Category || 'Uncategorized';
    categorySet.add(category);
  });
  const categories = ['All', ...Array.from(categorySet)];

  // Filtering logic
  const filtered = articles.filter(article => {
    const attr = article.attributes || article;
    const tags = Array.isArray(attr.tags || attr.Tags)
      ? (attr.tags || attr.Tags).join(', ')
      : (attr.tags || attr.Tags || '');
    const category = attr.category || attr.Category || 'Uncategorized';
    const matchesSearch =
      attr.title.toLowerCase().includes(search.toLowerCase()) ||
      tags.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="container">Loading articles...</div>;
  if (error) return <div className="container">{error}</div>;

  return (
    <div className="container">
      <header className="page-header">
        <h1>Blog Articles</h1>
        <p className="subtitle">Discover stories, thinking, and expertise</p>
      </header>

      {/* Filter/Search Box */}
      <div className="filters-bar" style={{ marginBottom: 30, display: "flex", gap: 16, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by title or tags"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "10px 16px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #222",
            background: "#222",
            color: "#eee"
          }}
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{
            padding: "10px 16px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #222",
            background: "#222",
            color: "#eee"
          }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="articles-grid">
        {filtered.length > 0 ? (
          filtered.map(article => {
            const attr = article.attributes || article;
            let imageUrl = '';
            if (attr.coverImage?.url) imageUrl = `https://blog-project-uvhu.onrender.com${attr.coverImage.url}`;
            else if (attr.CoverImage?.data?.attributes?.url) imageUrl = `https://blog-project-uvhu.onrender.com${attr.CoverImage.data.attributes.url}`;

            const tags = Array.isArray(attr.tags || attr.Tags)
              ? (attr.tags || attr.Tags).join(', ')
              : (attr.tags || attr.Tags || '');
            const category = attr.category || attr.Category || '';
            return (
              <article key={article.id} className="article-card">
                {imageUrl && (
                  <div className="card-image-wrapper">
                    <img src={imageUrl} alt={attr.title || attr.Title} className="card-image" />
                  </div>
                )}
                <div className="card-content">
                  <h2 className="card-title">{attr.title || attr.Title}</h2>
                  <p className="card-excerpt">{attr.excerpt || attr.Excerpt}</p>
                  <div className="card-meta">
                    <span className="author">By {attr.author || attr.Author}</span>
                    <span className="separator">•</span>
                    <span className="read-time">{attr.readTime || attr.ReadTime} min read</span>
                  </div>
                  {tags && (
                    <div className="card-tags">
                      <span className="tags-label">Tags:</span> {tags}
                    </div>
                  )}
                  {category && (
                    <div className="card-category">
                      <span className="category-label">Category:</span> {category}
                    </div>
                  )}
                  <Link href={`/articles/${article.id}`} className="read-more-btn">Read More →</Link>
                </div>
              </article>
            );
          })
        ) : (
          <div className="no-articles">
            <p>No articles found for your search/filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
