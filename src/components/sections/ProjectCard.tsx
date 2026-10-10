import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  index: number;
  onNavigate?: (target: string) => void;
}

export function ProjectCard({ project, index, onNavigate }: ProjectCardProps) {
  const isEven = index % 2 === 0;
  const [imgError, setImgError] = useState(false);

  // Preferred fields with fallbacks for backward compatibility
  const title = project.title || project.name;
  const description = project.short_description || project.description || '';
  const imageUrl = project.cover_image || project.image_url;

  // Reset image error state whenever imageUrl changes (e.g. after upload/update)
  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);
  const caseStudyUrl = project.case_study_url || project.live_url;
  const buttonText = project.button_text?.trim() || 'View Live Site ↗';
  const category = project.category || 'Portfolio';
  const year = project.year || '2026';
  const projectSlug = project.slug || project.id;

  const handleTitleClick = (e: React.MouseEvent) => {
    if (projectSlug && onNavigate) {
      e.preventDefault();
      onNavigate(`projects/${projectSlug}`);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      id={`project-card-${project.slug || project.id}`}
      className="group relative rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white border border-neutral-200/80 p-4 sm:p-7 transition-all duration-500 shadow-xs hover:shadow-xl hover:border-neutral-300"
    >
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
        
        {/* Project Image Column with Fallback */}
        <div className={`lg:col-span-7 relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] bg-neutral-100 border border-neutral-200/60 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={`${title} project preview`}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 mb-3 shadow-2xs">
                <FolderGit2 className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                {title}
              </p>
            </div>
          )}

          {/* Floating Category & Year Tag */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none">
            <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-inter font-semibold tracking-wider uppercase text-neutral-800 border border-neutral-200/80 shadow-2xs">
              {category}
            </span>

            <span className="text-[11px] sm:text-xs font-mono text-neutral-700 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-neutral-200/80 shadow-2xs">
              {year}
            </span>
          </div>
        </div>

        {/* Editorial Text Details Column */}
        <div className={`lg:col-span-5 flex flex-col justify-between space-y-4 sm:space-y-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-inter font-medium uppercase tracking-wider text-neutral-400">
                {category} · {year}
              </span>
            </div>

            <h3 className="font-sora text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-950 group-hover:text-blue-600 transition-colors">
              <a
                href={`/projects/${projectSlug}`}
                onClick={handleTitleClick}
                className="hover:underline hover:decoration-blue-400"
              >
                {title}
              </a>
            </h3>

            {description && (
              <p className="font-inter text-xs sm:text-base text-neutral-600 leading-relaxed mt-2.5 sm:mt-3 font-normal">
                {description}
              </p>
            )}
          </div>

          {/* Action Links */}
          <div className="pt-3 sm:pt-4 border-t border-neutral-200/80 flex flex-wrap items-center gap-3">
            {caseStudyUrl && caseStudyUrl.trim() !== '' && caseStudyUrl !== '#' && (
              <a
                href={caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-inter font-semibold text-white bg-neutral-950 hover:bg-neutral-800 transition-all duration-200 shadow-sm active:scale-[0.98]"
              >
                <span>{buttonText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}

            {projectSlug && (
              <a
                href={`/projects/${projectSlug}`}
                onClick={handleTitleClick}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-inter font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-all"
              >
                <span>Case Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

    </motion.article>
  );
}
