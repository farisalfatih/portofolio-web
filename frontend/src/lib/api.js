// BASE_URL kosong = same-origin
// Dev  : Vite proxy /api → localhost:5000
// Prod : Nginx proxy /api → backend container
const BASE = ''

function token() {
  return localStorage.getItem('portfolio_token')
}

async function req(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers }
  if (token()) headers['Authorization'] = `Bearer ${token()}`
  const res  = await fetch(BASE + path, { ...opts, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request gagal')
  return data
}

async function upload(path, fd, extra = {}) {
  const headers = { ...extra }
  if (token()) headers['Authorization'] = `Bearer ${token()}`
  const res  = await fetch(BASE + path, { method: 'POST', headers, body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Upload gagal')
  return data
}

export const api = {
  // Auth
  login:          (b)    => req('/api/auth/login',           { method: 'POST', body: JSON.stringify(b) }),
  me:             ()     => req('/api/auth/me'),
  changePassword: (b)    => req('/api/auth/change-password', { method: 'PUT',  body: JSON.stringify(b) }),

  // Upload
  uploadImage: (file, oldUrl = '') => {
    const fd = new FormData(); fd.append('file', file)
    return upload('/api/upload/image', fd, { 'x-old-url': oldUrl })
  },
  uploadCV: (file, oldUrl = '') => {
    const fd = new FormData(); fd.append('file', file)
    return upload('/api/upload/cv', fd, { 'x-old-url': oldUrl })
  },

  // Hero
  getHero:    ()  => req('/api/hero'),
  updateHero: (b) => req('/api/hero', { method: 'PUT', body: JSON.stringify(b) }),

  // About
  getAbout:    ()  => req('/api/about'),
  updateAbout: (b) => req('/api/about', { method: 'PUT', body: JSON.stringify(b) }),

  // Skills
  getSkills:      ()       => req('/api/skills'),
  getSkillsRaw:   ()       => req('/api/skills/raw'),
  createCategory: (b)      => req('/api/skills/categories',     { method: 'POST',   body: JSON.stringify(b) }),
  updateCategory: (id, b)  => req(`/api/skills/categories/${id}`,{ method: 'PUT',   body: JSON.stringify(b) }),
  deleteCategory: (id)     => req(`/api/skills/categories/${id}`,{ method: 'DELETE' }),
  createSkill:    (b)      => req('/api/skills',                { method: 'POST',   body: JSON.stringify(b) }),
  updateSkill:    (id, b)  => req(`/api/skills/${id}`,          { method: 'PUT',    body: JSON.stringify(b) }),
  deleteSkill:    (id)     => req(`/api/skills/${id}`,          { method: 'DELETE' }),

  // Projects
  getProjects:   (type)    => req(`/api/projects${type && type !== 'all' ? `?type=${type}` : ''}`),
  getProject:    (id)      => req(`/api/projects/${id}`),
  createProject: (b)       => req('/api/projects',   { method: 'POST',   body: JSON.stringify(b) }),
  updateProject: (id, b)   => req(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
  deleteProject: (id)      => req(`/api/projects/${id}`, { method: 'DELETE' }),

  // Contact
  getContact:    ()  => req('/api/contact'),
  updateContact: (b) => req('/api/contact', { method: 'PUT', body: JSON.stringify(b) }),

  // Blog
  getBlogPosts:    ()       => req('/api/blog'),
  getBlogPostsAll: ()       => req('/api/blog/all'),
  getBlogPost:     (id)     => req(`/api/blog/${id}`),
  createBlogPost:  (b)      => req('/api/blog',       { method: 'POST',   body: JSON.stringify(b) }),
  updateBlogPost:  (id, b)  => req(`/api/blog/${id}`, { method: 'PUT',    body: JSON.stringify(b) }),
  deleteBlogPost:  (id)     => req(`/api/blog/${id}`, { method: 'DELETE' }),
}
