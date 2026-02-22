import { useEffect, useState } from "react";
import { getApiBaseUrl } from "../lib/apiBase";

export default function TestApi() {
  const API_URL = getApiBaseUrl();
  const [status, setStatus] = useState("idle");
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function ping() {
      try {
        setStatus("loading");
        const res = await fetch(`${API_URL}/api`);
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

    ping();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  return (
    <div>
      <h3>Test API</h3>
      <div>Status: {status}</div>
      <pre>{payload ? JSON.stringify(payload, null, 2) : "No data"}</pre>
    </div>
  );
}
