import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Plus, ChevronRight, Video, FileText, HelpCircle, ClipboardList,
  Trash2, Edit, ChevronDown, Upload, Check, Loader2, Sparkles, Volume2,
  Save, Play, Film, Link as LinkIcon, CheckCircle2, AlertCircle, Eye,
  Clock, DollarSign, Layers, CheckCircle
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { UniversalPlayer } from '../../components/player/UniversalPlayer'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi, curriculumApi, uploadApi } from '../../api'
import { Course, Category, Section, Lesson } from '../../types'

export default function CourseBuilder() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  // Stepper state
  const [activeStep, setActiveStep] = useState<'info' | 'curriculum' | 'publish'>('info')

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

  // Thumbnail Upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingMedia(true)
      const res = await uploadApi.uploadFile(file, 'thumbnails')
      setThumbnailUrl(res.url)
    } catch (err) {
      console.error('Thumbnail upload error:', err)
      alert('Failed to upload thumbnail.')
    } finally {
      setUploadingMedia(false)
    }
  }

  // Lesson Media Upload with Auto-Duration Detection
  const handleLessonMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Auto-detect duration from metadata
    try {
      const objectUrl = URL.createObjectURL(file)
      const tempMedia = document.createElement(newLessonType === 'audio' ? 'audio' : 'video')
      tempMedia.src = objectUrl
      tempMedia.onloadedmetadata = () => {
        const sec = tempMedia.duration
        if (sec && !isNaN(sec) && sec > 0) {
          const mins = Math.max(1, Math.round(sec / 60))
          setNewLessonDuration(String(mins))
        }
        URL.revokeObjectURL(objectUrl)
      }
    } catch (e) {
      console.log('Metadata duration error:', e)
    }

    try {
      setUploadingMedia(true)
      const folder = newLessonType === 'audio' ? 'audios' : 'videos'
      const res = await uploadApi.uploadFile(file, folder)
      setNewLessonMediaUrl(res.url)
    } catch (err) {
      console.error('Media upload error:', err)
      alert('Failed to upload media. Please check format or try direct link.')
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
      alert(publish ? '🎉 Course successfully published!' : 'Course draft saved successfully!')
    } catch (err: any) {
      console.error('Course save error:', err)
      alert(err.response?.data?.detail || 'Failed to save course. Please verify input fields.')
    } finally {
      setSaving(false)
    }
  }

  // Add Section to Course
  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return
    if (!courseId) {
      alert('Please save the course details first before adding sections.')
      return
    }
    try {
      setSaving(true)
      const order = sections.length + 1
      const created = await curriculumApi.createSection(courseId, {
        title: newSectionTitle.trim(),
        display_order: order,
      })
      setSections(prev => [...prev, { ...created, lessons: [] }])
      setNewSectionTitle('')
      setShowAddSection(false)
    } catch (err) {
      console.error('Add section error:', err)
      alert('Failed to add section.')
    } finally {
      setSaving(false)
    }
  }

  // Open Lesson Creator Modal
  const handleOpenAddLesson = (sectionId: number, lessonToEdit?: Lesson) => {
    setActiveSectionId(sectionId)
    if (lessonToEdit) {
      setEditingLessonId(lessonToEdit.id)
      setNewLessonTitle(lessonToEdit.title || '')
      setNewLessonType(lessonToEdit.lesson_type as any || 'video')
      setNewLessonDuration(String(lessonToEdit.duration_minutes || '15'))
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

  // Save Lesson
  const handleSaveLesson = async () => {
    if (!newLessonTitle.trim()) {
      alert('Lesson title is required')
      return
    }
    if (!activeSectionId) return

    try {
      setSaving(true)
      const targetSec = sections.find(s => s.id === activeSectionId)
      const order = (targetSec?.lessons?.length || 0) + 1

      const lessonPayload: any = {
        title: newLessonTitle.trim(),
        lesson_type: newLessonType,
        duration_minutes: Number(newLessonDuration) || 15,
        video_url: newLessonMediaUrl.trim() || undefined,
        content: newLessonContent.trim() || undefined,
        display_order: order,
        is_free_preview: false,
      }

      if (editingLessonId) {
        const updated = await curriculumApi.updateLesson(editingLessonId, lessonPayload)
        setSections(prev =>
          prev.map(sec =>
            sec.id === activeSectionId
              ? { ...sec, lessons: (sec.lessons || []).map(l => (l.id === editingLessonId ? updated : l)) }
              : sec
          )
        )
      } else {
        const created = await curriculumApi.createLesson(activeSectionId, lessonPayload)
        setSections(prev =>
          prev.map(sec =>
            sec.id === activeSectionId
              ? { ...sec, lessons: [...(sec.lessons || []), created] }
              : sec
          )
        )
      }
      setShowAddLesson(false)
      setEditingLessonId(null)
    } catch (err: any) {
      console.error('Save lesson error:', err)
      alert(err.response?.data?.detail || 'Failed to save lesson.')
    } finally {
      setSaving(false)
    }
  }

  // Delete Lesson
  const handleDeleteLesson = async (sectionId: number, lessonId: number) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return
    try {
      await curriculumApi.deleteLesson(lessonId)
      setSections(prev =>
        prev.map(sec =>
          sec.id === sectionId
            ? { ...sec, lessons: (sec.lessons || []).filter(l => l.id !== lessonId) }
            : sec
        )
      )
    } catch (err) {
      console.error('Delete lesson error:', err)
    }
  }

  // Delete Section
  const handleDeleteSection = async (sectionId: number) => {
    if (!confirm('Are you sure you want to delete this entire section and its lessons?')) return
    try {
      await curriculumApi.deleteSection(sectionId)
      setSections(prev => prev.filter(s => s.id !== sectionId))
    } catch (err) {
      console.error('Delete section error:', err)
    }
  }

  // Pre-flight checks
  const totalLessonsCount = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
  const isTitleReady = title.trim().length > 3
  const isCoverReady = !!thumbnailUrl
  const isSectionsReady = sections.length > 0
  const isLessonsReady = totalLessonsCount > 0
  const isReadyToPublish = isTitleReady && isCoverReady && isSectionsReady && isLessonsReady

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-semibold">Loading course builder & curriculum designer...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            {courseId ? `Editing: ${title || 'Course'}` : 'Create New Course'}
          </h1>
          <p className="text-xs text-slate-500">Design high-definition video masterclasses and module curriculum</p>
        </div>

        <div className="flex items-center gap-3">
          {courseId && (
            <Button
              variant="outline"
              size="sm"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => navigate(`/student/courses/${courseId}`)}
            >
              Preview as Student
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => handleSaveCourse(false)}
            disabled={saving}
            icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            Save Draft
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleSaveCourse(true)}
            disabled={saving || !isReadyToPublish}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {status === 'published' ? 'Update & Published' : 'Publish Course'}
          </Button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center justify-between gap-2">
        <button
          onClick={() => setActiveStep('info')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeStep === 'info'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Course Details & Media</span>
        </button>

        <button
          onClick={() => {
            if (!courseId) {
              alert('Please save course details first to unlock curriculum building.')
              return
            }
            setActiveStep('curriculum')
          }}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeStep === 'curriculum'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>2. Curriculum & Video Modules ({totalLessonsCount})</span>
        </button>

        <button
          onClick={() => setActiveStep('publish')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeStep === 'publish'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>3. Pre-Flight Review & Publish</span>
        </button>
      </div>

      {/* Step 1: Course Info & Cover Image */}
      {activeStep === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                General Course Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Full Stack Engineering with Next.js, FastAPI & PostgreSQL"
                    className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Short Catchy Tagline</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={e => setShortDescription(e.target.value)}
                    placeholder="A concise, high-impact summary displayed in course cards"
                    className="w-full h-10 border border-slate-300 rounded-xl px-3 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Category</label>
                    <select
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full h-10 border border-slate-300 rounded-xl px-3 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Difficulty Level</label>
                    <select
                      value={difficultyLevel}
                      onChange={e => setDifficultyLevel(e.target.value)}
                      className="w-full h-10 border border-slate-300 rounded-xl px-3 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Course Syllabus & Description</label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide detailed description of what students will achieve, prerequisites, and learning outcomes..."
                    className="w-full border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Media & Pricing */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Course Cover Thumbnail</h3>

              {thumbnailUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs aspect-video">
                  <img src={resolveMediaUrl(thumbnailUrl)} alt="Thumbnail" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setThumbnailUrl('')}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 text-white hover:bg-black text-[11px] font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-700 font-bold">Upload Course Cover Image</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 10MB</p>
                </div>
              )}

              <label className="w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>{uploadingMedia ? 'Uploading...' : 'Choose Thumbnail File'}</span>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              </label>
            </div>

            {/* Pricing Model */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Course Pricing</h3>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={e => setIsFree(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-700">Make this course free for all students</span>
              </label>

              {!isFree && (
                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Course Price (USD $)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full h-10 border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button onClick={() => handleSaveCourse(false)} className="w-full py-3 font-bold">
              Save & Continue to Curriculum
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Curriculum & Video Modules */}
      {activeStep === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Course Curriculum & Video Lectures</h3>
              <p className="text-xs text-slate-500">Organize your course into structured sections and high-definition video modules</p>
            </div>
            <Button
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddSection(true)}
            >
              Add New Section
            </Button>
          </div>

          {/* Add Section Modal / Box */}
          {showAddSection && (
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">Add New Curriculum Section</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={e => setNewSectionTitle(e.target.value)}
                  placeholder="e.g. Section 1: Foundations & Architecture Setup"
                  className="flex-1 h-10 border border-blue-300 rounded-xl px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Sections List */}
          <div className="space-y-4">
            {sections.map((section, sIdx) => (
              <div key={section.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Section {sIdx + 1}: {section.title}
                    </span>
                    <span className="text-[11px] text-slate-500">({section.lessons?.length || 0} lessons)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenAddLesson(section.id)}
                    >
                      Add Lesson
                    </Button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lessons in Section */}
                <div className="divide-y divide-slate-100 p-2">
                  {(section.lessons || []).length > 0 ? (
                    section.lessons!.map((lesson, lIdx) => (
                      <div
                        key={lesson.id}
                        className="p-3 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.lesson_type === 'video' && <Video className="w-4 h-4 text-blue-600" />}
                          {lesson.lesson_type === 'audio' && <Volume2 className="w-4 h-4 text-emerald-600" />}
                          {lesson.lesson_type === 'quiz' && <HelpCircle className="w-4 h-4 text-violet-600" />}
                          {lesson.lesson_type === 'assignment' && <ClipboardList className="w-4 h-4 text-amber-600" />}
                          {lesson.lesson_type === 'text' && <FileText className="w-4 h-4 text-slate-500" />}

                          <div>
                            <p className="text-xs font-bold text-slate-900">{lesson.title}</p>
                            <p className="text-[10px] text-slate-400 capitalize">
                              {lesson.lesson_type} • {lesson.duration_minutes || 15} mins
                              {lesson.video_url && ' • Video Ready'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenAddLesson(section.id, lesson)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Lesson"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(section.id, lesson.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Lesson"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No lessons added to this section yet. Click "Add Lesson" above.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Lesson Modal */}
          {showAddLesson && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {editingLessonId ? 'Edit Lesson Module' : 'Add New Lesson Module'}
                  </h3>
                  <button
                    onClick={() => setShowAddLesson(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 rounded-md cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Lesson Title *</label>
                    <input
                      type="text"
                      required
                      value={newLessonTitle}
                      onChange={e => setNewLessonTitle(e.target.value)}
                      placeholder="e.g. Asynchronous Microservices & PostgreSQL"
                      className="w-full h-10 border border-slate-300 rounded-xl px-3 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Lesson Type</label>
                    <select
                      value={newLessonType}
                      onChange={e => setNewLessonType(e.target.value as any)}
                      className="w-full h-10 border border-slate-300 rounded-xl px-3 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="video">Video Lecture (Upload / Stream / YouTube)</option>
                      <option value="audio">Audio Lecture (Upload / Stream)</option>
                      <option value="text">Article / Documentation</option>
                      <option value="quiz">Interactive Quiz</option>
                      <option value="assignment">Project Assignment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={newLessonDuration}
                    onChange={e => setNewLessonDuration(e.target.value)}
                    className="w-32 h-10 border border-slate-300 rounded-xl px-3 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Video / Audio Uploader & Direct Link */}
                {(newLessonType === 'video' || newLessonType === 'audio') && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        {newLessonType === 'audio' ? 'Audio Source' : 'Video Source'}
                      </label>
                      <div className="flex items-center gap-1 p-0.5 bg-slate-200 rounded-lg text-[11px]">
                        <button
                          type="button"
                          onClick={() => setMediaInputType('upload')}
                          className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                            mediaInputType === 'upload' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaInputType('link')}
                          className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                            mediaInputType === 'link' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          Direct URL / YouTube
                        </button>
                      </div>
                    </div>

                    {mediaInputType === 'upload' ? (
                      <div className="space-y-2">
                        <label className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <span>{uploadingMedia ? 'Uploading video to Cloudinary / Storage...' : `Select ${newLessonType === 'audio' ? 'Audio' : 'Video'} File`}</span>
                          <span className="text-[10px] text-slate-400 font-normal">MP4, WebM, MOV, MKV up to 250MB (Duration auto-calculated)</span>
                          <input
                            type="file"
                            accept={newLessonType === 'audio' ? 'audio/*' : 'video/*'}
                            onChange={handleLessonMediaUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <input
                        type="url"
                        value={newLessonMediaUrl}
                        onChange={e => setNewLessonMediaUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or https://res.cloudinary.com/..."
                        className="w-full h-10 border border-slate-300 rounded-xl px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}

                    {/* Live Preview Player */}
                    {newLessonMediaUrl && (
                      <div className="mt-3 p-3 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 px-1">
                          Live Lecture Stream Preview
                        </p>
                        <UniversalPlayer
                          url={newLessonMediaUrl}
                          title={newLessonTitle || 'Lecture Preview'}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Lesson Content / Notes / Code Snippets</label>
                  <textarea
                    rows={3}
                    value={newLessonContent}
                    onChange={e => setNewLessonContent(e.target.value)}
                    placeholder="Write lecture summary, reading materials, or starter code..."
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <Button variant="ghost" onClick={() => setShowAddLesson(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveLesson}>
                    {editingLessonId ? 'Save Changes' : 'Add Lesson'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Publish & Pre-Flight Review */}
      {activeStep === 'publish' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pre-Flight Review & Quality Assurance</h3>
            <p className="text-xs text-slate-500">Ensure all curriculum elements meet publishing guidelines</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isTitleReady ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {isTitleReady ? <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
              <div>
                <p className="text-xs font-bold">Course Title & Metadata</p>
                <p className="text-[11px] opacity-80">{isTitleReady ? 'Configured properly' : 'Please provide a descriptive title'}</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isCoverReady ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {isCoverReady ? <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
              <div>
                <p className="text-xs font-bold">Cover Thumbnail Image</p>
                <p className="text-[11px] opacity-80">{isCoverReady ? 'High-definition cover uploaded' : 'Please upload a course thumbnail'}</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isSectionsReady ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {isSectionsReady ? <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
              <div>
                <p className="text-xs font-bold">Curriculum Sections</p>
                <p className="text-[11px] opacity-80">{isSectionsReady ? `${sections.length} structured sections` : 'Add at least 1 section'}</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isLessonsReady ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {isLessonsReady ? <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
              <div>
                <p className="text-xs font-bold">Video & Content Modules</p>
                <p className="text-[11px] opacity-80">{isLessonsReady ? `${totalLessonsCount} lectures configured` : 'Add at least 1 lesson'}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Current Status: <span className="uppercase text-blue-600">{status}</span></h4>
              <p className="text-xs text-slate-500">Publishing makes this course immediately available to all enrolled students.</p>
            </div>

            <Button
              onClick={() => handleSaveCourse(true)}
              disabled={!isReadyToPublish || saving}
              className="font-bold py-3 px-6 shadow-md"
              icon={<Sparkles className="w-4 h-4" />}
            >
              {status === 'published' ? 'Save & Maintain Live' : 'Publish Course Now'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
