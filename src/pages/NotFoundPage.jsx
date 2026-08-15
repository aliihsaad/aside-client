import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="empty-state">
      <h1 style={{ fontSize: "4rem" }}>404</h1>
      <p className="not-found-line">That page isn't on the shelf</p>
      <Link to="/" className="btn-primary nav-cta">Back to the library</Link>
    </div>
  );
}

export default NotFoundPage;