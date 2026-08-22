import { useState } from "react";
import api from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";
import { uploadImage } from "../lib/uploadImage";
import ImageUploadField from "./ImageUploadField";
import "./PostComposer.css";

function PostComposer({ onCreated }) {
  const { user } = useAuthContext();
  const [content, setContent] = useState("");
  const [linkedResource, setLinkedResource] = useState("");
  const { data: myResources } = useFetch(`/resources?owner=${user._id}`);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const [imageChange, setImageChange] = useState({ file: null, remove: false });
  const [imageResetKey, setImageResetKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError(null);
    setPosting(true);

    try {
      const imageUrl = imageChange.file ? await uploadImage(imageChange.file) : "";
      const { data } = await api.post("/posts", {
        content,
        linkedResource: linkedResource || null,
        imageUrl,
      });
      setContent("");
      setLinkedResource("");
      setImageChange({ file: null, remove: false });
      setImageResetKey((value) => value + 1);
      onCreated(data);          // hand the new post up to the feed
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't post that");
    } finally {
      setPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card stack composer">
      <div className="composer-main">
        <img
          className="avatar composer-avatar"
          src={user.avatarUrl || "https://placehold.co/40x40/1a1d2e/9aa0b8?text=?"}
          alt=""
        />
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What would you like to share?"
          maxLength={2000}
        />
      </div>

      <ImageUploadField
        id="post-image"
        label="Add an image"
        onChange={setImageChange}
        onError={setError}
        resetKey={imageResetKey}
        disabled={posting}
      />

      {myResources?.length > 0 && (
        <select
          value={linkedResource}
          onChange={(e) => setLinkedResource(e.target.value)}
          aria-label="Attach a resource"
        >
          <option value="">Attach a resource…</option>
          {myResources.map((r) => (
            <option key={r._id} value={r._id}>{r.title}</option>
          ))}
        </select>
      )}

      {error && <p className="form-error">{error}</p>}

      <div className="composer-foot">
        <span className="muted composer-count">{content.length}/2000</span>
        <button type="submit" className="btn-primary" disabled={posting || !content.trim()}>
          {posting ? (imageChange.file ? "Uploading…" : "Posting…") : "Post"}
        </button>
      </div>
    </form>
  );
}

export default PostComposer;
