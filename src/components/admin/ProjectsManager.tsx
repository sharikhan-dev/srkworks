import { useState, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  ExternalLink,
  X,
  ImageIcon,
  AlertTriangle,
  FolderGit2,
  Check,
  RefreshCw,
  Code,
  CheckCircle2
} from 'lucide-react';
import { Project } from '../../types';
import { db } from '../../services/db';

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => void;
}

const CATEGORY_OPTIONS = [
  'UI/UX Design',
  'Web Development',
  'AI Automation',
  'Branding',
  'Custom...'
];

export function ProjectsManager({ projects, onRefresh }: ProjectsManagerProps) {
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [urlError, setUrlError] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [customCategory, setCustomCategory] = useState<string>('');
  const [selectedCategorySelect, setSelectedCategorySelect] = useState<string>('UI/UX Design');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleCreateNew = () => {
    setSelectedCategorySelect('UI/UX Design');
    setCustomCategory('');
    setUrlError('');
    setEditingProject({
      name: '',
      title: '',
      category: 'UI/UX Design',
      short_description: '',
      description: '',
      year: String(new Date().getFullYear()),
      cover_image: '',
      image_url: '',
      case_study_url: '',
      button_text: 'View Case Study ↗',
      published: true,
      display_order: projects.length + 1
    });
  };

  const handleStartEdit = (proj: Project) => {
    setUrlError('');
    const cat = proj.category || 'UI/UX Design';
    if (CATEGORY_OPTIONS.includes(cat) && cat !== 'Custom...') {
      setSelectedCategorySelect(cat);
      setCustomCategory('');
    } else {
      setSelectedCategorySelect('Custom...');
      setCustomCategory(cat);
    }

    setEditingProject({
      ...proj,
      name: proj.title || proj.name,
      title: proj.title || proj.name,
      short_description: proj.description || proj.short_description || '',
      description: proj.description || proj.short_description || '',
      cover_image: proj.image_url || proj.cover_image || '',
      image_url: proj.image_url || proj.cover_image || '',
      year: proj.year || String(new Date().getFullYear()),
      case_study_url: proj.case_study_url || proj.live_url || '',
      button_text: proj.button_text?.trim() || 'View Case Study ↗'
    });
  };

  const normalizeAndValidateUrl = (rawUrl: string): { url: string; error?: string } => {
    let url = (rawUrl || '').trim();
    if (!url) return { url: '' };

    // Support internal anchor (#work, #contact) or relative path (/...)
    if (url.startsWith('#') || url.startsWith('/')) {
      return { url };
    }

    // Auto-prefix https:// if protocol is omitted (e.g. "behance.net/abc" -> "https://behance.net/abc")
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    try {
      new URL(url);
      return { url };
    } catch {
      return { url, error: 'Please enter a valid URL (e.g. https://behance.net/...)' };
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.name?.trim()) return;

    // Validate and auto-normalize URL
    const { url: targetUrl, error: urlValidationError } = normalizeAndValidateUrl(
      editingProject.case_study_url || editingProject.live_url || ''
    );
    if (urlValidationError) {
      setUrlError(urlValidationError);
      return;
    }
    setUrlError('');

    const finalCategory =
      selectedCategorySelect === 'Custom...'
        ? customCategory.trim() || 'UI/UX Design'
        : selectedCategorySelect;

    setIsSaving(true);
    try {
      const payload: Partial<Project> & { name: string } = {
        ...editingProject,
        name: editingProject.name.trim(),
        title: editingProject.name.trim(),
        category: finalCategory,
        short_description: (editingProject.short_description || '').trim(),
        description: (editingProject.short_description || '').trim(),
        year: (editingProject.year || String(new Date().getFullYear())).trim(),
        cover_image: editingProject.cover_image || editingProject.image_url || '',
        image_url: editingProject.cover_image || editingProject.image_url || '',
        case_study_url: targetUrl,
        live_url: targetUrl,
        button_text: (editingProject.button_text || '').trim() || 'View Case Study ↗'
      };

      await db.saveProject(payload);
      setEditingProject(null);
      showFeedback(`Project "${payload.title}" saved successfully!`);
      onRefresh();
    } catch (err) {
      console.error('Error saving project:', err);
      showFeedback('Failed to save project. Please check values.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncWithSeedData = () => {
    if (window.confirm('Reload projects from src/services/seedData.ts? This will update projects to match your code file.')) {
      db.resetToSeedData('projects');
      onRefresh();
      showFeedback('Successfully reloaded projects from seedData.ts code file!');
    }
  };

  const handleCopyCode = () => {
    const code = `export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};`;
    navigator.clipboard.writeText(code);
    showFeedback('Copied INITIAL_PROJECTS code to clipboard! You can paste it into seedData.ts.');
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await db.deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      onRefresh();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await db.uploadImage(file, 'project-images');
      setEditingProject((prev) =>
        prev
          ? {
              ...prev,
              cover_image: url,
              image_url: url
            }
          : null
      );
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. You can also paste an image URL directly.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Project Showcase</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Add and manage portfolio projects linked to your external case studies (Behance, Dribbble, GitHub, Figma, live sites).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncWithSeedData}
            type="button"
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 glass-pill hover:text-white border border-white/10 hover:border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reload projects directly from src/services/seedData.ts code file"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Sync with seedData.ts</span>
          </button>

          <button
            onClick={handleCopyCode}
            type="button"
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 glass-pill hover:text-white border border-white/10 hover:border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy current projects as TypeScript code ready to paste into seedData.ts"
          >
            <Code className="w-3.5 h-3.5 text-neutral-400" />
            <span>Copy as Code</span>
          </button>

          <button
            onClick={handleCreateNew}
            type="button"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Projects Table / List */}
      <div className="rounded-2xl glass-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-neutral-400 font-mono uppercase">
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">External Case Study</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    No projects found. Click "Add Project" to showcase your first work.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => {
                  const title = proj.title || proj.name;
                  const img = proj.image_url || proj.cover_image;
                  const link = proj.case_study_url || proj.live_url;
                  return (
                    <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {img ? (
                            <img
                              src={img}
                              alt={title}
                              className="w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0 bg-neutral-900"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center bg-white/[0.03] text-neutral-500 flex-shrink-0">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <span className="font-semibold text-white block text-sm truncate">
                              {title}
                            </span>
                            <span className="text-[11px] text-neutral-400 line-clamp-1">
                              {proj.short_description || proj.description || 'No description'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-300">
                        <span className="glass-pill px-2.5 py-1 rounded-md text-[11px] border border-white/10">
                          {proj.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-400 font-mono">
                        {proj.year || '2026'}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-300">
                        {link && link !== '#' ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors max-w-xs truncate"
                          >
                            <span className="truncate">{proj.button_text || 'View Case Study ↗'}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0 text-neutral-400" />
                          </a>
                        ) : (
                          <span className="text-neutral-500 italic text-[11px]">None (Card button hidden)</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(proj)}
                            className="p-1.5 rounded-lg glass-pill text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProjectToDelete(proj)}
                            className="p-1.5 rounded-lg glass-pill text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ADD / EDIT PROJECT MODAL FORM                                */}
      {/* ============================================================ */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#10121a] border border-white/15 rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingProject.id ? 'Edit Project' : 'Add Project'}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  External case-study showcase item for your portfolio.
                </p>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-full glass-pill cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* 1. PROJECT IMAGE UPLOAD & PREVIEW */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-2 font-medium">
                  1. Project Image (Cover / Thumbnail)
                </label>
                
                <div className="space-y-3">
                  {/* Image Preview Area */}
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center">
                    {editingProject.cover_image || editingProject.image_url ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={editingProject.cover_image || editingProject.image_url}
                          alt="Project Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white glass-pill hover:bg-white/20"
                          >
                            Replace Image
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProject({
                                ...editingProject,
                                cover_image: '',
                                image_url: ''
                              })
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 glass-pill hover:bg-red-500/20"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-12 h-12 mx-auto rounded-xl glass-pill flex items-center justify-center text-neutral-400 mb-2">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-neutral-400">
                          Upload a project cover image or paste a direct image URL below.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Upload button + URL input */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl glass-pill text-xs font-medium text-neutral-200 hover:text-white flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading to Storage...' : 'Upload Image'}</span>
                    </button>

                    <input
                      type="text"
                      value={editingProject.cover_image || editingProject.image_url || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          cover_image: e.target.value,
                          image_url: e.target.value
                        })
                      }
                      placeholder="Or paste image URL (e.g. https://...)"
                      className="flex-grow px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>
              </div>

              {/* 2. PROJECT NAME */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                  2. Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.name || ''}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      name: e.target.value,
                      title: e.target.value
                    })
                  }
                  placeholder='e.g. Zwigato — Food Delivery UI'
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              {/* 3. CATEGORY */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                  3. Category *
                </label>
                <div className="space-y-2">
                  <select
                    value={selectedCategorySelect}
                    onChange={(e) => {
                      setSelectedCategorySelect(e.target.value);
                      if (e.target.value !== 'Custom...') {
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value
                        });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#161822] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>

                  {selectedCategorySelect === 'Custom...' && (
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => {
                        setCustomCategory(e.target.value);
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value
                        });
                      }}
                      placeholder="Type custom category name..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                    />
                  )}
                </div>
              </div>

              {/* 4. SHORT DESCRIPTION */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                  4. Short Description (1–2 sentences)
                </label>
                <textarea
                  rows={2}
                  value={editingProject.short_description || ''}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      short_description: e.target.value,
                      description: e.target.value
                    })
                  }
                  placeholder="A short 1–2 sentence description of the project."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 resize-none leading-relaxed"
                />
              </div>

              {/* 5. YEAR */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                  5. Year
                </label>
                <input
                  type="text"
                  value={editingProject.year || '2026'}
                  onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                  placeholder="2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              {/* 6. CASE STUDY / PROJECT URL */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                  6. Case Study / Project URL
                </label>
                <input
                  type="text"
                  value={editingProject.case_study_url || ''}
                  onChange={(e) => {
                    setUrlError('');
                    setEditingProject({
                      ...editingProject,
                      case_study_url: e.target.value,
                      live_url: e.target.value
                    });
                  }}
                  placeholder="https://behance.net/... or https://dribbble.com/... or https://github.com/..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-white text-xs focus:outline-none ${
                    urlError
                      ? 'border-red-500/80 focus:border-red-500'
                      : 'border-white/10 focus:border-white/40'
                  }`}
                />
                {urlError ? (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{urlError}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Paste external Behance, Dribbble, GitHub, Figma, or live site link. If left blank, the button will be hidden.
                  </p>
                )}
              </div>

              {/* 7. BUTTON TEXT */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                  7. Button Text (Default: "View Case Study ↗")
                </label>
                <input
                  type="text"
                  value={editingProject.button_text ?? 'View Case Study ↗'}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, button_text: e.target.value })
                  }
                  placeholder="View Case Study ↗"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Modal action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl glass-pill text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors shadow-md cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION DIALOG                                   */}
      {/* ============================================================ */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#10121a] border border-red-500/20 rounded-3xl p-6 text-left shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Delete Project?</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Are you sure you want to remove <span className="text-white font-medium">"{projectToDelete.title || projectToDelete.name}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl glass-pill text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors cursor-pointer"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
