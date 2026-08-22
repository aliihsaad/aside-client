import { useEffect, useState } from "react";
import api from "../lib/api";
import "./HealthPage.css";

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
    <div className="container page-shell health-page">
      <header className="page-hero">
        <p className="page-kicker">System check</p>
        <h1 className="section-title">Aside API health</h1>
        <p className="muted">A lightweight endpoint to confirm API reachability and response shape.</p>
      </header>

      {error && <p className="form-error">API error: {error}</p>}
      {!error && !status && <p className="muted">Connecting…</p>}
      {status && (
        <div className="card health-pre-wrap">
          <pre className="health-pre">{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default HealthPage;
