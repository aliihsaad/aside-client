import "./ResourceFilters.css";

const CATEGORIES = ["component", "snippet", "guide", "spec", "checklist", "link", "pattern"];

function ResourceFilters({ filters, onChange, onClear }) {
  const toggleTag = (tag) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: next });
  };

  const toggleCategory = (category) =>
    onChange({ ...filters, category: filters.category === category ? "" : category });

  const hasAny = filters.category || filters.tags.length > 0;

  return (
    <aside className="filters">
      <div className="page-head">
        <h2 className="filters-head">Filter</h2>
        {hasAny && (
          <button type="button" className="link-button" onClick={onClear}>Clear</button>
        )}
      </div>

      <fieldset className="filter-group">
        <legend>Category</legend>
        <div className="chip-list">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c}
              className={`chip${filters.category === c ? " chip-active" : ""}`}
              onClick={() => toggleCategory(c)}
              aria-pressed={filters.category === c}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Tags</legend>
        <div className="tag-row">
          {["react", "auth", "css", "mongoose", "express", "deployment"].map((t) => (
            <button
              type="button"
              key={t}
              className={`tag${filters.tags.includes(t) ? " tag-active" : ""}`}
              onClick={() => toggleTag(t)}
              aria-pressed={filters.tags.includes(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>
    </aside>
  );
}

export default ResourceFilters;
