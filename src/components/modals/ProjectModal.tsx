import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Sparkles, CheckCircle2, Layers, Calendar, User } from 'lucide-react';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl -z-10"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f1117] border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl text-left"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/10 z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Info */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-neutral-300">
              {project.category}
            </span>
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {project.year}
            </span>
            {project.client && (
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {project.client}
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            {project.name}
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8">
            {project.short_description}
          </p>

          {/* Main Visual Image Banner */}
          <div className="rounded-2xl overflow-hidden mb-8 border border-white/10 bg-zinc-950">
            <img
              src={project.cover_image}
              alt={project.name}
              className="w-full max-h-[440px] object-cover"
            />
          </div>

          {/* Key Metrics Pill Box */}
          {project.metrics && (
            <div className="p-4 rounded-2xl glass-surface border border-emerald-500/20 bg-emerald-500/[0.03] mb-8 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-sm text-neutral-200">
                <span className="font-semibold text-emerald-300">Impact & Verified Results: </span>
                {project.metrics}
              </div>
            </div>
          )}

          {/* Challenge & Solution Grid */}
          {(project.challenge || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {project.challenge && (
                <div className="p-6 rounded-2xl glass-surface">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    The Challenge
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="p-6 rounded-2xl glass-surface">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    The Architecture & Solution
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Secondary Gallery Images if available */}
          {project.images && project.images.length > 1 && (
            <div className="mb-8">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                Interface Views & Visuals
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.images.slice(1).map((imgUrl, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-zinc-950">
                    <img
                      src={imgUrl}
                      alt={`${project.name} view ${i + 2}`}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Used */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-neutral-400 mr-2">Built with:</span>
              {project.technologies?.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-white glass-pill px-3 py-1 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
