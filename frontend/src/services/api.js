const API_BASE_URL = 'http://localhost:5000'

const getToken = () => {
  return localStorage.getItem('token')
}

const request = async (endpoint, options = {}) => {
  const token = getToken()

  const headers = {
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  let data

  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed with status ${response.status}`,
    )
  }

  return data
}

export const api = {
  get: (endpoint) =>
    request(endpoint, {
      method: 'GET',
    }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: 'DELETE',
    }),

  upload: (endpoint, formData) =>
    request(endpoint, {
      method: 'POST',
      body: formData,
    }),
}