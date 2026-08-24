import { Link, useParams } from "react-router-dom";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";
import ResourceCard from "../components/ResourceCard";
import "./FolderDetailPage.css";

function FolderDetailPage() {
  const { folderId } = useParams();
  const { user } = useAuthContext();

  const {
    data: folder,
    error: folderError,
    loading: folderLoading,
  } = useFetch(`/folders/${folderId}`);
  const {
    data: resources,
    error: resourcesError,
    loading: resourcesLoading,
  } = useFetch(`/resources?folder=${folderId}`);

  const isMine = folder?.owner?._id === user._id;
  const resourceCount = resources?.length || 0;
  const folderName = folder?.name || "Folder";
  const folderOwner = folder?.owner?.name || "Anonymous";

  if (folderLoading || resourcesLoading) {
    return <p className="muted container">Loading…</p>;
  }

  if (folderError || resourcesError) {
    return <p className="form-error container">{folderError || resourcesError}</p>;
  }

  return (
    <div className="container page-shell folder-detail-page">
      <header className="page-hero folder-hero">
        <p className="page-kicker">Folder</p>
        <h1 className="section-title">{folderName}</h1>
        <p className="muted folder-meta">
          {resourceCount} {resourceCount === 1 ? "resource" : "resources"} · {folderOwner}
        </p>
        {isMine && (
          <Link to={`/resources/new?folder=${folderId}`} className="btn-primary folder-cta">
            Add to this folder
          </Link>
        )}
      </header>

      {resources?.length === 0 && (
        <p className="muted folder-empty">This folder is empty.</p>
      )}

      <div className="resource-grid">
        {resources?.map((r) => <ResourceCard resource={r} key={r._id} />)}
      </div>
    </div>
  );
}

export default FolderDetailPage;
