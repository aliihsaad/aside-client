import { Link } from "react-router-dom";
import { useFetch } from "../lib/useFetch";
import "./SavedPage.css";

function SavedPage() {
  const { data: bookmarks, error, loading } = useFetch("/bookmarks/me");

  if (loading) return <p className="muted container">Loading…</p>;
  if (error) return <p className="form-error container">{error}</p>;

  return (
    <div className="container page-shell">
      <header className="page-hero">
        <p className="page-kicker">For later</p>
        <h1 className="section-title">Saved resources</h1>
        <p className="muted">Items you bookmarked to review again.</p>
      </header>

      {bookmarks.length === 0 && (
        <p className="muted">Nothing saved yet. Hit Save on anything worth finding again.</p>
      )}

      <ul className="saved-list">
        {bookmarks.map(({ _id, resource }) => (
          <li key={_id}>
            <Link to={`/resources/${resource._id}`} className="saved-row">
              <span className="tag">{resource.category}</span>
              <span className="saved-title">{resource.title}</span>
              <span className="muted saved-owner">{resource.owner?.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedPage;
