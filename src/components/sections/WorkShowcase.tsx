import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';

interface WorkShowcaseProps {
  projects: Project[];
}

export function WorkShowcase({ projects }: WorkShowcaseProps) {
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
    <section id="work" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white/[0.015] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill mb-4 border border-white/10">
            <Layers className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-300">
              Selected Work
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-sans">
            EDITORIAL CASE STUDIES
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-4 leading-relaxed">
            High-craft visual design systems, resilient web engineering, and autonomous AI architectures deployed in production.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl glass-surface border border-white/10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
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
          className="p-16 text-center glass-surface rounded-3xl border border-white/10"
        >
          <p className="text-neutral-400 text-sm">No projects currently available in this category.</p>
        </motion.div>
      ) : (
        <div className="space-y-8 sm:space-y-12">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}
