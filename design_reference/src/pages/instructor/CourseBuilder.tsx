import { useState } from 'react'
import { Plus, ChevronRight, Video, FileText, HelpCircle, ClipboardList, GripVertical, Trash2, Edit2, ChevronDown, Check, Globe, Save } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

interface Lesson { id: number; title: string; type: 'video' | 'text' | 'quiz' | 'assignment'; duration: string; status: 'draft' | 'published' }
interface Section { id: number; title: string; lessons: Lesson[]; open: boolean }

const lessonIcon = (t: Lesson['type']) => {
  const base = 'w-3.5 h-3.5'
  if (t === 'video')      return <Video className={`${base} text-blue-500`} />
  if (t === 'text')       return <FileText className={`${base} text-slate-500`} />
  if (t === 'quiz')       return <HelpCircle className={`${base} text-violet-500`} />
  return                         <ClipboardList className={`${base} text-amber-500`} />
}

const initSections: Section[] = [
  { id: 1, open: true, title: 'Getting Started with React', lessons: [
    { id: 1, title: 'Introduction to React and JSX',              type: 'video',      duration: '14:32', status: 'published' },
    { id: 2, title: 'Setting Up Your Development Environment',    type: 'video',      duration: '8:45',  status: 'published' },
    { id: 3, title: 'Understanding Components and Props',         type: 'text',       duration: '—',     status: 'published' },
    { id: 4, title: 'Section 1 Knowledge Check',                  type: 'quiz',       duration: '—',     status: 'published' },
  ]},
  { id: 2, open: true, title: 'React Hooks Deep Dive', lessons: [
    { id: 5, title: 'useState and useEffect Fundamentals',        type: 'video',      duration: '22:18', status: 'published' },
    { id: 6, title: 'Custom Hooks and Reusable Patterns',         type: 'video',      duration: '18:40', status: 'draft'     },
    { id: 7, title: 'Hooks Best Practices Assignment',            type: 'assignment', duration: '—',     status: 'draft'     },
  ]},
  { id: 3, open: false, title: 'State Management at Scale', lessons: [
    { id: 8, title: 'Context API vs Redux Toolkit',               type: 'video',      duration: '26:12', status: 'draft'     },
    { id: 9, title: 'Zustand and Jotai — Modern Alternatives',    type: 'video',      duration: '—',     status: 'draft'     },
  ]},
]

const steps = [
  { label: 'Basic Info',   icon: '📋' },
  { label: 'Curriculum',  icon: '📚' },
  { label: 'Media',       icon: '🎬' },
  { label: 'Settings',    icon: '⚙️'  },
  { label: 'Review',      icon: '🚀' },
]

