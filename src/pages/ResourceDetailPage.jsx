import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import api from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";
import CodeBlock from "../components/CodeBlock";
import CommentList from "../components/CommentList";
import VisibilityToggle from "../components/VisibilityToggle";
import LinkList from "../components/LinkList";
import ForkButton from "../components/ForkButton";
import SaveButton from "../components/SaveButton";
import "./ResourceDetailPage.css";

function ResourceDetailPage() {
  const { resourceId } = useParams();
  const { data: resource, error, loading, setData } = useFetch(`/resources/${resourceId}`);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState(null);

  if (loading) return <p className="muted container">Loading…</p>;
  if (error) return <p className="form-error container">{error}</p>;
  if (!resource) return null;

  const isMine = resource.owner._id === user._id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this resource? Forks of it will remain.")) return;

    try {
      await api.delete(`/resources/${resourceId}`);
      navigate("/library");
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't delete that");
    }
  };

  const updateBookmarkCount = (delta) =>
    setData((prev) => ({ ...prev, bookmarkCount: prev.bookmarkCount + delta }));

  return (
    <div className="container page-shell resource-page">
      <header className="page-hero">
        <p className="page-kicker">Resource detail</p>
        <span className="tag">{resource.category}</span>
        <h1 className="resource-heading section-title">{resource.title}</h1>
        {resource.description && <p className="muted">{resource.description}</p>}
      </header>

      {isMine && resource.visibility === "private" && (
        <div className="draft-banner">
          <span>Only you can see this.</span>
          <VisibilityToggle resource={resource} onChange={setData} />
        </div>
      )}

      <div className="resource-layout">
        <main>
          {resource.forkedFrom && (
            <p className="forked-from">
              Forked from{" "}
              <Link to={`/resources/${resource.forkedFrom._id}`}>
                {resource.forkedFrom.owner?.name}'s {resource.forkedFrom.title}
              </Link>
            </p>
          )}

          {resource.stack?.length > 0 && (
            <div className="tag-row">
              {resource.stack.map((s) => <span className="tag" key={s}>{s}</span>)}
            </div>
          )}

          {resource.body && <div className="resource-body">{resource.body}</div>}

          {resource.code && <CodeBlock code={resource.code} language={resource.language} />}

          {actionError && <p className="form-error">{actionError}</p>}

          <CommentList
            endpoint="/resource-comments"
            parentField="resource"
            parentId={resource._id}
          />
        </main>

        <aside className="resource-aside">
          <div className="card owner-card">
            <img
              className="avatar avatar-lg"
              src={resource.owner.avatarUrl || "https://placehold.co/64x64/1a1d2e/9aa0b8?text=?"}
              alt=""
            />
            <div>
              <p className="owner-name">{resource.owner.name}</p>
              <Link to={`/profile/${resource.owner._id}`} className="muted">View shelf</Link>
            </div>
          </div>

          <dl className="meta-list card">
            <dt>Folder</dt>
            <dd>{resource.folder?.name || "—"}</dd>
            <dt>Forks</dt>
            <dd>{resource.forkCount}</dd>
            <dt>Saved</dt>
            <dd>{resource.bookmarkCount}</dd>
            <dt>Updated</dt>
            <dd>{new Date(resource.updatedAt).toLocaleDateString()}</dd>
          </dl>

          <LinkList links={resource.links} />

          {resource.forkCount > 0 && (
            <Link to={`/resources/${resource._id}/lineage`} className="btn-block">
              See {resource.forkCount} {resource.forkCount === 1 ? "fork" : "forks"}
            </Link>
          )}

          {!isMine && (
            <SaveButton
              resourceId={resource._id}
              initiallySaved={resource.isSaved}
              onCountChange={updateBookmarkCount}
            />
          )}

          {!isMine && <ForkButton resource={resource} />}

          {isMine && (
            <div className="aside-actions">
              <Link to={`/resources/${resource._id}/edit`} className="btn-block">Edit</Link>
              <button type="button" className="btn-block btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default ResourceDetailPage;
