import { useState } from "react";
import api from "../lib/api";
import "./VisibilityToggle.css";

function VisibilityToggle({ resource, onChange }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isPrivate = resource.visibility === "private";

  const toggle = async () => {
    setError(null);
    setSaving(true);

    try {
      const { data } = await api.put(`/resources/${resource._id}`, {
        visibility: isPrivate ? "cohort" : "private",
      });
      onChange(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't change that");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="visibility-toggle">
      <button type="button" onClick={toggle} disabled={saving} className={isPrivate ? "btn-primary" : ""}>
        {saving ? "…" : isPrivate ? "Publish to cohort" : "Make private"}
      </button>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default VisibilityToggle;