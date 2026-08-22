import { Link } from "react-router-dom";
import LinkedResource from "./LinkedResource";
import { renderMentions } from "../lib/renderMentions";
import "./PostCard.css";

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (seconds < 60) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function PostCard({ post, children }) {
  const { author } = post;

  return (
    <article className="post-card card">
      <header className="post-head">
        <Link to={`/profile/${author._id}`}>
          <img
            className="avatar"
            src={author.avatarUrl || "https://placehold.co/40x40/1a1d2e/9aa0b8?text=?"}
            alt=""
          />
        </Link>

        <div>
          <Link to={`/profile/${author._id}`} className="post-author">
            {author.name}
          </Link>
          <span className="muted post-meta">
            @{author.username} · {timeAgo(post.createdAt)}
          </span>
        </div>
      </header>

      <p className="post-body">{renderMentions(post.content, post.mentions)}</p>

      <LinkedResource resource={post.linkedResource} />

      {post.imageUrl && (
        <img
          className="post-image"
          src={post.imageUrl}
          alt={`Shared by ${author.name}`}
          loading="lazy"
        />
      )}

      {post.tags?.length > 0 && (
        <div className="tag-row">
          {post.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
        </div>
      )}

      {children}
    </article>
  );
}

export default PostCard;
