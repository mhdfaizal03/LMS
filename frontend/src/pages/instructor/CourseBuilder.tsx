import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Plus, ChevronRight, Video, FileText, HelpCircle, ClipboardList,
  Trash2, Edit, ChevronDown, Upload, Check, Loader2, Sparkles, Volume2, Save
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

  // Section / Lesson Modal states
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [showAddSection, setShowAddSection] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null)

  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonType, setNewLessonType] = useState<'video' | 'audio' | 'text' | 'quiz' | 'assignment'>('video')
  const [newLessonDuration, setNewLessonDuration] = useState('15')
  const [newLessonMediaUrl, setNewLessonMediaUrl] = useState('')
  const [newLessonContent, setNewLessonContent] = useState('')
  const [showAddLesson, setShowAddLesson] = useState(false)

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
            setDescription(c.description || '')
            setShortDescription(c.short_description || '')
            setCategoryId(c.category_id || '')
            setDifficultyLevel(c.difficulty_level || 'Beginner')
            setPrice(String(c.price || '0'))
            setIsFree(c.is_free || false)
            setThumbnailUrl(c.thumbnail_url || '')
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
        order: sections.length + 1,
      })
      setSections([...sections, { ...section, lessons: [] }])
      setNewSectionTitle('')
      setShowAddSection(false)
    } catch (err) {
      console.error('Create section error:', err)
    }
  }

  // Add Lesson to Section
  const handleAddLesson = async () => {
    if (!activeSectionId || !newLessonTitle.trim()) return
    try {
      const lesson = await curriculumApi.createLesson(activeSectionId, {
        title: newLessonTitle.trim(),
        lesson_type: newLessonType,
        duration_minutes: Number(newLessonDuration) || 15,
        video_url: newLessonMediaUrl,
        content: newLessonContent,
        order: 1,
      })
      setSections(prev =>
        prev.map(s => (s.id === activeSectionId ? { ...s, lessons: [...(s.lessons || []), lesson] } : s))
      )
      setNewLessonTitle('')
      setNewLessonMediaUrl('')
      setNewLessonContent('')
      setShowAddLesson(false)
    } catch (err) {
      console.error('Create lesson error:', err)
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
          <p className="text-xs text-slate-500">Live editor connected directly to FastAPI & Cloudinary</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/instructor/courses')}>
            Back
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={saving}
            onClick={() => handleSaveCourse(false)}
            icon={<Save className="w-3.5 h-3.5" />}
          >
            Save Draft
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
        {/* Left 2 Cols: Course Form & Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900">Course Information</h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Course Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Modern React & Cloud Engineering"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Description</label>
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
                <h3 className="text-base font-semibold text-slate-900">Curriculum Structure</h3>
                <p className="text-xs text-slate-500">Add sections, lessons, videos, audios, quizzes & assignments</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddSection(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Section
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
                    placeholder="e.g. Module 1: Foundations & Architecture"
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
                  <div key={sec.id || sIdx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        {sIdx + 1}. {sec.title}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setActiveSectionId(sec.id)
                          setShowAddLesson(true)
                        }}
                        icon={<Plus className="w-3.5 h-3.5" />}
                      >
                        Add Lesson
                      </Button>
                    </div>

                    <div className="divide-y divide-slate-100 p-2">
                      {(sec.lessons || []).map((les, lIdx) => (
                        <div key={les.id || lIdx} className="px-3 py-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {les.lesson_type === 'video' && <Video className="w-3.5 h-3.5 text-blue-500" />}
                            {les.lesson_type === 'audio' && <Volume2 className="w-3.5 h-3.5 text-emerald-500" />}
                            {les.lesson_type === 'quiz' && <HelpCircle className="w-3.5 h-3.5 text-violet-500" />}
                            {les.lesson_type === 'assignment' && <ClipboardList className="w-3.5 h-3.5 text-amber-500" />}
                            {les.lesson_type === 'text' && <FileText className="w-3.5 h-3.5 text-slate-500" />}
                            <span className="font-medium text-slate-800">{les.title}</span>
                          </div>
                          <span className="text-slate-400">{les.duration_minutes || 15}m</span>
                        </div>
                      ))}
                      {(sec.lessons || []).length === 0 && (
                        <p className="text-center text-xs text-slate-400 py-3">No lessons in this section yet.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                  No sections created yet. Click &quot;Add Section&quot; above to organize your modules.
                </div>
              )}
            </div>

            {/* Add Lesson Modal */}
            {showAddLesson && (
              <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-4">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  New Lesson for Section #{activeSectionId}
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Lesson Title</label>
                    <input
                      type="text"
                      value={newLessonTitle}
                      onChange={e => setNewLessonTitle(e.target.value)}
                      placeholder="e.g. Asynchronous Microservices"
                      className="w-full h-9 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Lesson Type</label>
                    <select
                      value={newLessonType}
                      onChange={e => setNewLessonType(e.target.value as any)}
                      className="w-full h-9 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="video">Video Stream (Cloudinary)</option>
                      <option value="audio">Audio Lecture (Cloudinary)</option>
                      <option value="text">Article / Notes</option>
                      <option value="quiz">Interactive Quiz</option>
                      <option value="assignment">Assignment / Project</option>
                    </select>
                  </div>
                </div>

                {/* Cloudinary media uploader for video/audio */}
                {(newLessonType === 'video' || newLessonType === 'audio') && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Upload {newLessonType === 'audio' ? 'Audio (.mp3, .wav)' : 'Video (.mp4, .webm)'} to Cloudinary
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-2 shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingMedia ? 'Uploading to Cloudinary CDN...' : 'Select Media File'}</span>
                        <input type="file" onChange={handleLessonMediaUpload} className="hidden" />
                      </label>
                      {newLessonMediaUrl && (
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Cloudinary Stream Linked
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Lesson Notes / Content</label>
                  <textarea
                    rows={3}
                    value={newLessonContent}
                    onChange={e => setNewLessonContent(e.target.value)}
                    placeholder="Write detailed transcript or study guide..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddLesson}>
                    Save Lesson
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
            <h3 className="text-sm font-semibold text-slate-900">Course Thumbnail (Cloudinary)</h3>

            {thumbnailUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-36 object-cover" />
                <button
                  onClick={() => setThumbnailUrl('')}
                  className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white hover:bg-black text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="w-full h-36 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <p className="text-xs text-slate-600 font-medium">Upload course cover image</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 10MB</p>
              </div>
            )}

            <label className="w-full py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer flex items-center justify-center gap-2 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingMedia ? 'Uploading to Cloudinary...' : 'Upload Thumbnail'}</span>
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
            </label>
          </div>

          {/* Pricing */}
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
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Price (USD $)</label>
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
