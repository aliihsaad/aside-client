import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../lib/useFetch";
import PostComposer from "../components/PostComposer";
import PostCard from "../components/PostCard";
import "./FeedPage.css";

function FeedPage() {
  const { data: posts, error, loading, setData } = useFetch("/posts");
  const [feedError] = useState(null);

  const handleCreated = (post) => setData((prev) => [post, ...prev]);

  if (loading) return <p className="muted container">Loading…</p>;
  if (error) return <p className="form-error container">{error}</p>;

  return (
    <div className="container feed-page">
      <header className="feed-intro">
        <p className="page-kicker">Community space</p>
        <h1>The<br /><em>Commons.</em></h1>
        <p>Ideas, questions, updates, and anything worth sharing with the people around you.</p>
      </header>

      <div className="feed-layout">
        <aside className="feed-compose-column">
          <p className="feed-margin-note">Share a thought, ask a question, or start a conversation.</p>
          <PostComposer onCreated={handleCreated} />
        </aside>

        <main className="feed-stream">
          <div className="feed-stream-head">
            <span>Latest posts</span>
            <span>{posts.length} {posts.length === 1 ? "post" : "posts"}</span>
          </div>

          {feedError && <p className="form-error">{feedError}</p>}

          {posts.length === 0 && (
            <p className="muted feed-empty">Nothing here yet. Be the first to say something.</p>
          )}

          <section className="page-stack">
            {posts.map((post) => (
              <PostCard post={post} key={post._id}>
                <div className="post-actions">
                  <Link to={`/posts/${post._id}`} className="post-read">Open discussion</Link>
                </div>
              </PostCard>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}

export default FeedPage;
