import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Layers,
  FolderGit2,
  Calendar,
  Tag,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { Project, SiteSettings } from '../../types';

interface ProjectDetailPageProps {
  slug: string;
  projects: Project[];
  settings: SiteSettings;
  onNavigate: (target: string) => void;
}

export function ProjectDetailPage({
  slug,
  projects,
  settings,
  onNavigate
}: ProjectDetailPageProps) {
  // Find project by slug or ID
  const project = projects.find(
    (p) =>
      (p.slug && p.slug.toLowerCase() === slug.toLowerCase()) ||
      (p.id && String(p.id).toLowerCase() === slug.toLowerCase())
  );

  const title = project?.title || project?.name || 'Project Details';
  const category = project?.category || 'Case Study';
  const description = project?.short_description || project?.description || '';
  const detailedOverview = project?.detailed_overview || project?.description || description;
  const imageUrl = project?.cover_image || project?.image_url;
  const liveUrl = project?.live_url || project?.case_study_url;
  const technologies = project?.technologies || [];
  const year = project?.year || '2026';

  // Dynamic SEO head tags for project detail route
  useEffect(() => {
    if (project) {
      document.title = `${title} | SRK Works Portfolio`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && description) {
        metaDesc.setAttribute('content', `${title} - ${description.slice(0, 150)}`);
      }
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://srkworks.vercel.app/projects/${project.slug || project.id}`);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project, title, description]);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-28">
        <div className="w-16 h-16 rounded-2xl glass-surface flex items-center justify-center text-neutral-400 mb-4 border border-white/10">
          <FolderGit2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Project Not Found</h1>
        <p className="text-neutral-400 text-sm max-w-md mb-6">
          The requested project or case study could not be located in the portfolio archive.
        </p>
        <button
          onClick={() => onNavigate('work')}
          className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          View All Projects
        </button>
      </div>
    );
  }

  // Schema.org CreativeWork structured data
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": title,
    "headline": title,
    "description": description,
    "creator": {
      "@type": "Person",
      "name": "Sharik Khan",
      "url": "https://srkworks.vercel.app/",
      "sameAs": [
        "https://www.instagram.com/imsharikhan/"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "SRK Works",
      "url": "https://srkworks.vercel.app/",
      "sameAs": [
        "https://www.instagram.com/imsharikhan/"
      ]
    },
    "image": imageUrl || "https://srkworks.vercel.app/og-image.jpg"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://srkworks.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Projects",
        "item": "https://srkworks.vercel.app/#work"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `https://srkworks.vercel.app/projects/${project.slug || project.id}`
      }
    ]
  };

  return (
    <article className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative text-white">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono text-neutral-400">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => onNavigate('work')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Work
        </button>
        <span>/</span>
        <span className="text-white font-semibold">{title}</span>
      </nav>

      {/* Back button */}
      <button
        onClick={() => onNavigate('work')}
        className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Back to Selected Work</span>
      </button>

      {/* Header Info */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="glass-pill px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-neutral-300 border border-white/10">
            {category}
          </span>
          <span className="text-xs font-mono text-neutral-400">
            Completed: {year}
          </span>
        </div>

        {/* Primary H1 */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase leading-[1.1]">
          {title}
        </h1>

        {description && (
          <p className="text-sm sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}

        {liveUrl && (
          <div className="mt-6">
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <span>Visit Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </header>

      {/* Project Hero Image */}
      {imageUrl && (
        <div className="rounded-3xl overflow-hidden glass-surface border border-white/10 mb-14 aspect-[16/9] relative">
          <img
            src={imageUrl}
            alt={`${title} project preview`}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        {/* Left 2 Cols: Narrative */}
        <div className="md:col-span-2 space-y-8">
          <section className="p-6 sm:p-8 rounded-3xl glass-surface border border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Project Overview</h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {detailedOverview}
            </p>
          </section>

          {(project.problem_statement || project.challenge) && (
            <section className="p-6 sm:p-8 rounded-3xl glass-surface border border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3">The Challenge</h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {project.problem_statement || project.challenge}
              </p>
            </section>
          )}

          {project.solution && (
            <section className="p-6 sm:p-8 rounded-3xl glass-surface border border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3">The Solution &amp; Engineering</h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {project.solution}
              </p>
            </section>
          )}
        </div>

        {/* Right Col: Metadata Sidebar */}
        <aside className="space-y-6">
          <div className="p-6 rounded-3xl glass-surface border border-white/10 space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                Project Category
              </span>
              <span className="text-sm font-semibold text-white">{category}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                Timeline
              </span>
              <span className="text-sm font-semibold text-white">{year}</span>
            </div>

            {technologies.length > 0 && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono text-neutral-300 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl glass-surface border border-white/10 text-center">
            <h3 className="text-sm font-bold text-white mb-2">Need a similar solution?</h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              We design and engineer bespoke web and AI products tailored to your objectives.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Discuss Your Project
            </button>
          </div>
        </aside>
      </div>

      {/* Internal linking back to Services & Work */}
      <footer className="pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('work')}
          className="text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Explore More Projects
        </button>

        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => onNavigate('services/web-development')}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Web Development Services
          </button>
          <span className="text-neutral-600">·</span>
          <button
            onClick={() => onNavigate('services/ui-ux-design')}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            UI/UX Design
          </button>
        </div>
      </footer>
    </article>
  );
}
