// client/src/utils/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

async function apiFetch(path, opts = {}) {
  const url = BASE.replace(/\/$/, "") + path;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let body = text;
    try {
      body = JSON.parse(text);
    } catch (e) {}
    const err = new Error("API Error");
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json().catch(() => ({}));
}

export async function submitProject(payload) {
  return apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchProjects(limit = 100) {
  return apiFetch(`/projects?limit=${encodeURIComponent(limit)}`);
}
