function isLocalHostName(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getApiBaseUrl() {
  const raw = (import.meta.env.VITE_API_URL || "").trim();

  if (typeof window === "undefined") {
    return raw;
  }

  const siteOrigin = window.location.origin;
  const siteHostname = window.location.hostname;

  if (!isLocalHostName(siteHostname)) {
    // Best-practice deployment path: serve frontend and backend under the same origin
    // (nginx reverse-proxies /api and /uploads to the backend).
    return siteOrigin;
  }

  if (!raw) {
    return siteOrigin;
  }

  try {
    const parsed = new URL(raw);
    return parsed.origin;
  } catch {
    // Support relative values such as "/api-base" if used later.
    if (raw.startsWith("/")) {
      return `${siteOrigin}${raw}`;
    }
    return raw;
  }
}
