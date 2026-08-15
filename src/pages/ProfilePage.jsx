import { Link, useParams } from "react-router-dom";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";
import "./ProfilePage.css";

function ProfilePage() {
  const { userId } = useParams();
  const { user: me } = useAuthContext();
  const { data: user, error, loading } = useFetch(`/users/${userId}`);

  const isMe = me?._id === userId;

  if (loading) return <p className="muted container">Loading…</p>;
  if (error) return <p className="form-error container">{error}</p>;
  if (!user) return null;

  return (
    <div className="container">
      <header className="profile-head">
        <img
          className="avatar avatar-xl"
          src={user.avatarUrl || "https://placehold.co/128x128/171a16/8b9086?text=?"}
          alt=""
        />

        <div className="profile-id">
          <h1>{user.name}</h1>
          <p className="muted">@{user.username}</p>
          {user.bio && <p className="profile-bio">{user.bio}</p>}

          {user.skills?.length > 0 && (
            <div className="tag-row">
              {user.skills.map((s) => (
                <span className="tag" key={s}>{s}</span>
              ))}
            </div>
          )}
        </div>

        {isMe && (
          <Link to="/profile/edit" className="btn-primary nav-cta">
            Edit profile
          </Link>
        )}
      </header>

      {/* Day 10: this user's folders go here */}
    </div>
  );
}

export default ProfilePage;