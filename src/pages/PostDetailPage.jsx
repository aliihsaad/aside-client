import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";
import PostCard from "../components/PostCard";
import CommentList from "../components/CommentList";
import ImageUploadField from "../components/ImageUploadField";
import { uploadImage } from "../lib/uploadImage";
import "./PostDetailPage.css";

function PostDetailPage() {
  const { postId } = useParams();
  const { data: post, error, loading, setData } = useFetch(`/posts/${postId}`);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [actionError, setActionError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [imageChange, setImageChange] = useState({ file: null, remove: false });

  if (loading) return <p className="muted container">Loading…</p>;
  if (error) return <p className="form-error container">{error}</p>;
  if (!post) return null;

  const isMine = post.author._id === user._id;

  const startEdit = () => {
    setDraft(post.content);
    setImageChange({ file: null, remove: false });
    setEditing(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setActionError(null);
    setBusy(true);

    try {
      let imageUrl = imageChange.remove ? "" : post.imageUrl;
      if (imageChange.file) imageUrl = await uploadImage(imageChange.file);

      const { data } = await api.put(`/posts/${postId}`, {
        content: draft,
        tags: post.tags,
        imageUrl,
        linkedResource: post.linkedResource?._id ?? null,
      });
      setData(data);
      setEditing(false);
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't save that");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;

    setActionError(null);
    setBusy(true);

    try {
      await api.delete(`/posts/${postId}`);
      navigate("/feed");
    } catch (err) {
      setActionError(err.response?.data?.message || "Couldn't delete that");
      setBusy(false);
    }
  };

  return (
    <div className="container page-shell feed post-detail-page">
      <header className="page-hero">
        <p className="page-kicker">Post detail</p>
        <h1 className="section-title">Post</h1>
      </header>

      {editing ? (
        <form onSubmit={saveEdit} className="card stack">
          <textarea
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={2000}
          />
          <ImageUploadField
            id="edit-post-image"
            label="Post image"
            currentUrl={post.imageUrl}
            onChange={setImageChange}
            onError={setActionError}
            disabled={busy}
          />
          {actionError && <p className="form-error">{actionError}</p>}
          <div className="edit-actions">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setImageChange({ file: null, remove: false });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? (imageChange.file ? "Uploading…" : "Saving…") : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <PostCard post={post}>
          {isMine && (
            <div className="post-actions">
              <button type="button" onClick={startEdit}>Edit</button>
              <button type="button" className="btn-danger" onClick={handleDelete} disabled={busy}>
                Delete
              </button>
            </div>
          )}
        </PostCard>
      )}

      {actionError && !editing && <p className="form-error">{actionError}</p>}

      <CommentList
        endpoint="/post-comments"
        parentField="post"
        parentId={post._id}
      />
    </div>
  );
}

export default PostDetailPage;
