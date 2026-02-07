import { useEffect, useState } from "react";

export default function TestMongo() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState("idle");
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMongo() {
      if (!API_URL) {
        setStatus("missing_env");
        return;
      }

      try {
        setStatus("loading");
        const res = await fetch(`${API_URL}/api/mongo`);
        const json = await res.json().catch(() => null);

        if (!cancelled) {
          setPayload(json);
          setStatus(res.ok ? "ok" : "error");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    fetchMongo();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  if (status === "missing_env") {
    return <div>Missing VITE_API_URL</div>;
  }

  return (
    <div>
      <h3>Test Mongo</h3>
      <div>Status: {status}</div>
      <pre>{payload ? JSON.stringify(payload, null, 2) : "No data"}</pre>
    </div>
  );
}
