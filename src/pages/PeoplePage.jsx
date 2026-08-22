import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../lib/useFetch";
import "./PeoplePage.css";

function PeoplePage() {
  const [search, setSearch] = useState("");
  const { data: users, error, loading } = useFetch(
    `/users${search ? `?search=${encodeURIComponent(search)}` : ""}`
  );

  return (
    <div className="container page-shell people-page">
      <header className="directory-head">
        <div>
          <p className="page-kicker">Who is in the room</p>
          <h1>Cohort<br /><em>directory.</em></h1>
        </div>
        <label className="directory-search">
          <span>Find a person or skill</span>
          <input
            type="search"
            placeholder="Name, React, CSS…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </header>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="form-error">{error}</p>}

      {users && users.length === 0 && (
        <p className="muted">Nobody matches “{search}”.</p>
      )}

      {users && users.length > 0 && (
        <div className="people-grid">
          {users.map((u, index) => (
            <Link to={`/profile/${u._id}`} key={u._id} className="person-card card">
              <span className="person-index">{String(index + 1).padStart(2, "0")}</span>
              <img
                className="avatar avatar-lg"
                src={u.avatarUrl || "https://placehold.co/96x96/1a1d2e/9aa0b8?text=?"}
                alt=""
              />
              <div className="person-copy">
                <h2 className="person-name">{u.name}</h2>
                <p className="muted">@{u.username}</p>
              </div>

              {u.skills?.length > 0 && (
                <div className="tag-row">
                  {u.skills.slice(0, 3).map((s) => (
                    <span className="tag" key={s}>{s}</span>
                  ))}
                </div>
              )}
              <span className="person-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PeoplePage;
