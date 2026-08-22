import { Link } from "react-router-dom";
import "./ResourceCard.css";

function ResourceCard({ resource }) {
  const { owner } = resource;

  return (
    <Link to={`/resources/${resource._id}`} className="resource-card card" data-category={resource.category}>
      <div className="resource-card-head">
        <span className="resource-category">{resource.category}</span>
        {resource.visibility === "private" && <span className="pill pill-draft">Draft</span>}
        {resource.forkedFrom && <span className="pill pill-fork">forked</span>}
      </div>

      <div className="resource-card-copy">
        <h3 className="resource-title">{resource.title}</h3>
        {resource.description && (
          <p className="muted resource-desc">{resource.description}</p>
        )}
      </div>

      {resource.stack?.length > 0 && (
        <div className="tag-row">
          {resource.stack.slice(0, 3).map((s) => <span className="tag" key={s}>{s}</span>)}
        </div>
      )}

      <footer className="resource-foot">
        {owner && (
          <span className="resource-owner">
            <img
              className="avatar avatar-sm"
              src={owner.avatarUrl || "https://placehold.co/32x32/1a1d2e/9aa0b8?text=?"}
              alt=""
            />
            {owner.name}
          </span>
        )}

        <span className="muted resource-counts">
          {resource.forkCount > 0 && `${resource.forkCount} forks`}
          {resource.forkCount > 0 && resource.bookmarkCount > 0 && " · "}
          {resource.bookmarkCount > 0 && `${resource.bookmarkCount} saved`}
        </span>
      </footer>
      <span className="resource-arrow" aria-hidden="true">↗</span>
    </Link>
  );
}

export default ResourceCard;
