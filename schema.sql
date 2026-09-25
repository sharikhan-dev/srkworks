-- =====================================================================
-- SRKWORKS PORTFOLIO — COMPLETE SUPABASE FIX SCRIPT
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to run multiple times (all statements are idempotent)
-- =====================================================================

-- Grant permissions to all roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =====================================================================
-- 1. SITE SETTINGS
-- =====================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Sharik Khan',
  logo_initial TEXT DEFAULT 'S',
  short_title TEXT,
  location TEXT,
  title_badge TEXT DEFAULT 'Full-Stack Engineer & UI/UX Designer',
  headline TEXT DEFAULT 'I CREATE',
  hero_phrases TEXT[],
  hero_supporting_text TEXT,
  profile_image TEXT DEFAULT '/hero-sculpture.jpg',
  availability_status TEXT DEFAULT 'Open to Projects',
  primary_cta_label TEXT DEFAULT 'View My Work',
  secondary_cta_label TEXT DEFAULT 'Let''s Work Together',
  contact_headline TEXT DEFAULT 'LET''S BUILD SOMETHING USEFUL.',
  contact_subtext TEXT,
  email TEXT DEFAULT 'dev.sharikhan@gmail.com',
  whatsapp TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  seo_title TEXT DEFAULT 'Sharik Khan — Full-Stack Engineer & UI/UX Designer',
  seo_description TEXT,
  favicon_url TEXT,
  og_image TEXT,
  social_title TEXT,
  social_description TEXT,
  accent_gradient TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add missing columns to existing site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS logo_initial TEXT DEFAULT 'S';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS short_title TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_phrases TEXT[];
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_title TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_description TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS accent_gradient TEXT;


-- =====================================================================
-- 2. PROJECTS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  category TEXT,
  cover_image TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  project_type TEXT,
  year TEXT,
  featured BOOLEAN DEFAULT false,
  live_url TEXT,
  case_study_url TEXT,
  button_text TEXT DEFAULT 'View Case Study',
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  client TEXT,
  metrics TEXT,
  challenge TEXT,
  solution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_study_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT 'View Case Study';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metrics TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());


-- =====================================================================
-- 3. SERVICES TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  short_description TEXT,
  detailed_description TEXT,
  features TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  starting_price TEXT,
  cta_label TEXT DEFAULT 'Inquire Service',
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE services ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS starting_price TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS cta_label TEXT DEFAULT 'Inquire Service';
ALTER TABLE services ADD COLUMN IF NOT EXISTS link_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;


-- =====================================================================
-- 4. SKILLS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER DEFAULT 90,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true
);

ALTER TABLE skills ADD COLUMN IF NOT EXISTS proficiency INTEGER DEFAULT 90;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS icon TEXT;


-- =====================================================================
-- 5. EXPERIENCE TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS experience (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  period TEXT NOT NULL DEFAULT '',
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0
);

ALTER TABLE experience ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE experience ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';


-- =====================================================================
-- 6. TESTIMONIALS TABLE — with ALL extended columns
-- =====================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Client',
  company TEXT DEFAULT '',
  avatar TEXT,
  testimonial TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  client_project TEXT DEFAULT '',
  project_outcome TEXT DEFAULT '',
  project_image TEXT DEFAULT '',
  project_link TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  client_logo TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_project TEXT DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS project_outcome TEXT DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS project_image TEXT DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS project_link TEXT DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_logo TEXT DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());


-- =====================================================================
-- 7. CONTACT MESSAGES TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- =====================================================================
-- 8. THEME SETTINGS
-- =====================================================================
CREATE TABLE IF NOT EXISTS theme_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_theme',
  preset TEXT DEFAULT 'default',
  primary_color TEXT DEFAULT '#ffffff',
  secondary_color TEXT DEFAULT '#a1a1aa',
  accent_color TEXT DEFAULT '#38bdf8',
  background_color TEXT DEFAULT '#07080a',
  surface_color TEXT DEFAULT 'rgba(255, 255, 255, 0.025)',
  text_color TEXT DEFAULT '#ffffff',
  secondary_text_color TEXT DEFAULT '#94a3b8',
  border_color TEXT DEFAULT 'rgba(255, 255, 255, 0.08)',
  heading_font TEXT DEFAULT 'Plus Jakarta Sans',
  body_font TEXT DEFAULT 'Plus Jakarta Sans',
  font_weight TEXT DEFAULT 'font-semibold',
  heading_scale TEXT DEFAULT 'normal',
  border_radius TEXT DEFAULT 'rounded-2xl',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- =====================================================================
-- 9. HERO SETTINGS
-- =====================================================================
CREATE TABLE IF NOT EXISTS hero_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_hero',
  eyebrow TEXT DEFAULT 'HEY, I''M SHARIK',
  headline TEXT DEFAULT 'I CREATE',
  phrases JSONB DEFAULT '[]'::jsonb,
  supporting_text TEXT,
  primary_cta_label TEXT DEFAULT 'View My Work',
  primary_cta_url TEXT DEFAULT '#work',
  secondary_cta_label TEXT DEFAULT 'Let''s Work Together',
  secondary_cta_url TEXT DEFAULT '#contact',
  hero_image TEXT DEFAULT '/hero-sculpture.jpg',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- =====================================================================
-- 10. NAVBAR SETTINGS
-- =====================================================================
CREATE TABLE IF NOT EXISTS navbar_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_navbar',
  brand_name TEXT DEFAULT 'SHARIK KHAN',
  logo_initial TEXT DEFAULT 'S',
  cta_text TEXT DEFAULT 'Let''s Talk',
  cta_url TEXT DEFAULT '#contact',
  nav_items JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- =====================================================================
