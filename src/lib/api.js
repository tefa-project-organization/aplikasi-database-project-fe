import axios from "axios"

/*
  Notes:
  1. Base URL otomatis pilih lokal atau production
  2. Axios instance pake cookie auth
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
  withCredentials: true, // if backend use cookie auth
  headers: {
    Accept: "application/json",
  },
})

// FORMAT RESPONSE
function formatError(err) {
  const status = err?.response?.status || 500
  const data = err?.response?.data
  const message =
    data?.error ||
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

// logout (tetep aman)
export async function apiLogout(path) {
  try {
    const res = await api.get(path)
    return formatSuccess(res)
  } catch (err) {
    return formatError(err)
  }
}

export default api
