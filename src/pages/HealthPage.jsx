import { useEffect, useState } from "react";
import api from "../services/api";

function HealthPage() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setStatus(res.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="container">
      <h1>Aside</h1>

      {error && <p style={{ color: "var(--danger)" }}>API error: {error}</p>}
      {!error && !status && <p className="muted">Connecting…</p>}
      {status && (
        <pre className="card">{JSON.stringify(status, null, 2)}</pre>
      )}
    </div>
  );
}

export default HealthPage;