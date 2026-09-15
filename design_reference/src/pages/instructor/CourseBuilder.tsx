import { useState } from 'react'
import { Plus, ChevronRight, Video, FileText, HelpCircle, ClipboardList, GripVertical, Trash2, Edit, ChevronDown } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

interface Lesson {
  id: number
  title: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  duration: string
  status: 'draft' | 'published'
}

interface Section {
  id: number
  title: string
  lessons: Lesson[]
  expanded: boolean
}

const lessonIcons = {
  video: <Video className="w-3.5 h-3.5 text-blue-500" />,
  text: <FileText className="w-3.5 h-3.5 text-slate-500" />,
  quiz: <HelpCircle className="w-3.5 h-3.5 text-violet-500" />,
  assignment: <ClipboardList className="w-3.5 h-3.5 text-amber-500" />,
}

const initSections: Section[] = [
  {
    id: 1, expanded: true, title: 'Getting Started with React',
    lessons: [
      { id: 1, title: 'Introduction to React and JSX', type: 'video', duration: '14:32', status: 'published' },
      { id: 2, title: 'Setting Up Your Development Environment', type: 'video', duration: '8:45', status: 'published' },
      { id: 3, title: 'Understanding Components', type: 'text', duration: '—', status: 'published' },
      { id: 4, title: 'Section 1 Quiz', type: 'quiz', duration: '—', status: 'published' },
    ]
  },
  {
    id: 2, expanded: true, title: 'React Hooks Deep Dive',
    lessons: [
      { id: 5, title: 'useState and useEffect Fundamentals', type: 'video', duration: '22:18', status: 'published' },
      { id: 6, title: 'Custom Hooks and Patterns', type: 'video', duration: '18:40', status: 'draft' },
      { id: 7, title: 'Hooks Best Practices Assignment', type: 'assignment', duration: '—', status: 'draft' },
    ]
  },
  {
    id: 3, expanded: false, title: 'State Management',
    lessons: [
      { id: 8, title: 'Context API vs Redux', type: 'video', duration: '26:12', status: 'draft' },
    ]
  },
]

const steps = ['Basic Info', 'Curriculum', 'Media', 'Settings', 'Review']

export default function CourseBuilder() {
  const [step, setStep] = useState(1)
  const [sections, setSections] = useState<Section[]>(initSections)
  const [courseTitle, setCourseTitle] = useState('React Fundamentals')
  const [courseDesc, setCourseDesc] = useState('Master React with hooks, context API, and modern development patterns. Build production-ready applications from day one.')

  const toggleSection = (id: number) => {
    setSections(sections.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s))
  }

  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0)

  return (
    <div className="flex gap-6">
      {/* Left: steps + main form */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Stepper */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hidden">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => setStep(i + 1)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${step === i + 1 ? 'bg-blue-50 text-blue-700' : i + 1 < step ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${step === i + 1 ? 'bg-blue-600 text-white' : i + 1 < step ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {i + 1}
                  </div>
                  {s}
                </button>
                {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900">Basic Information</h2>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Course Title</label>
              <input value={courseTitle} onChange={e => setCourseTitle(e.target.value)} className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Description</label>
              <textarea value={courseDesc} onChange={e => setCourseDesc(e.target.value)} rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Category</label>
                <select className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option>Development</option><option>Design</option><option>Data Science</option><option>Business</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Level</label>
                <select className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setStep(2)}>Continue to Curriculum</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Curriculum</h2>
                <p className="text-sm text-slate-500">{sections.length} sections · {totalLessons} lessons</p>
              </div>
              <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />}>Add Section</Button>
            </div>

            {sections.map(section => (
              <div key={section.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors text-left"
                >
                  <GripVertical className="w-4 h-4 text-slate-300" />
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${section.expanded ? '' : '-rotate-90'}`} />
                  <span className="text-sm font-semibold text-slate-900 flex-1">{section.title}</span>
                  <span className="text-xs text-slate-500">{section.lessons.length} lessons</span>
                  <button className="p-1 rounded hover:bg-slate-200" onClick={e => e.stopPropagation()}><Edit className="w-3.5 h-3.5 text-slate-400" /></button>
                  <button className="p-1 rounded hover:bg-red-50" onClick={e => e.stopPropagation()}><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </button>
                {section.expanded && (
                  <div>
                    {section.lessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 group">
                        <GripVertical className="w-4 h-4 text-slate-200 group-hover:text-slate-400" />
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                          {lessonIcons[lesson.type]}
                        </div>
                        <span className="text-sm text-slate-800 flex-1">{lesson.title}</span>
                        {lesson.duration !== '—' && <span className="text-xs text-slate-400">{lesson.duration}</span>}
                        <Badge variant={lesson.status === 'published' ? 'success' : 'muted'}>{lesson.status}</Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 rounded hover:bg-slate-200"><Edit className="w-3.5 h-3.5 text-slate-400" /></button>
                          <button className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2.5">
                      <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Plus className="w-3.5 h-3.5" /> Add Lesson
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Continue to Media</Button>
            </div>
          </div>
        )}

        {(step === 3 || step === 4 || step === 5) && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              {step === 3 ? 'Media & Thumbnail' : step === 4 ? 'Course Settings' : 'Review & Publish'}
            </h2>
            {step === 5 ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-emerald-800">Your course is ready to publish!</p>
                  <p className="text-xs text-emerald-600 mt-1">All required fields are complete. Review the details below before publishing.</p>
                </div>
                {[['Course Title', courseTitle], ['Description', courseDesc.slice(0, 80) + '...'], ['Category', 'Development'], ['Level', 'Beginner'], ['Total Sections', sections.length.toString()], ['Total Lessons', totalLessons.toString()]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-500">{k}</span>
                    <span className="text-sm font-medium text-slate-900">{v}</span>
                  </div>
                ))}
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button variant="success">Publish Course</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">{step === 3 ? 'Upload course thumbnail and intro video' : 'Configure enrollment, pricing, and access settings'}</p>
                <div className="flex justify-center gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                  <Button onClick={() => setStep(step + 1)}>Continue</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: course summary */}
      <div className="w-64 flex-shrink-0 hidden xl:block">
        <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Course Summary</p>
            <h3 className="text-sm font-semibold text-slate-900">{courseTitle}</h3>
            <Badge variant="muted" className="mt-1">Draft</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Sections</span><span className="font-medium text-slate-900">{sections.length}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Lessons</span><span className="font-medium text-slate-900">{totalLessons}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Students</span><span className="font-medium text-slate-900">0</span></div>
          </div>
          <div className="space-y-2">
            <Button size="sm" variant="outline" className="w-full">Preview</Button>
            <Button size="sm" className="w-full">Save Draft</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
