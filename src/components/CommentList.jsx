import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuthContext } from "../lib/useAuthContext";
import "./CommentList.css";

function CommentList({ endpoint, parentField, parentId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const { user } = useAuthContext();

  useEffect(() => {
    let cancelled = false;

    api
      .get(`${endpoint}?${parentField}=${parentId}`)
      .then((res) => { if (!cancelled) setComments(res.data); })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Couldn't load comments");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [endpoint, parentField, parentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError(null);
    setPosting(true);

    try {
      const { data } = await api.post(endpoint, {
        content,
        [parentField]: parentId,
      });
      setComments((prev) => [...prev, data]);
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't post that");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete that");
    }
  };

  return (
    <section className="comments">
      <h2 className="comments-head">
        {loading ? "Comments" : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
      </h2>

      {error && <p className="form-error">{error}</p>}

      <ul className="comment-list">
        {comments.map((c) => (
          <li className="comment" key={c._id}>
            <img
              className="avatar avatar-sm"
              src={c.author.avatarUrl || "https://placehold.co/32x32/171a16/8b9086?text=?"}
              alt=""
            />
            <div className="comment-body">
              <Link to={`/profile/${c.author._id}`} className="comment-author">
                {c.author.name}
              </Link>
              <p className="comment-text">{c.content}</p>
            </div>

            {c.author._id === user._id && (
              <button
                type="button"
                className="comment-delete"
                onClick={() => handleDelete(c._id)}
                aria-label="Delete comment"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment"
          maxLength={1000}
        />
        <button type="submit" className="btn-primary" disabled={posting || !content.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}

export default CommentList;
