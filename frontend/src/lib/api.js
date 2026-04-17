const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getToken() {
  return localStorage.getItem('portfolio_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Request gagal')
  }
  return data
}

export const api = {
  // Auth
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/auth/me'),
  changePassword: (body) => request('/api/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),

  // Hero
  getHero: () => request('/api/hero'),
  updateHero: (body) => request('/api/hero', { method: 'PUT', body: JSON.stringify(body) }),

  // About
  getAbout: () => request('/api/about'),
  updateAbout: (body) => request('/api/about', { method: 'PUT', body: JSON.stringify(body) }),

  // Skills
  getSkills: () => request('/api/skills'),
  getSkillsRaw: () => request('/api/skills/raw'),
  createCategory: (body) => request('/api/skills/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/api/skills/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/api/skills/categories/${id}`, { method: 'DELETE' }),
  createSkill: (body) => request('/api/skills', { method: 'POST', body: JSON.stringify(body) }),
  updateSkill: (id, body) => request(`/api/skills/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteSkill: (id) => request(`/api/skills/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: (type) => request(`/api/projects${type && type !== 'all' ? `?type=${type}` : ''}`),
  getProject: (id) => request(`/api/projects/${id}`),
  createProject: (body) => request('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (id, body) => request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProject: (id) => request(`/api/projects/${id}`, { method: 'DELETE' }),

  // Contact
  getContact: () => request('/api/contact'),
  updateContact: (body) => request('/api/contact', { method: 'PUT', body: JSON.stringify(body) }),

  // Blog
  getBlogPosts: () => request('/api/blog'),
  getBlogPostsAll: () => request('/api/blog/all'),
  getBlogPost: (id) => request(`/api/blog/${id}`),
  createBlogPost: (body) => request('/api/blog', { method: 'POST', body: JSON.stringify(body) }),
  updateBlogPost: (id, body) => request(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteBlogPost: (id) => request(`/api/blog/${id}`, { method: 'DELETE' }),
}
