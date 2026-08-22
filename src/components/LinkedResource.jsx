import { Link } from "react-router-dom";
import "./LinkedResource.css";

function LinkedResource({ resource }) {
  if (!resource) return null;

  return (
    <Link to={`/resources/${resource._id}`} className="linked-resource">
      <span className="tag">{resource.category}</span>
      <span className="linked-title">{resource.title}</span>
      {resource.description && (
        <span className="muted linked-desc">{resource.description}</span>
      )}
    </Link>
  );
}

export default LinkedResource;