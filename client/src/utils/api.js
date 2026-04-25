// client/src/utils/api.js
const BASE = import.meta.env.VITE_API_BASE;

async function apiFetch(path, opts = {}) {
  const url = BASE.replace(/\/$/, "") + path;
  
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...opts,
    headers,
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let body = text;
    try { body = JSON.parse(text); } catch (e) {}
    const err = new Error(body?.error || "API Error");
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json().catch(() => ({}));
}

// === Auth ===
export async function authMe() {
  return apiFetch("/auth/me");
}
export async function authLogin(email, password) {
  return apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}
export async function authRegister(email, password, full_name, phone, company) {
  return apiFetch("/auth/register", { method: "POST", body: JSON.stringify({ email, password, full_name, phone, company }) });
}

// === Leads ===
export async function fetchLeads() {
  return apiFetch("/leads");
}
export async function fetchLead(id) {
  return apiFetch(`/leads/${id}`);
}
export async function createLead(payload) {
  return apiFetch("/leads", { method: "POST", body: JSON.stringify(payload) });
}
export async function convertLead(id, password) {
  return apiFetch(`/leads/${id}/convert`, { method: "POST", body: JSON.stringify({ password }) });
}
export async function rejectLead(id) {
  return apiFetch(`/leads/${id}/reject`, { method: "POST" });
}
export async function deleteLead(id) {
  return apiFetch(`/leads/${id}`, { method: "DELETE" });
}

// === Projects ===
export async function fetchProjects() {
  return apiFetch("/projects");
}
export async function fetchProject(id) {
  return apiFetch(`/projects/${id}`);
}
export async function createProject(payload) {
  return apiFetch("/projects", { method: "POST", body: JSON.stringify(payload) });
}
export async function updateProject(id, updates) {
  return apiFetch(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
}
export async function deleteProject(id) {
  return apiFetch(`/projects/${id}`, { method: "DELETE" });
}

// === Milestones ===
export async function createMilestone(projectId, payload) {
  return apiFetch(`/projects/${projectId}/milestones`, { method: "POST", body: JSON.stringify(payload) });
}
export async function updateMilestone(id, updates) {
  return apiFetch(`/milestones/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
}

// === Updates ===
export async function createProjectUpdate(projectId, payload) {
  return apiFetch(`/projects/${projectId}/updates`, { method: "POST", body: JSON.stringify(payload) });
}

// === Payments ===
export async function createPayment(projectId, payload) {
  return apiFetch(`/projects/${projectId}/payments`, { method: "POST", body: JSON.stringify(payload) });
}
export async function updatePayment(id, updates) {
  return apiFetch(`/payments/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
}

// === Notifications ===
export async function fetchNotifications() {
  return apiFetch("/notifications");
}
export async function markNotificationRead(id) {
  return apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
}

// === Dashboard ===
export async function fetchDashboardStats() {
  return apiFetch("/dashboard/stats");
}
