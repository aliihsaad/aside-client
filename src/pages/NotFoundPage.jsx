import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="container page-shell not-found-page">
      <section className="empty-state not-found-shell">
        <p className="page-kicker not-found-code">404</p>
        <h1 className="not-found-title">That page isn&apos;t on the shelf</h1>
        <p className="not-found-line muted">If it&apos;s missing, it may have moved. Head back to the library.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">Back to the library</Link>
          <Link to="/feed" className="btn-surface">Open The Commons</Link>
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;
