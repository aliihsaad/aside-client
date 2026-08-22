import { Link } from "react-router-dom";


export function renderMentions(content, mentions = []) {
  if (!mentions.length) return content;

  const idByUsername = new Map(mentions.map((m) => [m.username, m._id]));

  return content.split(/(@[a-z0-9_]+)/gi).map((part, i) => {
    if (!part.startsWith("@")) return part;

    const id = idByUsername.get(part.slice(1).toLowerCase());
    if (!id) return part;

    return (
      <Link to={`/profile/${id}`} key={i} className="mention">
        {part}
      </Link>
    );
  });
}