import { Link } from "react-router-dom";
import "./FolderCard.css";

function FolderCard({ folder, count, canManage = false, deleting = false, onEdit, onDelete }) {
  return (
    <article className="folder-card card">
      <Link
        to={`/folders/${folder._id}`}
        className="folder-card-link"
        aria-label={`Open ${folder.name}`}
      >
        <span className="folder-dot" style={{ background: folder.colour }} />
        <h3 className="folder-name">{folder.name}</h3>
        {folder.description && <p className="muted folder-desc">{folder.description}</p>}
        {typeof count === "number" && (
          <p className="muted folder-count">
            {count} {count === 1 ? "resource" : "resources"}
          </p>
        )}
      </Link>

      {canManage && (
        <div className="folder-card-actions" aria-label={`${folder.name} actions`}>
          <button type="button" className="folder-action" onClick={onEdit}>
            Edit
          </button>
          <button
            type="button"
            className="folder-action folder-action-danger"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </article>
  );
}

export default FolderCard;
