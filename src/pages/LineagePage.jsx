import { Link, useParams } from "react-router-dom";
import { useFetch } from "../lib/useFetch";
import Breadcrumbs from "../components/Breadcrumbs";
import "./LineagePage.css";

function LineageNode({ resource, depth = 0 }) {
  const { data } = useFetch(depth < 3 ? `/resources/${resource._id}/lineage` : null);
  const forks = data?.forks || [];

  return (
    <li className="lineage-node">
      <Link to={`/resources/${resource._id}`} className="lineage-card card">
        <img
          className="avatar avatar-sm"
          src={resource.owner?.avatarUrl || "https://placehold.co/32x32/1a1d2e/9aa0b8?text=?"}
          alt=""
        />
        <div>
          <span className="lineage-owner">{resource.owner?.name}</span>
          <span className="muted lineage-title">{resource.title}</span>
        </div>
      </Link>

      {forks.length > 0 && (
        <ul className="lineage-children">
          {forks.map((f) => (
            <LineageNode resource={f} depth={depth + 1} key={f._id} />
          ))}
        </ul>
      )}
    </li>
  );
}

function LineagePage() {
  const { resourceId } = useParams();
  const { data, error, loading } = useFetch(`/resources/${resourceId}/lineage`);

  if (loading) return <p className="muted container">Loading…</p>;
  if (error) return <p className="form-error container">{error}</p>;
  if (!data) return null;

  const { root, forks } = data;

  return (
    <div className="container page-shell lineage-page">
      <header className="page-hero lineage-hero">
        <Breadcrumbs
          items={[
            { label: "Library", to: "/library" },
            { label: root.title, to: `/resources/${root._id}` },
            { label: "Lineage" },
          ]}
        />
        <h1 className="section-title">Forked from {root.title}</h1>
        <p className="muted">
          {root.forkCount} {root.forkCount === 1 ? "fork" : "forks"} in the tree
        </p>
      </header>

      <ul className="lineage-tree">
        <li className="lineage-node">
          <Link to={`/resources/${root._id}`} className="lineage-card card is-root">
            <img
              className="avatar avatar-sm"
              src={root.owner?.avatarUrl || "https://placehold.co/32x32/1a1d2e/9aa0b8?text=?"}
              alt=""
            />
            <div>
              <span className="lineage-owner">{root.owner?.name}</span>
              <span className="muted lineage-title">{root.title}</span>
            </div>
          </Link>

          {forks.length > 0 && (
            <ul className="lineage-children">
              {forks.map((f) => <LineageNode resource={f} key={f._id} />)}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

export default LineagePage;
