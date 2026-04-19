-- ============================================
-- Portfolio Database Schema & Seed Data
-- ============================================

-- Users table (admin)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hero / Profile section
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
  favicon_url VARCHAR(500) DEFAULT '',
  og_image_url VARCHAR(500) DEFAULT '',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- About section
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

-- Contact info
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  whatsapp_url VARCHAR(255) DEFAULT '',
  maps_url VARCHAR(255) DEFAULT '',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog / Articles
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

-- ============================================
-- MIGRATION: tambah kolom baru jika sudah ada DB lama
-- ============================================
DO $$ BEGIN
  ALTER TABLE hero ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500) DEFAULT '';
  ALTER TABLE hero ALTER COLUMN cv_url TYPE VARCHAR(500);
EXCEPTION WHEN others THEN NULL;
END $$;

-- ============================================
-- SEED DATA
-- ============================================

-- Default admin user (password: admin123)
INSERT INTO users (username, email, password_hash) VALUES
  ('admin', 'farisalfatih777@gmail.com', '$2b$10$QFHasHRlo5GV0zvDdcd.ZuSWr/F5pAemON2TTNKvOHE7SIcTA6G5u')
ON CONFLICT DO NOTHING;

-- Hero defaults
INSERT INTO hero (name, tagline, quote, github_url, linkedin_url, instagram_url, cv_url, profile_image_url) VALUES
  (
    'Mohammad Faris Al Fatih',
    'Web Developer & Aspiring Data Engineer',
    '"Membangun web, memahami data"',
    'https://github.com/farisalfatih',
    'https://www.linkedin.com/in/mohammad-faris-al-fatih-b523a2297/',
    'https://instagram.com/farisalfatih777',
    '/assets/file/cv.pdf',
    ''
  )
ON CONFLICT DO NOTHING;

-- About defaults
INSERT INTO about (bio_paragraph1, bio_paragraph2, bio_paragraph3) VALUES
  (
    'Halo! Saya Mohammad Faris Al Fatih, seorang web developer yang passionate dalam membangun aplikasi web yang tidak hanya cantik, tetapi juga powerful dan data-driven.',
    'Dengan latar belakang di web development, saya terus mengembangkan keahlian saya di bidang data engineering. Saya percaya bahwa kombinasi kemampuan development dan pemahaman data adalah kunci untuk membangun aplikasi modern yang efektif.',
    'Saya senang bekerja dengan teknologi terbaru dan selalu mencari cara untuk mengoptimalkan performa aplikasi serta memberikan pengalaman terbaik bagi pengguna.'
  )
ON CONFLICT DO NOTHING;

-- Skill categories
INSERT INTO skill_categories (name, color_from, color_to, sort_order) VALUES
  ('Frontend Development', 'from-cyan-400', 'to-cyan-600', 1),
  ('Backend & Data', 'from-blue-400', 'to-blue-600', 2),
  ('Tools & DevOps', 'from-purple-400', 'to-purple-600', 3),
  ('Data Engineering', 'from-orange-400', 'to-orange-600', 4)
ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO skills (category_id, name, sort_order) VALUES
  (1, 'HTML', 1), (1, 'CSS', 2), (1, 'JavaScript', 3), (1, 'React', 4), (1, 'TypeScript', 5), (1, 'Tailwind CSS', 6),
  (2, 'Python', 1), (2, 'Node.js', 2), (2, 'SQL', 3), (2, 'PostgreSQL', 4),
  (3, 'Git', 1), (3, 'Docker', 2), (3, 'Linux', 3), (3, 'VS Code', 4),
  (4, 'Pandas', 1), (4, 'Data Analysis', 2), (4, 'ETL Pipeline', 3), (4, 'Database Design', 4)
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO projects (name, type, description, tech_stack, category, github_url, demo_url, is_featured, sort_order) VALUES
  (
    'E-Commerce Dashboard',
    'fullstack',
    'Dashboard analytics untuk platform e-commerce dengan real-time data visualization dan reporting system',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Docker'],
    'Fullstack',
    'https://github.com/farisalfatih',
    '',
    true,
    1
  ),
  (
    'Data Pipeline ETL',
    'data',
    'Pipeline ETL untuk mengumpulkan, membersihkan, dan mentransformasi data dari multiple sources ke data warehouse',
    ARRAY['Python', 'PostgreSQL', 'Apache Airflow', 'Docker'],
    'Data Engineering',
    'https://github.com/farisalfatih',
    '',
    true,
    2
  ),
  (
    'Portfolio Website',
    'web',
    'Website portfolio interaktif dengan dark mode, animasi smooth, dan design responsif',
    ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Motion'],
    'Web Development',
    'https://github.com/farisalfatih',
    '',
    false,
    3
  )
ON CONFLICT DO NOTHING;

-- Contact info
INSERT INTO contact_info (email, phone, location, whatsapp_url, maps_url) VALUES
  (
    'farisalfatih777@gmail.com',
    '+62 81357700860',
    'Gresik, Indonesia',
    'https://wa.me/6281357700860',
    'https://www.google.com/maps/place/Gresik,+Indonesia'
  )
ON CONFLICT DO NOTHING;

-- Migration: tambah kolom favicon dan og_image jika belum ada
DO $$ BEGIN
  ALTER TABLE hero ADD COLUMN IF NOT EXISTS favicon_url VARCHAR(500) DEFAULT '';
  ALTER TABLE hero ADD COLUMN IF NOT EXISTS og_image_url VARCHAR(500) DEFAULT '';
EXCEPTION WHEN others THEN NULL;
END $$;
