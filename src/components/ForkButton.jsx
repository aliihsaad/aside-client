import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useAuthContext } from "../lib/useAuthContext";
import Modal from "./Modal";
import "./ForkButton.css";

function ForkButton({ resource }) {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [error, setError] = useState(null);
  const [forking, setForking] = useState(false);

  const { data: folders } = useFetch(open ? `/folders/user/${user._id}` : null);

  const handleFork = async () => {
    setError(null);
    setForking(true);

    try {
      const { data } = await api.post(`/resources/${resource._id}/fork`, {
        folder: folderId || folders?.[0]?._id,
      });
      navigate(`/resources/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't fork that");
      setForking(false);
    }
  };

  return (
    <>
      <button type="button" className="btn-block fork-button" onClick={() => setOpen(true)}>
        Fork to my shelf
      </button>

      {open && (
        <Modal title="Fork this resource" onClose={() => setOpen(false)}>
          <p className="muted">
            You'll get your own editable copy. The original stays credited.
          </p>

          <div>
            <label htmlFor="fork-folder">Put it in</label>
            <select
              id="fork-folder"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
            >
              {folders?.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>

          <p className="muted field-hint">Your fork starts private.</p>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="button" onClick={() => setOpen(false)}>Cancel</button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleFork}
              disabled={forking || !folders?.length}
            >
              {forking ? "Forking…" : "Fork to my shelf"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ForkButton;