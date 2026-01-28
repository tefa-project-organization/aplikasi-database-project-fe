// src/lib/api.js
import axios from "axios"

/*
  Notes:
  1. Base URL otomatis pilih lokal atau production
  2. Axios instance pakai cookie auth (HTTP-only cookie)
  3. Helper konsisten response
*/

// base URL api
function getBaseApiUrl() {
  const hname = window.location.hostname || ""
  if (hname.includes("localhost") || hname.includes("127.0.0.1")) {
    return (
      import.meta.env.VITE_BASE_URL_API_LOCAL ||
      import.meta.env.VITE_BASE_URL_API_DOMAIN
    )
  }
  return import.meta.env.VITE_BASE_URL_API_DOMAIN
}

// AXIOS INSTANCE
const api = axios.create({
  baseURL: getBaseApiUrl(),
  withCredentials: true, // pakai cookie HTTP-only
  headers: {
    Accept: "application/json",
  },
})

// Handler registration for auth failures (e.g. 401)
let _authFailureHandler = null
export function onAuthFailure(cb) {
  _authFailureHandler = cb
  return () => {
    if (_authFailureHandler === cb) _authFailureHandler = null
  }
}

// RESPONSE INTERCEPTOR: jika API merespons 401, panggil handler terdaftar
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      try {
        if (typeof _authFailureHandler === "function") {
          _authFailureHandler()
        }
      } catch (e) {
        console.error("onAuthFailure handler error:", e)
      }
    }
    return Promise.reject(err)
  }
)

// FORMAT RESPONSE
function formatError(err) {
  const status = err?.response?.status || 500
  const data = err?.response?.data
  const message =
    data?.error?.message ||
    data?.message ||
    err.message ||
    "Terjadi kesalahan sistem"
  return { error: true, status, data, message }
}

function formatSuccess(res) {
  return {
    error: false,
    status: res.status,
    data: res.data,
    message: res.data?.message || "Success",
  }
}

// HELPERS
export async function apiGet(path, params = {}) {
  try {
    const res = await api.get(path, { params })
    return formatSuccess(res)
  } catch (err) {
    return formatError(err)
  }
}

export async function apiPost(path, payload, extraConfig = {}) {
  try {
    const isForm = payload instanceof FormData
    const config = {
      ...(isForm
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {}),
      ...extraConfig,
    }

    const res = await api.post(path, payload, config)
    return formatSuccess(res)
  } catch (err) {
    return formatError(err)
  }
}

export async function apiPut(path, payload, extraConfig = {}) {
  try {
    const isForm = payload instanceof FormData
    const config = {
      ...(isForm
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {}),
      ...extraConfig,
    }

    const res = await api.put(path, payload, config)
    return formatSuccess(res)
  } catch (err) {
    return formatError(err)
  }
}

export async function apiPatch(path, payload, extraConfig = {}) {
  try {
    const isForm = payload instanceof FormData
    const config = {
      ...(isForm
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {}),
      ...extraConfig,
    }

    const res = await api.patch(path, payload, config)
    return formatSuccess(res)
  } catch (err) {
    return formatError(err)
  }
}

export async function apiDelete(path, params = {}) {
  try {
    const res = await api.delete(path, { params })
    return formatSuccess(res)
  } catch (err) {
    return formatError(err)
  }
}

export async function fetchWithPagination(path, options = {}) {
  const { page = 1, limit = 10, sort, order, ...other } = options
  const params = { page, limit, ...other }
  if (sort) params.sort = sort
  if (order) params.order = order
  return apiGet(path, params)
}

// LOGOUT
export async function apiLogout(path) {
  try {
    const res = await api.post(path, {}) // cookie dikirim otomatis
    return formatSuccess(res)
  } catch (err) {
    const errorObj = formatError(err)

    // Jika 401 (token expired), anggap normal untuk logout
    if (err.response?.status === 401) {
      console.log("Logout: Token sudah expired (expected)")
      return {
        error: false,
        status: 200,
        data: { message: "Token expired, local logout performed" },
        message: "Local logout completed",
      }
    }

    return errorObj
  }
}

export default api
