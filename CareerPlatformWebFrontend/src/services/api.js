const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api/v1";

/**
 * Internal helper to read the stored auth token from localStorage.
 * Kept private; use getToken/setToken/clearToken public functions instead.
 */
function _readToken() {
  try {
    return localStorage.getItem("token");
  } catch (_e) {
    return null;
  }
}

/**
 * Internal request helper using fetch with JSON handling and auth header.
 * Throws an error on non-2xx status with a best-effort message.
 */
async function _request(path, options = {}) {
  const token = _readToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const resp = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = resp.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await resp.json().catch(() => ({})) : await resp.text();
  if (!resp.ok) {
    const message =
      (isJson && (body.message || body.error || body.detail)) ||
      `Request failed with status ${resp.status}`;
    const err = new Error(message);
    err.status = resp.status;
    err.details = body;
    throw err;
  }
  return body;
}

// PUBLIC_INTERFACE
export function getToken() {
  /** Returns the current JWT auth token from storage (or null). */
  return _readToken();
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Stores a JWT auth token in localStorage for authenticated calls. */
  localStorage.setItem("token", token);
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Clears the stored JWT and effectively logs out locally. */
  localStorage.removeItem("token");
}

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Authenticate and return the token; also stores it for subsequent calls. */
  const res = await _request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res?.token) {
    setToken(res.token);
  }
  return res;
}

// PUBLIC_INTERFACE
export async function logout() {
  /** Logout remotely (best-effort) and clear the local token. */
  try {
    await _request("/auth/logout", { method: "POST" });
  } catch (_e) {
    // ignore network or API errors on logout
  }
  clearToken();
}

// PUBLIC_INTERFACE
export async function register(user) {
  /** Register a new user with the backend. */
  return _request("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

// PUBLIC_INTERFACE
export async function getProfile() {
  /** Retrieve the authenticated user's profile. */
  return _request("/profile", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function updateProfile(profile) {
  /** Update the authenticated user's profile. */
  return _request("/profile", { method: "PUT", body: JSON.stringify(profile) });
}

// PUBLIC_INTERFACE
export async function getRoles() {
  /** List available roles from the backend. */
  return _request("/roles", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function selectRoles({ currentRoleId, targetRoleId }) {
  /** Save the user's selected current and target roles. */
  return _request("/roles/select", {
    method: "POST",
    body: JSON.stringify({ currentRoleId, targetRoleId }),
  });
}

// PUBLIC_INTERFACE
export async function getCompetencies() {
  /** Retrieve competencies for the selected roles. */
  return _request("/competencies", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function submitAssessment(competencies) {
  /** Submit competency assessment for the user. */
  return _request("/competencies/assess", {
    method: "POST",
    body: JSON.stringify(competencies),
  });
}

// PUBLIC_INTERFACE
export async function performGapAnalysis({ currentCompetencies, targetRoleId }) {
  /** Perform gap analysis using current competencies and the target role. */
  return _request("/gap-analysis", {
    method: "POST",
    body: JSON.stringify({ currentCompetencies, targetRoleId }),
  });
}

// PUBLIC_INTERFACE
export async function generateDevelopmentPlan(gapAnalysisResult) {
  /** Generate a development plan based on a gap analysis result. */
  return _request("/development-plan", {
    method: "POST",
    body: JSON.stringify(gapAnalysisResult),
  });
}

// PUBLIC_INTERFACE
export async function exportDevelopmentPlan() {
  /** Export the generated development plan and return an export link or URL. */
  return _request("/development-plan/export", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getRoleAdjacency() {
  /** Get alternative role suggestions (role adjacency). */
  return _request("/role-adjacency", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getAuditLogs() {
  /** Retrieve audit logs (admin access). */
  return _request("/audit-logs", { method: "GET" });
}