-- 11. ABOUT SETTINGS
-- =====================================================================
CREATE TABLE IF NOT EXISTS about_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_about',
  badge TEXT DEFAULT 'The Philosophy',
  heading TEXT DEFAULT 'DESIGN x CODE x AI',
  introduction TEXT,
  detailed_description TEXT,
  profile_image TEXT DEFAULT '/hero-sculpture.jpg',
  skills_tags TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT DEFAULT 'Work With Me',
  cta_url TEXT DEFAULT '#contact',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- =====================================================================
-- 12. SECTION SETTINGS
-- =====================================================================
CREATE TABLE IF NOT EXISTS section_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_sections',
  hero BOOLEAN DEFAULT true,
  services BOOLEAN DEFAULT true,
  projects BOOLEAN DEFAULT true,
  about BOOLEAN DEFAULT true,
  process BOOLEAN DEFAULT true,
  automation BOOLEAN DEFAULT true,
  testimonials BOOLEAN DEFAULT true,
  contact BOOLEAN DEFAULT true,
  footer BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- =====================================================================
-- 13. SOCIAL LINKS
-- =====================================================================
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  label TEXT,
  url TEXT NOT NULL,
  icon TEXT,
  enabled BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

ALTER TABLE social_links ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE social_links ADD COLUMN IF NOT EXISTS label TEXT;


-- =====================================================================
-- ROW LEVEL SECURITY (RLS) — OPEN POLICIES FOR ALL TABLES
-- =====================================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE navbar_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (clean slate to avoid conflicts)
DROP POLICY IF EXISTS "Public full access site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public full access projects" ON projects;
DROP POLICY IF EXISTS "Public full access services" ON services;
DROP POLICY IF EXISTS "Public full access skills" ON skills;
DROP POLICY IF EXISTS "Public full access experience" ON experience;
DROP POLICY IF EXISTS "Public full access testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public full access contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Public full access theme_settings" ON theme_settings;
DROP POLICY IF EXISTS "Public full access hero_settings" ON hero_settings;
DROP POLICY IF EXISTS "Public full access navbar_settings" ON navbar_settings;
DROP POLICY IF EXISTS "Public full access about_settings" ON about_settings;
DROP POLICY IF EXISTS "Public full access section_settings" ON section_settings;
DROP POLICY IF EXISTS "Public full access social_links" ON social_links;
DROP POLICY IF EXISTS "Admin full access navbar_settings" ON navbar_settings;
DROP POLICY IF EXISTS "Admin full access about_settings" ON about_settings;
DROP POLICY IF EXISTS "Admin full access section_settings" ON section_settings;
DROP POLICY IF EXISTS "Admin full access social_links" ON social_links;
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Public can view projects" ON projects;
DROP POLICY IF EXISTS "Enable all operations on projects" ON projects;
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Public can view skills" ON skills;
DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can view theme settings" ON theme_settings;
DROP POLICY IF EXISTS "Public can view hero settings" ON hero_settings;
DROP POLICY IF EXISTS "Public can view navbar settings" ON navbar_settings;
DROP POLICY IF EXISTS "Public can view about settings" ON about_settings;
DROP POLICY IF EXISTS "Public can view section settings" ON section_settings;
DROP POLICY IF EXISTS "Public can view social links" ON social_links;

-- Create fresh open policies — anon + authenticated can do everything
CREATE POLICY "Public full access site_settings"    ON site_settings    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access projects"         ON projects         FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access services"         ON services         FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access skills"           ON skills           FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access experience"       ON experience       FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access testimonials"     ON testimonials     FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access contact_messages" ON contact_messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access theme_settings"   ON theme_settings   FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access hero_settings"    ON hero_settings    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access navbar_settings"  ON navbar_settings  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access about_settings"   ON about_settings   FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access section_settings" ON section_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public full access social_links"     ON social_links     FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- =====================================================================
-- STORAGE BUCKETS
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
  VALUES ('project-images', 'project-images', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('profile-images', 'profile-images', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('service-assets', 'service-assets', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('testimonial-images', 'testimonial-images', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public storage read" ON storage.objects;
DROP POLICY IF EXISTS "Allow storage upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow storage update" ON storage.objects;
DROP POLICY IF EXISTS "Allow storage delete" ON storage.objects;

CREATE POLICY "Public storage read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('project-images', 'profile-images', 'service-assets', 'testimonial-images'));

CREATE POLICY "Allow storage upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('project-images', 'profile-images', 'service-assets', 'testimonial-images'));

CREATE POLICY "Allow storage update" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('project-images', 'profile-images', 'service-assets', 'testimonial-images'))
  WITH CHECK (bucket_id IN ('project-images', 'profile-images', 'service-assets', 'testimonial-images'));

CREATE POLICY "Allow storage delete" ON storage.objects
  FOR DELETE USING (bucket_id IN ('project-images', 'profile-images', 'service-assets', 'testimonial-images'));


-- =====================================================================
-- DATA CLEANUP (WIPE ALL DUMMY / HARD DATA)
-- Uncomment and run if you want a 100% clean empty database:
-- =====================================================================
-- TRUNCATE TABLE projects CASCADE;
-- TRUNCATE TABLE services CASCADE;
-- TRUNCATE TABLE skills CASCADE;
-- TRUNCATE TABLE experience CASCADE;
-- TRUNCATE TABLE testimonials CASCADE;
-- TRUNCATE TABLE contact_messages CASCADE;

-- =====================================================================
-- DONE -- After running, hard-refresh both browsers (Ctrl+Shift+R)
-- =====================================================================

