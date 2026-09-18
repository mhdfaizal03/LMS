import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Plus, ChevronRight, Video, FileText, HelpCircle, ClipboardList, GripVertical, Trash2, Edit2, 
  ChevronDown, Check, Globe, Save, Upload, Loader2, Play, Volume2
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { UniversalPlayer } from '../../components/player/UniversalPlayer'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi, curriculumApi, uploadApi, quizApi, assignmentApi } from '../../api'
import { Course, Category, Section, Lesson } from '../../types'

const lessonIcon = (t: string) => {
  const base = 'w-3.5 h-3.5'
  if (t === 'video')      return <Video className={`${base} text-blue-500`} />
  if (t === 'audio')      return <Volume2 className={`${base} text-emerald-500`} />
  if (t === 'text')       return <FileText className={`${base} text-slate-500`} />
  if (t === 'quiz')       return <HelpCircle className={`${base} text-violet-500`} />
  return                         <ClipboardList className={`${base} text-amber-500`} />
}

const steps = [
  { label: 'Basic Info',   icon: '📋' },
  { label: 'Curriculum',  icon: '📚' },
  { label: 'Media',       icon: '🎬' },
  { label: 'Settings',    icon: '⚙️'  },
  { label: 'Review',      icon: '🚀' },
]

export default function CourseBuilder() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  
  // Data states
  const [courseId, setCourseId] = useState<number | null>(id ? Number(id) : null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [desc, setDesc] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner')
  const [price, setPrice] = useState('0')
  const [isFree, setIsFree] = useState(true)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [status, setStatus] = useState('draft')

  const [categories, setCategories] = useState<Category[]>([])
  const [sections, setSections] = useState<(Section & { open?: boolean })[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)

  // Lesson states
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null)
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonType, setNewLessonType] = useState<'video' | 'audio' | 'text' | 'quiz' | 'assignment'>('video')
  const [newLessonDuration, setNewLessonDuration] = useState('15')
  const [newLessonMediaUrl, setNewLessonMediaUrl] = useState('')
  const [newLessonContent, setNewLessonContent] = useState('')
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [mediaInputType, setMediaInputType] = useState<'upload' | 'link'>('upload')

  // Quiz states
  const [quizTimeLimit, setQuizTimeLimit] = useState('15')
  const [quizPassingScore, setQuizPassingScore] = useState('70')
  const [quizQuestions, setQuizQuestions] = useState([{ question_text: '', options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }], correct_answers: ['a'], explanation: '' }])

  // Assignment states
  const [assignmentInstructions, setAssignmentInstructions] = useState('')
  const [assignmentMaxScore, setAssignmentMaxScore] = useState('100')

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
            setDesc(c.description || (c as any).full_description || '')
            setShortDesc(c.short_description || '')
            setCategoryId(c.category_id || '')
            setDifficultyLevel(c.difficulty_level || 'Beginner')
            setPrice(String(c.price || '0'))
            setIsFree(c.is_free !== undefined ? c.is_free : true)
            setThumbnailUrl(c.thumbnail_url || (c as any).thumbnail || '')
            setStatus(c.status || 'draft')
            setSections((c.sections || []).map(s => ({ ...s, open: true })))
          }
        }
      } catch (err) {
        console.error('Error loading course:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [courseId])

  const handleSaveCourse = async (publish: boolean = false, andAdvance: boolean = false) => {
    if (!title.trim()) return alert('Course title is required')
    try {
      setSaving(true)
      const payload: any = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: desc.trim(),
        full_description: desc.trim(),
        short_description: shortDesc.trim() || desc.substring(0, 150),
        category_id: categoryId ? Number(categoryId) : undefined,
        difficulty_level: (difficultyLevel || 'beginner').toLowerCase().replace(/\s+/g, '_'),
        price: isFree ? 0 : Number(price) || 0,
        is_free: isFree,
        thumbnail: thumbnailUrl || undefined,
        thumbnail_url: thumbnailUrl || undefined,
        status: publish ? 'published' : (status || 'draft'),
      }
      let saved: Course
      if (courseId) saved = await courseApi.updateCourse(courseId, payload)
      else {
        saved = await courseApi.createCourse(payload)
        setCourseId(saved.id)
      }
      setStatus(saved.status || 'draft')
      if (publish) alert('🎉 Course published!')
      else if (andAdvance) setStep(step + 1)
      else if (step === 5) alert('Course draft saved!')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to save course.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSection = async () => {
    if (!courseId) return alert('Save course details first to unlock curriculum.')
    const t = prompt('Section title:')
    if (!t?.trim()) return
    try {
      setSaving(true)
      const created = await curriculumApi.createSection(courseId, { title: t.trim(), display_order: sections.length + 1 })
      setSections(prev => [...prev, { ...created, lessons: [], open: true }])
    } catch (err) {
      alert('Failed to add section')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSection = async (sid: number) => {
    if (!confirm('Delete section and all its lessons?')) return
    try {
      await curriculumApi.deleteSection(sid)
      setSections(prev => prev.filter(s => s.id !== sid))
    } catch (err) {}
  }

  const handleOpenAddLesson = (sid: number, lessonToEdit?: Lesson) => {
    setActiveSectionId(sid)
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

  const handleSaveLesson = async () => {
    if (!newLessonTitle.trim()) return alert('Lesson title required')
    if (!activeSectionId) return
    try {
      setSaving(true)
      const sec = sections.find(s => s.id === activeSectionId)
      const payload: any = {
        title: newLessonTitle.trim(),
        lesson_type: newLessonType,
        duration_minutes: Number(newLessonDuration) || 15,
        video_url: newLessonMediaUrl.trim() || undefined,
        content: newLessonContent.trim() || undefined,
        display_order: (sec?.lessons?.length || 0) + 1,
        is_free_preview: false,
      }
      let targetId = editingLessonId
      if (editingLessonId) {
        const up = await curriculumApi.updateLesson(editingLessonId, payload)
        setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, lessons: (s.lessons || []).map(l => l.id === editingLessonId ? up : l) } : s))
      } else {
        const cr = await curriculumApi.createLesson(activeSectionId, payload)
        targetId = cr.id
        setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, lessons: [...(s.lessons || []), cr] } : s))
      }

      if (newLessonType === 'quiz' && courseId && targetId) {
        try {
          const qz = await quizApi.createQuiz(courseId, { title: newLessonTitle.trim(), instructions: '', time_limit_minutes: Number(quizTimeLimit), passing_score: Number(quizPassingScore), max_attempts: 3 }, targetId)
          for (const q of quizQuestions) {
            if (q.question_text.trim()) {
              await quizApi.addQuestion(qz.id, { question_text: q.question_text.trim(), question_type: 'single_choice', options: q.options.filter(o => o.text.trim().length > 0), correct_answers: q.correct_answers, explanation: q.explanation.trim() || undefined, marks: 2 })
            }
          }
        } catch (e) { console.error(e) }
      }
      if (newLessonType === 'assignment' && courseId && targetId) {
        try {
          await assignmentApi.createAssignment(courseId, { title: newLessonTitle.trim(), instructions: assignmentInstructions.trim() || newLessonContent.trim(), max_score: Number(assignmentMaxScore) }, targetId)
        } catch (e) { console.error(e) }
      }
      setShowAddLesson(false)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to save lesson.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLesson = async (sid: number, lid: number) => {
    if (!confirm('Delete lesson?')) return
    try {
      await curriculumApi.deleteLesson(lid)
      setSections(prev => prev.map(s => s.id === sid ? { ...s, lessons: (s.lessons || []).filter(l => l.id !== lid) } : s))
    } catch (err) {}
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnails' | 'videos' | 'audios') => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingMedia(true)
      const res = await uploadApi.uploadFile(file, type)
      if (type === 'thumbnails') setThumbnailUrl(res.url)
      else setNewLessonMediaUrl(res.url)
    } catch (err) {
      alert('Upload failed')
    } finally {
      setUploadingMedia(false)
    }
  }

  const toggle = (id: number) => setSections(s => s.map(sec => sec.id === id ? { ...sec, open: !sec.open } : sec))
  const total = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
  const isReady = title.trim().length > 3 && !!thumbnailUrl && sections.length > 0 && total > 0

  if (loading) {
    return (
      <div className="flex gap-6 max-w-[1200px]">
        <div className="flex-1 space-y-5">
          <div className="h-16 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-[500px] bg-slate-200 rounded-xl animate-pulse" />
        </div>
        <div className="w-60 hidden xl:block">
          <div className="h-[300px] bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 max-w-[1200px]">
      {/* Main */}
      <div className="flex-1 min-w-0 space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center overflow-x-auto scrollbar-none">
            {steps.map((s, i) => {
              const done = i + 1 < step
              const active = i + 1 === step
              return (
                <div key={s.label} className="flex items-center flex-shrink-0">
                  <button onClick={() => {
                    if (!courseId && i > 0) return alert('Save basic info first')
                    setStep(i + 1)
                  }} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${active ? 'bg-blue-50 text-blue-700' : done ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${active ? 'bg-blue-600 text-white' : done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    {s.label}
                  </button>
                  {i < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h2 className="font-display text-lg font-700 text-slate-900">Basic Information</h2>
              <p className="text-sm text-slate-400 mt-0.5">Define your course's identity and target audience.</p>
            </div>
            <div className="space-y-4 max-w-xl">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Course Title *</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full h-10 border border-slate-300 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Short Catchy Tagline</label><input value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="w-full h-10 border border-slate-300 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Description *</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')} className="w-full h-10 border border-slate-300 rounded-xl px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Difficulty</label>
                  <select value={difficultyLevel} onChange={e => setDifficultyLevel(e.target.value)} className="w-full h-10 border border-slate-300 rounded-xl px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button iconRight={saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <ChevronRight className="w-4 h-4" />} onClick={() => handleSaveCourse(false, true)} disabled={saving}>Save & Continue</Button>
            </div>
          </div>
        )}

        {/* Step 2: Curriculum */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">
              <div><h2 className="font-display text-base font-700 text-slate-900">Curriculum Builder</h2><p className="text-xs text-slate-400">{sections.length} sections · {total} lessons</p></div>
              <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />} onClick={handleAddSection}>Add Section</Button>
            </div>
            {sections.map((section, si) => (
              <div key={section.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <button onClick={() => toggle(section.id)} className="w-full flex items-center gap-3 px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left border-b border-slate-200">
                  <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${section.open ? '' : '-rotate-90'}`} />
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-900">Section {si + 1}: {section.title}</p><p className="text-xs text-slate-400">{section.lessons?.length || 0} lessons</p></div>
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleDeleteSection(section.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </button>
                {section.open && (
                  <div>
                    {(section.lessons || []).map(lesson => (
                      <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 group transition-colors">
                        <GripVertical className="w-4 h-4 text-slate-200 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">{lessonIcon(lesson.lesson_type)}</div>
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 truncate">{lesson.title}</p><p className="text-xs text-slate-400">{lesson.duration_minutes} mins</p></div>
                        <Badge variant="success">Saved</Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenAddLesson(section.id, lesson)} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"><Edit2 className="w-3.5 h-3.5 text-slate-400" /></button>
                          <button onClick={() => handleDeleteLesson(section.id, lesson.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                        </div>
                      </div>
                    ))}
                    <div className="px-5 py-3 flex gap-4">
                      <Button size="sm" variant="outline" onClick={() => handleOpenAddLesson(section.id)} icon={<Plus className="w-3.5 h-3.5"/>}>Add Lesson</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-between pt-2"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button iconRight={<ChevronRight className="w-4 h-4" />} onClick={() => setStep(3)}>Continue to Media</Button></div>
          </div>
        )}

        {/* Step 3: Media */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div><h2 className="font-display text-lg font-700 text-slate-900 mb-2">Media & Thumbnail</h2><p className="text-sm text-slate-500 mb-6">Upload your course thumbnail.</p></div>
            <div className="max-w-md mx-auto space-y-4">
              {thumbnailUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video"><img src={resolveMediaUrl(thumbnailUrl)} className="w-full h-full object-cover" /><button onClick={() => setThumbnailUrl('')} className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 text-white hover:bg-black text-[11px] font-bold">Remove</button></div>
              ) : (
                <div className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" /><p className="text-xs text-slate-700 font-bold">Upload Course Cover Image</p>
                </div>
              )}
              <label className="w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" /><span>{uploadingMedia ? 'Uploading...' : 'Choose File'}</span>
                <input type="file" accept="image/*" onChange={e => handleMediaUpload(e, 'thumbnails')} className="hidden" />
              </label>
            </div>
            <div className="flex justify-between pt-6 border-t border-slate-100"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button iconRight={saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <ChevronRight className="w-4 h-4" />} onClick={() => handleSaveCourse(false, true)} disabled={saving}>Save & Continue</Button></div>
          </div>
        )}

        {/* Step 4: Settings */}
        {step === 4 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div><h2 className="font-display text-lg font-700 text-slate-900 mb-2">Settings & Pricing</h2><p className="text-sm text-slate-500 mb-6">Configure enrollment, pricing, and access.</p></div>
            <div className="max-w-md space-y-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                <span className="text-sm font-semibold text-slate-700">Make this course free for all students</span>
              </label>
              {!isFree && (
                <div><label className="text-xs font-bold text-slate-700 block mb-1">Course Price (USD $)</label><input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full h-10 border border-slate-300 rounded-xl px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              )}
            </div>
            <div className="flex justify-between pt-6 border-t border-slate-100"><Button variant="outline" onClick={() => setStep(3)}>Back</Button><Button iconRight={saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <ChevronRight className="w-4 h-4" />} onClick={() => handleSaveCourse(false, true)} disabled={saving}>Save & Continue</Button></div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div><h2 className="font-display text-lg font-700 text-slate-900">Review & Publish</h2><p className="text-sm text-slate-400 mt-0.5">Double-check everything before making it live.</p></div>
            <div className={`border rounded-xl p-4 flex items-start gap-3 ${isReady ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isReady ? 'text-emerald-600' : 'text-red-600 hidden'}`} />
              <div><p className={`text-sm font-semibold ${isReady ? 'text-emerald-800' : 'text-red-800'}`}>{isReady ? 'Ready to publish!' : 'Missing requirements'}</p><p className={`text-xs mt-0.5 ${isReady ? 'text-emerald-600' : 'text-red-600'}`}>{isReady ? 'Your course meets all requirements.' : 'Ensure title, thumbnail, and at least 1 lesson are set.'}</p></div>
            </div>
            <div className="divide-y divide-slate-100">
              {[['Course Title', title], ['Category', categories.find(c => c.id === Number(categoryId))?.name || '—'], ['Sections', sections.length.toString()], ['Total Lessons', total.toString()]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-3"><span className="text-sm text-slate-500">{k}</span><span className="text-sm font-semibold text-slate-900">{v}</span></div>
              ))}
            </div>
            <div className="flex justify-between pt-2"><Button variant="outline" onClick={() => setStep(4)}>Back</Button><div className="flex gap-3"><Button variant="outline" icon={<Save className="w-4 h-4" />} onClick={() => handleSaveCourse(false)} disabled={saving}>Save as Draft</Button><Button variant="success" icon={<Globe className="w-4 h-4" />} disabled={!isReady || saving} onClick={() => handleSaveCourse(true)}>Publish Course</Button></div></div>
          </div>
        )}
      </div>

      {/* Sidebar summary */}
      <div className="w-60 flex-shrink-0 hidden xl:block">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sticky top-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Course Summary</p>
          <div className="mb-4"><h3 className="text-sm font-semibold text-slate-900 leading-snug mb-1">{title || 'Untitled Course'}</h3><Badge variant={status === 'published' ? 'success' : 'muted'}>{status}</Badge></div>
          <div className="space-y-2.5 text-sm mb-5">
            {[['Sections', sections.length], ['Lessons', total], ['Price', isFree ? 'Free' : `$${price}`]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-slate-400">{k}</span><span className="font-semibold text-slate-800">{v}</span></div>
            ))}
          </div>
          <div className="space-y-2">
            {courseId && <Button size="sm" variant="outline" fullWidth onClick={() => navigate(`/student/courses/${courseId}`)}>Preview</Button>}
            <Button size="sm" fullWidth icon={<Save className="w-3.5 h-3.5" />} onClick={() => handleSaveCourse(false)} disabled={saving}>Save Draft</Button>
          </div>
        </div>
      </div>

      {/* Add Lesson Modal */}
      {showAddLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold">{editingLessonId ? 'Edit Lesson' : 'Add Lesson'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold block mb-1">Title</label><input type="text" value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} className="w-full h-10 border rounded-xl px-3 text-sm" /></div>
              <div><label className="text-xs font-bold block mb-1">Type</label><select value={newLessonType} onChange={e => setNewLessonType(e.target.value as any)} className="w-full h-10 border rounded-xl px-3 text-sm"><option value="video">Video</option><option value="audio">Audio</option><option value="text">Text</option><option value="quiz">Quiz</option><option value="assignment">Assignment</option></select></div>
            </div>
            <div><label className="text-xs font-bold block mb-1">Duration (mins)</label><input type="number" value={newLessonDuration} onChange={e => setNewLessonDuration(e.target.value)} className="w-full h-10 border rounded-xl px-3 text-sm" /></div>
            
            {(newLessonType === 'video' || newLessonType === 'audio') && (
              <div className="space-y-2">
                <label className="text-xs font-bold block mb-1">Media URL</label>
                <div className="flex gap-2">
                  <input type="url" value={newLessonMediaUrl} onChange={e => setNewLessonMediaUrl(e.target.value)} placeholder="https://..." className="flex-1 h-10 border rounded-xl px-3 text-sm" />
                  <label className="h-10 px-3 bg-slate-100 hover:bg-slate-200 border rounded-xl flex items-center justify-center text-sm font-semibold cursor-pointer">
                    Upload<input type="file" accept={newLessonType === 'audio' ? 'audio/*' : 'video/*'} onChange={e => handleMediaUpload(e, newLessonType === 'audio' ? 'audios' : 'videos')} className="hidden" />
                  </label>
                </div>
              </div>
            )}
            
            <div><label className="text-xs font-bold block mb-1">Content / Instructions</label><textarea rows={3} value={newLessonContent} onChange={e => setNewLessonContent(e.target.value)} className="w-full border rounded-xl p-3 text-sm" /></div>
            
            <div className="flex justify-end gap-2 pt-4 border-t"><Button variant="outline" onClick={() => setShowAddLesson(false)}>Cancel</Button><Button onClick={handleSaveLesson} disabled={saving}>{saving ? 'Saving...' : 'Save Lesson'}</Button></div>
          </div>
        </div>
      )}
    </div>
  )
}
