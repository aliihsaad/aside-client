import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthContext } from "../lib/useAuthContext";
import "./Sidebar.css";


const ICON_PROPS = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const LINKS = [
  {
    to: "/library",
    label: "Library",
    end: true,
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
        <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    to: "/feed",
    label: "The Commons",
    icon: (
      <svg {...ICON_PROPS}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    to: "/people",
    label: "People",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/saved",
    label: "Saved",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.classList.add("menu-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) return null;

  return (
    <header id="sidebar" className="sidebar">
      {open && (
        <button
          type="button"
          className="menu-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <div className="sidebar-inner">
        <Link to="/" className="brand">
          <strong>Aside.</strong>
          <small>Cohort index</small>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
        </button>

        <div id="mobile-navigation" className={`sidebar-panel${open ? " is-open" : ""}`}>
          <nav className="sidebar-nav" aria-label="Primary navigation">
            {LINKS.map(({ to, label, end, icon }, index) => (
              <NavLink key={to} to={to} end={end} title={label}>
                <span className="nav-index">0{index + 1}</span>
                {icon}
                <span className="nav-label">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-tools">
            <Link to="/resources/new" className="quick-link">
              <span aria-hidden="true">+</span>
              <span>Add resource</span>
            </Link>
            <NavLink to={`/profile/${user._id}`} className="sidebar-user" title="My shelf">
              <img
                className="avatar avatar-sm"
                src={user.avatarUrl || "https://placehold.co/32x32/1a1d2e/9aa0b8?text=?"}
                alt=""
              />
              <span className="sidebar-user-copy">
                <strong>{user.name}</strong>
                <small>My shelf</small>
              </span>
            </NavLink>
            <button type="button" className="logout-button" onClick={logout}>Log out</button>
          </div>
        </div>
      </div>
    </header>
  );
}
