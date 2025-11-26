const RAW_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const RAW_API_BASE = process.env.REACT_APP_API_BASE || "/api/v1";
const FRONTEND_BASE = process.env.REACT_APP_FRONTEND_URL || (typeof window !== "undefined" ? window.location.origin : "");

// Derive a sensible default backend URL for local dev if not provided:
// If frontend runs on :3000, assume backend is on the same host :3001
const DEFAULT_BACKEND_URL = (() => {
  if (typeof window === "undefined") return "";
  try {
    const u = new URL(window.location.href);
    if (u.port === "3000") {
      return `${u.protocol}//${u.hostname}:3001`;
    }
    return "";
  } catch {
    return "";
  }
})();

/**
 * Join a base URL and a path ensuring a single slash boundary.
 */
function joinUrl(base, path) {
  if (!base) return path || "";
  if (!path) return base || "";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Normalize a base URL by removing any trailing slash.
 */
function normalizeBase(base) {
  if (!base) return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

/**
 * Final API base URL precedence:
 * 1) REACT_APP_API_BASE_URL if provided (e.g., https://api.example.com/api/v1)
 * 2) join(REACT_APP_BACKEND_URL or default dev URL, REACT_APP_API_BASE)
 * 3) REACT_APP_API_BASE (relative, e.g., /api/v1)
 */
const RAW_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || DEFAULT_BACKEND_URL || "";

export const API_BASE_URL = (() => {
  // If a full base URL is supplied, ensure it includes a versioned /api path.
  const baseUrlEnv = normalizeBase(RAW_API_BASE_URL);
  if (baseUrlEnv) {
    try {
      // new URL requires an absolute base; when running in browser, use window origin
      const baseForParse =
        typeof window !== "undefined" ? window.location.origin : "http://localhost";
      const parsed = new URL(baseUrlEnv, baseForParse);
      const path = (parsed.pathname || "").replace(/\/+$/, ""); // trim trailing slash

      const hasVersion = /\/api\/v\d+$/i.test(path);
      const endsWithApi = /\/api\/?$/i.test(path);

      if (hasVersion) {
        // Already versioned like /api/v1 – use as-is.
        return baseUrlEnv;
      }
      if (endsWithApi) {
        // Ends with /api or /api/ – append just v1
        return `${baseUrlEnv}${baseUrlEnv.endsWith("/") ? "v1" : "/v1"}`;
      }
      // No /api segment – append configured RAW_API_BASE (defaults to /api/v1)
      return joinUrl(baseUrlEnv, RAW_API_BASE);
    } catch {
      // If parsing fails (e.g., relative string), fallback to joining a versioned base
      return joinUrl(baseUrlEnv, RAW_API_BASE);
    }
  }

  // If only backend host/port is provided, append /api/v1
  if (RAW_BACKEND_URL) {
    const backend = normalizeBase(RAW_BACKEND_URL);
    return joinUrl(backend, RAW_API_BASE);
  }

  // Default to a relative, versioned base
  return normalizeBase(RAW_API_BASE);
})();

/**
 * Best-effort handler for unauthorized responses.
 * Clears token and routes to /login.
 */
function handleUnauthorized() {
  try {
    localStorage.removeItem("token");
  } catch (_e) {
    // ignore
  }
  try {
    // Avoid infinite loops if already on login
    const dest = `${FRONTEND_BASE || ""}/login`;
    if (typeof window !== "undefined") {
      if (!window.location.pathname.includes("/login")) {
        window.location.assign(dest);
      }
    }
  } catch (_e) {
    // ignore
  }
}

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
 * Internal request helper using fetch with JSON handling and optional auth header.
 * Throws an error on non-2xx status with a best-effort message.
 */
async function _request(path, options = {}) {
  const { auth = true } = options;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (auth) {
    const token = _readToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${path}`;
  const resp = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = resp.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await resp.json().catch(() => ({})) : await resp.text().catch(() => "");

  if (!resp.ok) {
    if (resp.status === 401) {
      handleUnauthorized();
    }
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
export function getApiBaseUrl() {
  /** Returns the computed API base URL (for debugging/diagnostics). */
  return API_BASE_URL;
}

/* PUBLIC_INTERFACE */
export async function login(email, password) {
  /** Authenticate and return the token; also stores it for subsequent calls. */
  const res = await _request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    auth: false, // ensure no Authorization header on login
  });
  const tok = res?.token || res?.access_token || res?.accessToken;
  if (tok) {
    setToken(tok);
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
