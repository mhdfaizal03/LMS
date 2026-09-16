import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Plus, ChevronRight, Video, FileText, HelpCircle, ClipboardList,
  Trash2, Edit, ChevronDown, Upload, Check, Loader2, Sparkles, Volume2, Save, Play, Film, Link as LinkIcon
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { courseApi, curriculumApi, uploadApi } from '../../api'
import { Course, Category, Section, Lesson } from '../../types'

export default function CourseBuilder() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  // Form states
  const [courseId, setCourseId] = useState<number | null>(id ? Number(id) : null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner')
  const [price, setPrice] = useState('0')
  const [isFree, setIsFree] = useState(true)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [status, setStatus] = useState('draft')

  const [categories, setCategories] = useState<Category[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)

  // Section Modal states
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [showAddSection, setShowAddSection] = useState(false)

  // Lesson Modal states
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null)
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonType, setNewLessonType] = useState<'video' | 'audio' | 'text' | 'quiz' | 'assignment'>('video')
  const [newLessonDuration, setNewLessonDuration] = useState('15')
  const [newLessonMediaUrl, setNewLessonMediaUrl] = useState('')
  const [newLessonContent, setNewLessonContent] = useState('')
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [mediaInputType, setMediaInputType] = useState<'upload' | 'link'>('upload')

  // Load initial data
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const cats = await courseApi.getCategories()
        setCategories(cats || [])

        if (courseId) {
          const c = await courseApi.getCourseDetail(courseId)
          if (c) {
            setTitle(c.title || '')
            setSlug(c.slug || '')
            setDescription(c.description || (c as any).full_description || '')
            setShortDescription(c.short_description || '')
            setCategoryId(c.category_id || '')
            setDifficultyLevel(c.difficulty_level || 'Beginner')
            setPrice(String(c.price || '0'))
            setIsFree(c.is_free !== undefined ? c.is_free : true)
            setThumbnailUrl(c.thumbnail_url || (c as any).thumbnail || '')
            setStatus(c.status || 'draft')
            setSections(c.sections || [])
          }
        }
      } catch (err) {
        console.error('Error loading course builder:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [courseId])

  // Cloudinary Thumbnail Upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingMedia(true)
      const res = await uploadApi.uploadFile(file, 'thumbnails')
      setThumbnailUrl(res.url)
    } catch (err) {
      console.error('Thumbnail upload error:', err)
      alert('Failed to upload thumbnail to Cloudinary.')
    } finally {
      setUploadingMedia(false)
    }
  }

  // Cloudinary Lesson Media Upload (Video or Audio)
  const handleLessonMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingMedia(true)
      const folder = newLessonType === 'audio' ? 'audios' : 'videos'
      const res = await uploadApi.uploadFile(file, folder)
      setNewLessonMediaUrl(res.url)
    } catch (err) {
      console.error('Media upload error:', err)
      alert('Failed to upload media to Cloudinary.')
    } finally {
      setUploadingMedia(false)
    }
  }

  // Save course metadata
  const handleSaveCourse = async (publish: boolean = false) => {
    if (!title.trim()) {
      alert('Course title is required')
      return
    }
    try {
      setSaving(true)
      const payload: Partial<Course> = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: description.trim(),
        short_description: shortDescription.trim() || description.substring(0, 150),
        category_id: categoryId ? Number(categoryId) : undefined,
        difficulty_level: difficultyLevel,
        price: isFree ? 0 : Number(price),
        is_free: isFree,
        thumbnail_url: thumbnailUrl,
        status: publish ? 'published' : status,
      }

      let saved: Course
      if (courseId) {
        saved = await courseApi.updateCourse(courseId, payload)
      } else {
        saved = await courseApi.createCourse(payload)
        setCourseId(saved.id)
      }
      setStatus(saved.status)
      alert(publish ? 'Course published successfully!' : 'Course draft saved successfully!')
    } catch (err: any) {
      console.error('Course save error:', err)
      alert(err.response?.data?.detail || 'Failed to save course. Please check inputs.')
    } finally {
      setSaving(false)
    }
  }

  // Add Section to Course
  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return
    if (!courseId) {
      alert('Please save the course first before adding sections.')
      return
    }
    try {
      const section = await curriculumApi.createSection(courseId, {
        title: newSectionTitle.trim(),
        order: sections.length,
      })
      setSections([...sections, { ...section, lessons: [] }])
      setNewSectionTitle('')
      setShowAddSection(false)
    } catch (err) {
      console.error('Create section error:', err)
      alert('Failed to create section. Ensure course is saved.')
    }
  }

  // Delete Section
  const handleDeleteSection = async (sectionId: number) => {
    if (!window.confirm('Delete this section and all its lessons?')) return
    try {
      await curriculumApi.deleteSection(sectionId)
      setSections(prev => prev.filter(s => s.id !== sectionId))
    } catch (err) {
      console.error('Delete section error:', err)
    }
  }

  // Open Lesson Form (Create or Edit)
  const handleOpenLessonForm = (sectionId: number, lessonToEdit?: Lesson) => {
    setActiveSectionId(sectionId)
    if (lessonToEdit) {
      setEditingLessonId(lessonToEdit.id)
      setNewLessonTitle(lessonToEdit.title || '')
      setNewLessonType((lessonToEdit.lesson_type as any) || 'video')
      setNewLessonDuration(String(lessonToEdit.duration_minutes || Math.round((lessonToEdit.duration_seconds || 900) / 60)))
      setNewLessonMediaUrl(lessonToEdit.video_url || '')
      setNewLessonContent(lessonToEdit.content || '')
    } else {
      setEditingLessonId(null)
      setNewLessonTitle('')
      setNewLessonType('video')
      setNewLessonDuration('15')
      setNewLessonMediaUrl('')
      setNewLessonContent('')
    }
    setShowAddLesson(true)
  }

  // Save Lesson (Create or Update)
  const handleSaveLesson = async () => {
    if (!activeSectionId || !newLessonTitle.trim()) {
      alert('Please provide a lesson title.')
      return
    }
    try {
      const durationNum = Number(newLessonDuration) || 15
      const payload: Partial<Lesson> = {
        title: newLessonTitle.trim(),
        lesson_type: newLessonType,
        duration_minutes: durationNum,
        duration_seconds: durationNum * 60,
        video_url: newLessonMediaUrl.trim() || undefined,
        content: newLessonContent.trim() || undefined,
      }

      if (editingLessonId) {
        const updated = await curriculumApi.updateLesson(editingLessonId, payload)
        setSections(prev =>
          prev.map(s =>
            s.id === activeSectionId
              ? {
                  ...s,
                  lessons: (s.lessons || []).map(l => (l.id === editingLessonId ? { ...l, ...updated } : l)),
                }
              : s
          )
        )
      } else {
        const created = await curriculumApi.createLesson(activeSectionId, payload)
        setSections(prev =>
          prev.map(s => (s.id === activeSectionId ? { ...s, lessons: [...(s.lessons || []), created] } : s))
        )
      }

      setShowAddLesson(false)
      setEditingLessonId(null)
      setNewLessonTitle('')
      setNewLessonMediaUrl('')
      setNewLessonContent('')
    } catch (err) {
      console.error('Save lesson error:', err)
      alert('Failed to save lesson.')
    }
  }

  // Delete Lesson
  const handleDeleteLesson = async (sectionId: number, lessonId: number) => {
    if (!window.confirm('Delete this lesson?')) return
    try {
      await curriculumApi.deleteLesson(lessonId)
      setSections(prev =>
        prev.map(s => (s.id === sectionId ? { ...s, lessons: (s.lessons || []).filter(l => l.id !== lessonId) } : s))
      )
    } catch (err) {
      console.error('Delete lesson error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading course builder...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-display font-700 text-slate-900">
              {courseId ? `Editing Course: ${title || 'Untitled'}` : 'Create New Course'}
            </h2>
            <Badge variant={status === 'published' ? 'success' : 'warning'}>{status}</Badge>
          </div>
          <p className="text-xs text-slate-500">Live editor connected directly to FastAPI & Cloudinary CDN</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/instructor/courses')}>
            Back to Courses
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={saving}
            onClick={() => handleSaveCourse(false)}
            icon={<Save className="w-3.5 h-3.5" />}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            size="sm"
            disabled={saving}
            onClick={() => handleSaveCourse(true)}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Publish Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Course Info & Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900">Course Details</h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Course Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Modern Full-Stack Web Development & Cloud Architecture"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Difficulty Level</label>
                <select
                  value={difficultyLevel}
                  onChange={e => setDifficultyLevel(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Course Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Write what students will achieve in this comprehensive course..."
                className="w-full border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Curriculum Builder Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Curriculum & Video Modules</h3>
                <p className="text-xs text-slate-500">Organize your modules, video lessons, audio lectures & quizzes</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddSection(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Section / Module
              </Button>
            </div>

            {/* Add Section Form */}
            {showAddSection && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">Section Title</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={e => setNewSectionTitle(e.target.value)}
                    placeholder="e.g. Module 1: Architecture & Backend Services"
                    className="flex-1 h-9 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button size="sm" onClick={handleAddSection}>
                    Save Section
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddSection(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Section list */}
            <div className="space-y-4">
              {sections.length > 0 ? (
                sections.map((sec, sIdx) => (
                  <div key={sec.id || sIdx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                    <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                          {sIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          {sec.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenLessonForm(sec.id)}
                          icon={<Plus className="w-3.5 h-3.5" />}
                        >
                          Add Lesson
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 p-2">
                      {(sec.lessons || []).map((les, lIdx) => (
                        <div key={les.id || lIdx} className="px-3 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/60 rounded-lg transition-colors">
                          <div className="flex items-center gap-2.5">
                            {les.lesson_type === 'video' && <Video className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                            {les.lesson_type === 'audio' && <Volume2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                            {les.lesson_type === 'quiz' && <HelpCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />}
                            {les.lesson_type === 'assignment' && <ClipboardList className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                            {les.lesson_type === 'text' && <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                            <div>
                              <p className="font-medium text-slate-800">{les.title}</p>
                              {les.video_url && (
                                <span className="text-[10px] text-blue-600 font-mono flex items-center gap-1 mt-0.5">
                                  <Film className="w-3 h-3" /> Video Linked
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 font-mono text-[11px]">{les.duration_minutes || Math.round((les.duration_seconds || 900) / 60)}m</span>
                            <button
                              type="button"
                              onClick={() => handleOpenLessonForm(sec.id, les)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(sec.id, les.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(sec.lessons || []).length === 0 && (
                        <p className="text-center text-xs text-slate-400 py-3">No lessons in this module yet. Click &quot;Add Lesson&quot; above.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                  No modules created yet. Click &quot;Add Section / Module&quot; above to organize your lessons.
                </div>
              )}
            </div>

            {/* Add / Edit Lesson Modal */}
            {showAddLesson && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-200 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                    {editingLessonId ? 'Edit Lesson' : 'Create New Lesson'}
                  </h4>
                  <Badge variant="default">{newLessonType.toUpperCase()}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Lesson Title</label>
                    <input
                      type="text"
                      required
                      value={newLessonTitle}
                      onChange={e => setNewLessonTitle(e.target.value)}
                      placeholder="e.g. Asynchronous Microservices with FastAPI"
                      className="w-full h-9 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Lesson Type</label>
                    <select
                      value={newLessonType}
                      onChange={e => setNewLessonType(e.target.value as any)}
                      className="w-full h-9 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="video">Video Lecture (Cloudinary / Stream)</option>
                      <option value="audio">Audio Lesson (Cloudinary / MP3)</option>
                      <option value="text">Article / Documentation</option>
                      <option value="quiz">Interactive Quiz</option>
                      <option value="assignment">Assignment / Project</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      min="1"
                      value={newLessonDuration}
                      onChange={e => setNewLessonDuration(e.target.value)}
                      className="w-full h-9 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Video / Audio Media Section */}
                {(newLessonType === 'video' || newLessonType === 'audio') && (
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        {newLessonType === 'audio' ? 'Audio Source' : 'Video Source'}
                      </label>
                      <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-[11px]">
                        <button
                          type="button"
                          onClick={() => setMediaInputType('upload')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                            mediaInputType === 'upload' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600'
                          }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaInputType('link')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                            mediaInputType === 'link' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600'
                          }`}
                        >
                          Direct URL
                        </button>
                      </div>
                    </div>

                    {mediaInputType === 'upload' ? (
                      <div className="flex items-center gap-3">
                        <label className="px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-2 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingMedia ? 'Uploading to Cloudinary CDN...' : `Select ${newLessonType === 'audio' ? 'Audio' : 'Video'} File`}</span>
                          <input
                            type="file"
                            accept={newLessonType === 'audio' ? 'audio/*' : 'video/*'}
                            onChange={handleLessonMediaUpload}
                            className="hidden"
                          />
                        </label>
                        {newLessonMediaUrl && (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Uploaded & Linked
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          value={newLessonMediaUrl}
                          onChange={e => setNewLessonMediaUrl(e.target.value)}
                          placeholder="https://commondatastorage.googleapis.com/... or https://res.cloudinary.com/..."
                          className="w-full h-9 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Live Media Player Preview */}
                    {newLessonMediaUrl && (
                      <div className="mt-3 p-2 bg-slate-900 rounded-xl overflow-hidden">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5 px-1">
                          Live Media Preview
                        </p>
                        {newLessonType === 'video' ? (
                          <video
                            controls
                            src={newLessonMediaUrl}
                            className="w-full max-h-48 rounded-lg bg-black object-contain"
                          />
                        ) : (
                          <audio controls src={newLessonMediaUrl} className="w-full" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Lesson Content / Study Notes</label>
                  <textarea
                    rows={3}
                    value={newLessonContent}
                    onChange={e => setNewLessonContent(e.target.value)}
                    placeholder="Write detailed lecture transcript, code snippets, or reading assignments..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <Button size="sm" onClick={handleSaveLesson}>
                    {editingLessonId ? 'Save Lesson Changes' : 'Add Lesson'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddLesson(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Media & Pricing Sidebar */}
        <div className="space-y-6">
          {/* Thumbnail Uploader */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900">Course Cover (Cloudinary)</h3>

            {thumbnailUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-36 object-cover" />
                <button
                  onClick={() => setThumbnailUrl('')}
                  className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white hover:bg-black text-[11px] font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="w-full h-36 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <p className="text-xs text-slate-600 font-medium">Upload cover image</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 10MB</p>
              </div>
            )}

            <label className="w-full py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingMedia ? 'Uploading to Cloudinary...' : 'Upload Thumbnail'}</span>
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
            </label>
          </div>

          {/* Pricing Model */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900">Pricing Model</h3>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFree}
                onChange={e => setIsFree(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs font-medium text-slate-700">Make this course free for all students</span>
            </label>

            {!isFree && (
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Course Price (USD $)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full h-9 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
