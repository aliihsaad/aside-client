import { useState } from "react";
import api from "../lib/api";
import "./FolderForm.css";

const COLOURS = ["#c9a227", "#4e8c86", "#7a6ba8", "#b4462f", "#6b8f3a", "#8b9086"];

function FolderForm({ folder, onDone, onCancel }) {
  const [form, setForm] = useState({
    name: folder?.name || "",
    description: folder?.description || "",
    colour: folder?.colour || COLOURS[0],
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const { data } = folder
        ? await api.put(`/folders/${folder._id}`, form)
        : await api.post("/folders", form);
      onDone(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save that");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stack">
      <div>
        <label htmlFor="name">Folder name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required maxLength={40} />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input id="description" name="description" value={form.description} onChange={handleChange} maxLength={200} />
      </div>

      <div>
        <label>Colour</label>
        <div className="colour-row">
          {COLOURS.map((c) => (
            <button
              type="button"
              key={c}
              className={`colour-swatch${form.colour === c ? " is-selected" : ""}`}
              style={{ background: c }}
              onClick={() => setForm((prev) => ({ ...prev, colour: c }))}
              aria-label={`Choose colour ${c}`}
              aria-pressed={form.colour === c}
            />
          ))}
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : folder ? "Save changes" : "Create folder"}
        </button>
      </div>
    </form>
  );
}

export default FolderForm;