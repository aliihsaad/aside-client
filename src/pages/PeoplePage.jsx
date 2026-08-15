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
    <div className="container">
      <div className="page-head">
        <h1>People</h1>
        <input
          type="search"
          placeholder="Search by name or skill"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="page-search"
        />
      </div>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="form-error">{error}</p>}

      {users && users.length === 0 && (
        <p className="muted">Nobody matches “{search}”.</p>
      )}

      {users && users.length > 0 && (
        <div className="people-grid">
          {users.map((u) => (
            <Link to={`/profile/${u._id}`} key={u._id} className="person-card card">
              <img
                className="avatar avatar-lg"
                src={u.avatarUrl || "https://placehold.co/96x96/171a16/8b9086?text=?"}
                alt=""
              />
              <h2 className="person-name">{u.name}</h2>
              <p className="muted">@{u.username}</p>

              {u.skills?.length > 0 && (
                <div className="tag-row">
                  {u.skills.slice(0, 3).map((s) => (
                    <span className="tag" key={s}>{s}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PeoplePage;