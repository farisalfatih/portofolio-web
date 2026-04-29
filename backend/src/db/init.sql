-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hero
CREATE TABLE IF NOT EXISTS hero (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT '',
  tagline VARCHAR(255) NOT NULL DEFAULT '',
  quote TEXT NOT NULL DEFAULT '',
  github_url VARCHAR(255) DEFAULT '',
  linkedin_url VARCHAR(255) DEFAULT '',
  instagram_url VARCHAR(255) DEFAULT '',
  cv_url VARCHAR(500) DEFAULT '',
  profile_image_url VARCHAR(500) DEFAULT '',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- About
CREATE TABLE IF NOT EXISTS about (
  id SERIAL PRIMARY KEY,
  bio_paragraph1 TEXT NOT NULL DEFAULT '',
  bio_paragraph2 TEXT NOT NULL DEFAULT '',
  bio_paragraph3 TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skill categories
CREATE TABLE IF NOT EXISTS skill_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color_from VARCHAR(50) DEFAULT 'from-cyan-400',
  color_to VARCHAR(50) DEFAULT 'to-cyan-600',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES skill_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'web',
  description TEXT NOT NULL DEFAULT '',
  tech_stack TEXT[] DEFAULT '{}',
  category VARCHAR(100) DEFAULT '',
  github_url VARCHAR(255) DEFAULT '',
  demo_url VARCHAR(255) DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  whatsapp_url VARCHAR(255) DEFAULT '',
  maps_url VARCHAR(255) DEFAULT '',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image VARCHAR(255) DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ── Seed Data ─────────────────────────────────────────────────────────────────

-- Admin (password: admin123)
INSERT INTO users (username, email, password_hash) VALUES
  ('admin', 'farisalfatih777@gmail.com', '$2b$10$QFHasHRlo5GV0zvDdcd.ZuSWr/F5pAemON2TTNKvOHE7SIcTA6G5u')
ON CONFLICT DO NOTHING;

-- Hero
INSERT INTO hero (name, tagline, quote, github_url, linkedin_url, instagram_url, cv_url, profile_image_url) VALUES
  (
    'Mohammad Faris Al Fatih',
    'Web Developer & Aspiring Data Engineer',
    '"Membangun web, memahami data"',
    'https://github.com/farisalfatih',
    'https://www.linkedin.com/in/mohammad-faris-al-fatih-b523a2297/',
    'https://instagram.com/farisalfatih777',
    '',
    ''
  )
ON CONFLICT DO NOTHING;

-- About
INSERT INTO about (bio_paragraph1, bio_paragraph2, bio_paragraph3) VALUES
  (
    'Halo! Saya Mohammad Faris Al Fatih, seorang web developer yang passionate dalam membangun aplikasi web yang tidak hanya cantik, tetapi juga powerful dan data-driven.',
    'Dengan latar belakang di web development, saya terus mengembangkan keahlian saya di bidang data engineering. Saya percaya kombinasi kemampuan development dan pemahaman data adalah kunci untuk membangun aplikasi modern yang efektif.',
    'Saya senang bekerja dengan teknologi terbaru dan selalu mencari cara untuk mengoptimalkan performa aplikasi serta memberikan pengalaman terbaik bagi pengguna.'
  )
ON CONFLICT DO NOTHING;

-- Skill categories
INSERT INTO skill_categories (name, color_from, color_to, sort_order) VALUES
  ('Frontend', 'from-cyan-400', 'to-cyan-600', 1),
  ('Backend & Data', 'from-blue-400', 'to-blue-600', 2),
  ('Tools', 'from-purple-400', 'to-purple-600', 3)
ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'HTML', 1 FROM skill_categories WHERE name='Frontend' ON CONFLICT DO NOTHING;
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'CSS', 2 FROM skill_categories WHERE name='Frontend' ON CONFLICT DO NOTHING;
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'JavaScript', 3 FROM skill_categories WHERE name='Frontend' ON CONFLICT DO NOTHING;
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'React', 4 FROM skill_categories WHERE name='Frontend' ON CONFLICT DO NOTHING;
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'Tailwind CSS', 5 FROM skill_categories WHERE name='Frontend' ON CONFLICT DO NOTHING;
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'Python', 1 FROM skill_categories WHERE name='Backend & Data' ON CONFLICT DO NOTHING;
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'Node.js', 2 FROM skill_categories WHERE name='Backend & Data' ON CONFLICT DO NOTHING;
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'PostgreSQL', 3 FROM skill_categories WHERE name='Backend & Data' ON CONFLICT DO NOTHING;
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'Git', 1 FROM skill_categories WHERE name='Tools' ON CONFLICT DO NOTHING;
INSERT INTO skills (category_id, name, sort_order)
SELECT id, 'Docker', 2 FROM skill_categories WHERE name='Tools' ON CONFLICT DO NOTHING;

-- Contact
INSERT INTO contact_info (email, phone, location, whatsapp_url, maps_url) VALUES
  (
    'farisalfatih777@gmail.com',
    '+62 81357700860',
    'Gresik, Indonesia',
    'https://wa.me/6281357700860',
    'https://www.google.com/maps/place/Gresik'
  )
ON CONFLICT DO NOTHING;

-- Project
INSERT INTO projects (name, type, description, tech_stack, category, github_url, is_featured, sort_order) VALUES
  (
    'Portfolio Website',
    'web',
    'Website portfolio interaktif dengan dark mode, animasi smooth, dan admin panel berbasis React dan Node.js.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Docker'],
    'Web Development',
    'https://github.com/farisalfatih',
    true,
    1
  )
ON CONFLICT DO NOTHING;
