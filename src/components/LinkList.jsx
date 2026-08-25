import "./LinkList.css";

const LABELS = {
  repo: "Repository",
  demo: "Live demo",
  docs: "Documentation",
  file: "Source file",
};

function LinkList({ links = [] }) {
  if (!links.length) return null;

  return (
    <div className="link-list">
      {links.map((link, i) => (
        <a
          key={`${link.url}-${i}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-item card"
        >
          <span className="tag">{link.type}</span>
          <span className="link-title">{link.label || LABELS[link.type] || link.url}</span>
        </a>
      ))}
    </div>
  );
}

export default LinkList;