export default function CourseBuilder() {
  const [step, setStep]         = useState(1)
  const [sections, setSections] = useState<Section[]>(initSections)
  const [title, setTitle]       = useState('React Fundamentals')
  const [desc, setDesc]         = useState('Master React with hooks, context API, and modern patterns. Build production-ready applications from scratch.')

  const toggle = (id: number) => setSections(s => s.map(sec => sec.id === id ? { ...sec, open: !sec.open } : sec))
  const total  = sections.reduce((s, sec) => s + sec.lessons.length, 0)
  const pub    = sections.reduce((s, sec) => s + sec.lessons.filter(l => l.status === 'published').length, 0)

  return (
    <div className="flex gap-6 max-w-[1200px]">

      {/* Main */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Step indicator */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center overflow-x-auto scrollbar-none">
            {steps.map((s, i) => {
              const done    = i + 1 < step
              const active  = i + 1 === step
              return (
                <div key={s.label} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => setStep(i + 1)}
                    className={[
                      'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors',
                      active  ? 'bg-blue-50 text-blue-700' :
                      done    ? 'text-emerald-600 hover:bg-emerald-50' :
                      'text-slate-400 hover:text-slate-600 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <div className={[
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                      active ? 'bg-blue-600 text-white' :
                      done   ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500',
                    ].join(' ')}>
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
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div>
              <h2 className="font-display text-lg font-700 text-slate-900">Basic Information</h2>
              <p className="text-sm text-slate-400 mt-0.5">Define your course&apos;s identity and target audience.</p>
            </div>
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Course Title *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full h-10 border border-slate-300 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Description *</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
                <p className="text-xs text-slate-400 mt-1">{desc.length}/500 characters</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Category *</label>
                  <select className="w-full h-10 border border-slate-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Development</option><option>Design</option><option>Data Science</option><option>Business</option><option>AI/ML</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Difficulty Level</label>
                  <select className="w-full h-10 border border-slate-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Language</label>
                <select className="w-full h-10 border border-slate-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option>English</option><option>Spanish</option><option>French</option><option>German</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button iconRight={<ChevronRight className="w-4 h-4" />} onClick={() => setStep(2)}>Continue to Curriculum</Button>
            </div>
          </div>
        )}

        {/* Step 2: Curriculum */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-display text-base font-700 text-slate-900">Curriculum Builder</h2>
                <p className="text-xs text-slate-400">{sections.length} sections · {total} lessons · {pub} published</p>
              </div>
              <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />}>Add Section</Button>
            </div>

            {sections.map((section, si) => (
              <div key={section.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left border-b border-slate-200"
                >
                  <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${section.open ? '' : '-rotate-90'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Section {si + 1}: {section.title}</p>
                    <p className="text-xs text-slate-400">{section.lessons.length} lessons</p>
                  </div>
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <button className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"><Edit2 className="w-3.5 h-3.5 text-slate-400" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </button>

                {section.open && (
                  <div>
                    {section.lessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 group transition-colors">
                        <GripVertical className="w-4 h-4 text-slate-200 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          {lessonIcon(lesson.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{lesson.title}</p>
                          {lesson.duration !== '—' && <p className="text-xs text-slate-400">{lesson.duration}</p>}
                        </div>
                        <Badge variant={lesson.status === 'published' ? 'success' : 'muted'}>{lesson.status}</Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"><Edit2 className="w-3.5 h-3.5 text-slate-400" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                        </div>
                      </div>
                    ))}
                    <div className="px-5 py-3 flex gap-4">
                      {[
                        { type: 'video', label: 'Video', icon: <Video className="w-3.5 h-3.5" /> },
                        { type: 'text',  label: 'Text',  icon: <FileText className="w-3.5 h-3.5" /> },
                        { type: 'quiz',  label: 'Quiz',  icon: <HelpCircle className="w-3.5 h-3.5" /> },
                      ].map(t => (
                        <button key={t.type} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                          <Plus className="w-3 h-3" />{t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button iconRight={<ChevronRight className="w-4 h-4" />} onClick={() => setStep(3)}>Continue to Media</Button>
            </div>
          </div>
        )}

        {/* Steps 3-4 */}
        {(step === 3 || step === 4) && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div className="text-4xl mb-3">{step === 3 ? '🎬' : '⚙️'}</div>
            <h2 className="font-display text-lg font-700 text-slate-900 mb-2">{step === 3 ? 'Media & Thumbnail' : 'Course Settings'}</h2>
            <p className="text-sm text-slate-500 mb-8">{step === 3 ? 'Upload your course thumbnail (16:9, min 1280×720) and an optional promotional video.' : 'Configure enrollment, access type, pricing, and notification preferences.'}</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
              <Button iconRight={<ChevronRight className="w-4 h-4" />} onClick={() => setStep(step + 1)}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div>
              <h2 className="font-display text-lg font-700 text-slate-900">Review & Publish</h2>
              <p className="text-sm text-slate-400 mt-0.5">Double-check everything before making it live.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Ready to publish!</p>
                <p className="text-xs text-emerald-600 mt-0.5">All required fields are complete. Your course meets the publishing requirements.</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                ['Course Title', title],
                ['Category', 'Development'],
                ['Level', 'Beginner'],
                ['Sections', sections.length.toString()],
                ['Total Lessons', total.toString()],
                ['Published Lessons', `${pub} / ${total}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-3">
                  <span className="text-sm text-slate-500">{k}</span>
                  <span className="text-sm font-semibold text-slate-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" icon={<Save className="w-4 h-4" />}>Save as Draft</Button>
              <Button variant="success" icon={<Globe className="w-4 h-4" />}>Publish Course</Button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar summary */}
      <div className="w-60 flex-shrink-0 hidden xl:block">
        <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Course Summary</p>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-1">{title || 'Untitled Course'}</h3>
            <Badge variant="muted">Draft</Badge>
          </div>
          <div className="space-y-2.5 text-sm mb-5">
            {[['Sections', sections.length], ['Lessons', total], ['Published', pub], ['Students', 0]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-400">{k}</span>
                <span className="font-semibold text-slate-800">{v}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Button size="sm" variant="outline" fullWidth>Preview</Button>
            <Button size="sm" fullWidth icon={<Save className="w-3.5 h-3.5" />}>Save Draft</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
