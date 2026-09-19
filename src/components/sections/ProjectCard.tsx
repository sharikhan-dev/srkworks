import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isEven = index % 2 === 0;
  const [imgError, setImgError] = useState(false);

  // Preferred fields with fallbacks for backward compatibility
  const title = project.title || project.name;
  const description = project.short_description || project.description || '';
  const imageUrl = project.cover_image || project.image_url;
  const caseStudyUrl = project.case_study_url || project.live_url;
  const buttonText = project.button_text?.trim() || 'View Case Study ↗';
  const category = project.category || 'Portfolio';
  const year = project.year || '2026';

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      id={`project-card-${project.slug || project.id}`}
      className="group relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden glass-surface glass-surface-hover border border-white/10 p-5 sm:p-8 transition-all duration-700"
    >
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
        
        {/* Project Image Column with Fallback */}
        <div className={`lg:col-span-7 relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] bg-neutral-900/80 border border-white/5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 text-center">
              <div className="w-14 h-14 rounded-2xl glass-surface border border-white/10 flex items-center justify-center text-neutral-400 mb-3">
                <FolderGit2 className="w-7 h-7" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                {title}
              </p>
            </div>
          )}

          {/* Subtle Glass Sheen & Dark Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0e]/80 via-transparent to-black/10 pointer-events-none" />

          {/* Floating Category & Year Tag */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="glass-pill px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase text-neutral-200 border border-white/15">
              {category}
            </span>

            <span className="text-xs font-mono text-neutral-300 glass-pill px-2.5 py-1 rounded-full border border-white/10">
              {year}
            </span>
          </div>
        </div>

        {/* Editorial Text Details Column */}
        <div className={`lg:col-span-5 flex flex-col justify-between space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                {category} · {year}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white group-hover:text-neutral-100 transition-colors">
              {title}
            </h3>

            {description && (
              <p className="text-sm sm:text-base text-neutral-300/90 leading-relaxed mt-3 font-normal">
                {description}
              </p>
            )}
          </div>

          {/* External Case Study / Project CTA Link */}
          {caseStudyUrl && caseStudyUrl.trim() !== '' && caseStudyUrl !== '#' && (
            <div className="pt-4 border-t border-white/[0.08]">
              <a
                href={caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-black bg-white hover:bg-neutral-200 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{buttonText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
