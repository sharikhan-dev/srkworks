import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';

interface WorkShowcaseProps {
  projects: Project[];
  onNavigate?: (target: string) => void;
}

export function WorkShowcase({ projects, onNavigate }: WorkShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [projects, selectedCategory]);

  return (
    <section id="work" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 mb-3 sm:mb-4 border border-neutral-200/80 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-neutral-700" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-neutral-700 font-medium">
              Selected Work
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 uppercase font-sora">
            Featured Projects
          </h2>
          <p className="text-neutral-600 text-xs sm:text-base max-w-xl mt-2.5 sm:mt-3 leading-relaxed font-inter">
            Thoughtfully crafted visual design systems, resilient web engineering, and intelligent digital products.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#ECEEF2] border border-neutral-200/60 max-w-full overflow-x-auto scrollbar-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-1.5 text-xs font-inter font-medium rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-950 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Alternating Editorial Portfolio Blocks */}
      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-10 sm:p-16 text-center glass-surface rounded-3xl border border-white/10"
        >
          <p className="text-neutral-400 text-sm">No projects currently available in this category.</p>
        </motion.div>
      ) : (
        <div className="space-y-6 sm:space-y-12">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
