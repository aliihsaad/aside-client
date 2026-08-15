import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BookOpen, Bookmark, LogOut, Menu, Rss, User, Users, X } from "lucide-react";
import { useAuthContext } from "../lib/useAuthContext";
import "./Sidebar.css"

const LINKS = [
  { to: "/feed", label: "Feed", icon: Rss },
  { to: "/", label: "Library", end: true, icon: BookOpen },
  { to: "/people", label: "People", icon: Users },
  { to: "/saved", label: "Saved", icon: Bookmark },
];

export default function Sidebar() {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!user) return null;

  return (
    <>
      <button
        type="button"
        className="drawer-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="sidebar"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="drawer-backdrop" onClick={() => setOpen(false)} />
      )}

      <aside id="sidebar" className={`sidebar${open ? " is-open" : ""}`}>
        <Link to="/" className="brand">Aside</Link>

        <nav className="sidebar-nav">
          {LINKS.map(({ to, label, end, icon: Icon }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          <NavLink to={`/profile/${user._id}`}>
            <User size={18} />
            My shelf
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-user">{user.name}</span>
          <button type="button" onClick={logout}>
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}