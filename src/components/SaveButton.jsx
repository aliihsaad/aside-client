import { useState } from "react";
import api from "../lib/api";
import "./SaveButton.css";

function SaveButton({ resourceId, initiallySaved = false, onCountChange }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);

    const next = !saved;
    setSaved(next);
    onCountChange?.(next ? 1 : -1);

    try {
      if (next) {
        await api.post("/bookmarks", { resource: resourceId });
      } else {
        await api.delete(`/bookmarks/${resourceId}`);
      }
    } catch {
      setSaved(!next);
      onCountChange?.(next ? -1 : 1);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`btn-block save-button${saved ? " is-saved" : ""}`}
      onClick={toggle}
      disabled={busy}
    >
      {saved ? "Saved ✓" : "Save"}
    </button>
  );
}

export default SaveButton;