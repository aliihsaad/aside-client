import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";
import { uploadDocument } from "../lib/uploadDocument";
import "./ResourceFormPage.css";

const CATEGORIES = ["component", "snippet", "guide", "spec", "checklist", "link", "pattern"];
const LINK_TYPES = ["repo", "demo", "docs", "file"];

const EMPTY = {
  title: "",
  description: "",
  body: "",
  code: "",
  language: "",
  category: "snippet",
  folder: "",
  tags: [],
  stack: [],
  links: [],
  visibility: "private",
};

function ResourceFormPage() {
  const { resourceId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isEdit = Boolean(resourceId);
  const pageTitle = isEdit ? "Edit resource" : "New resource";

  const { data: existing } = useFetch(isEdit ? `/resources/${resourceId}` : null);
  const { data: folders } = useFetch(`/folders/user/${user._id}`);

  const [form, setForm] = useState({
    ...EMPTY,
    folder: searchParams.get("folder") || "",
  });
  const [tagDraft, setTagDraft] = useState("");
  const [linkDraft, setLinkDraft] = useState({ type: "repo", url: "", label: "" });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const documentInputRef = useRef(null);

  useEffect(() => {
    if (existing) {
      setForm({ ...EMPTY, ...existing, folder: existing.folder?._id || existing.folder });
    }
  }, [existing]);

  // Default the folder select to the first one once folders arrive
  useEffect(() => {
    if (folders?.length && !form.folder) {
      setForm((prev) => ({ ...prev, folder: folders[0]._id }));
    }
  }, [folders, form.folder]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addTag = (field, draft, setDraft) => {
    const value = draft.trim();
    if (!value || form[field].includes(value)) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value] }));
    setDraft("");
  };

  const removeTag = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((v) => v !== value) }));

  const addLink = () => {
    const url = linkDraft.url.trim();
    if (!url) return;

    if (!url.startsWith("https://")) {
      setError("Links must start with https://");
      return;
    }

    setForm((prev) => ({ ...prev, links: [...prev.links, { ...linkDraft, url }] }));
    setLinkDraft({ type: "repo", url: "", label: "" });
    setError(null);
  };

  const removeLink = (index) =>
    setForm((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));

  const handleDocumentUpload = async () => {
    setError(null);
    setUploadingDocument(true);

    try {
      const url = await uploadDocument(documentFile);
      setForm((prev) => ({
        ...prev,
        links: [
          ...prev.links,
          { type: "docs", url, label: documentFile.name },
        ],
      }));
      setDocumentFile(null);
      if (documentInputRef.current) documentInputRef.current.value = "";
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Couldn't upload that document");
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const { data } = isEdit
        ? await api.put(`/resources/${resourceId}`, form)
        : await api.post("/resources", form);
      navigate(`/resources/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save that");
    } finally {
      setSaving(false);
    }
  };

  if (folders && folders.length === 0) {
    return (
      <div className="container page-shell form-page resource-form-page">
        <header className="page-hero">
          <p className="page-kicker">Resource</p>
          <h1 className="section-title">{pageTitle}</h1>
          <p className="muted">
            You need a folder first — resources live in a shelf.
          </p>
        </header>
        <div className="card stack">
          <p className="muted">
            Create your first folder from{" "}
            <Link to={`/profile/${user._id}`} className="section-link">
              your profile
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-shell form-page resource-form-page">
      <header className="page-hero">
        <p className="page-kicker">Resource</p>
        <h1 className="section-title">{pageTitle}</h1>
        <p className="muted">
          Share one high-signal artifact with your cohort: code, snippets, or patterns.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="card stack resource-form-card">
        <fieldset className="form-section">
          <legend>What it is</legend>

          <div>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} required maxLength={120} />
          </div>

          <div>
            <label htmlFor="description">One-line description</label>
            <input id="description" name="description" value={form.description} onChange={handleChange} maxLength={300} />
          </div>

          <div className="field-row">
            <div>
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="folder">Folder</label>
              <select id="folder" name="folder" value={form.folder} onChange={handleChange} required>
                {folders?.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="body">Explanation</label>
            <textarea
              id="body"
              name="body"
              rows={6}
              value={form.body}
              onChange={handleChange}
              placeholder="What it does, when to use it, what caught you out."
            />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>The code</legend>

          <div>
            <label htmlFor="language">Language</label>
            <input id="language" name="language" value={form.language} onChange={handleChange} placeholder="jsx, js, css…" />
          </div>

          <div>
            <label htmlFor="code">Code</label>
            <textarea id="code" name="code" rows={10} value={form.code} onChange={handleChange} className="code-input" />
          </div>

          <p className="muted field-hint">
            A resource needs an explanation or code — a link on its own isn't enough.
          </p>
        </fieldset>

        <fieldset className="form-section">
          <legend>Where it came from</legend>

          <div className="link-input">
            <select
              value={linkDraft.type}
              onChange={(e) => setLinkDraft((p) => ({ ...p, type: e.target.value }))}
              aria-label="Link type"
            >
              {LINK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <input
              value={linkDraft.url}
              onChange={(e) => setLinkDraft((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://github.com/user/project"
            />

            <button type="button" onClick={addLink}>Add</button>
          </div>

          {linkDraft.type === "docs" && (
            <div className="document-upload">
              <div>
                <label htmlFor="document-file">Or upload a PDF</label>
                <span>Cloudinary document · max 5 MB</span>
              </div>
              <input
                ref={documentInputRef}
                id="document-file"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setDocumentFile(e.target.files?.[0] || null);
                  setError(null);
                }}
                disabled={uploadingDocument}
              />
              <button
                type="button"
                onClick={handleDocumentUpload}
                disabled={!documentFile || uploadingDocument}
              >
                {uploadingDocument ? "Uploading…" : "Upload PDF"}
              </button>
            </div>
          )}

          {form.links.length > 0 && (
            <ul className="link-draft-list">
              {form.links.map((l, i) => (
                <li key={`${l.url}-${i}`}>
                  <span className="tag">{l.type}</span>
                  <span className="link-url">{l.url}</span>
                  <button type="button" onClick={() => removeLink(i)} aria-label="Remove link">×</button>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <fieldset className="form-section">
          <legend>Finding it again</legend>

          <TagField
            label="Tags"
            field="tags"
            values={form.tags}
            draft={tagDraft}
            setDraft={setTagDraft}
            onAdd={() => addTag("tags", tagDraft, setTagDraft)}
            onRemove={(v) => removeTag("tags", v)}
          />
        </fieldset>

        <fieldset className="form-section">
          <legend>Who can see it</legend>

          <div className="visibility-row">
            {[
              { value: "private", label: "Private", hint: "Only you. A draft." },
              { value: "cohort", label: "Cohort", hint: "Everyone can find it." },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`visibility-option${form.visibility === opt.value ? " is-selected" : ""}`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={opt.value}
                  checked={form.visibility === opt.value}
                  onChange={handleChange}
                />
                <span className="visibility-label">{opt.label}</span>
                <span className="muted">{opt.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving || uploadingDocument}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create resource"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TagField({ label, values, draft, setDraft, onAdd, onRemove }) {
  return (
    <div>
      <label>{label}</label>
      <div className="skill-input">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder="Type and press Enter"
        />
        <button type="button" onClick={onAdd}>Add</button>
      </div>

      {values.length > 0 && (
        <div className="tag-row">
          {values.map((v) => (
            <button type="button" className="tag tag-removable" key={v} onClick={() => onRemove(v)}>
              {v} ×
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResourceFormPage;

