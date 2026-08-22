import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../lib/useFetch";
import ResourceCard from "../components/ResourceCard";
import ResourceFilters from "../components/ResourceFilters";
import "./LibraryPage.css";

const EMPTY_FILTERS = { category: "", tags: [] };

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("");

  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (filters.category) params.set("category", filters.category);
  if (sort) params.set("sort", sort);
  filters.tags.forEach((t) => params.append("tag", t));

  const url = `/resources${params.toString() ? `?${params}` : ""}`;
  const { data: resources, error, loading } = useFetch(url);

  return (
    <div className="container page-shell library-page">
      <header className="library-intro">
        <div>
          <p className="page-kicker">The cohort archive / 2026</p>
          <h1>Shared<br /><em>library.</em></h1>
        </div>
        <div className="library-intro-note">
          <p>Working code, sharp explanations, and the small discoveries worth keeping.</p>
          <Link to="/resources/new" className="btn-primary nav-cta">+ Add resource</Link>
        </div>
      </header>

      <div className="library-controls">
        <label className="library-search">
          <span>Search the index</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="React auth, deployment, snippets…"
          />
        </label>
        <label className="library-sort">
          <span>Order by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
            <option value="">Newest first</option>
            <option value="forks">Most forked</option>
            <option value="saves">Most saved</option>
          </select>
        </label>
      </div>

      <div className="library-layout">
        <ResourceFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />

        <div className="library-results">
          <div className="library-results-head">
            <span>{loading ? "Reading index…" : `${resources?.length ?? 0} entries`}</span>
            <span>Open an entry to read, save, or fork it.</span>
          </div>
          {loading && <p className="muted">Loading…</p>}
          {error && <p className="form-error">{error}</p>}

          {resources?.length === 0 && (
            <p className="muted">Nothing matches those filters.</p>
          )}

          <div className="resource-grid">
            {resources?.map((r) => <ResourceCard resource={r} key={r._id} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryPage;
