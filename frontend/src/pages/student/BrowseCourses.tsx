import React, { useState, useEffect } from 'react'
import { Search, Star, Clock, ChevronRight, Loader2, BookOpen, CheckCircle2, SlidersHorizontal, Users, BarChart2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { CourseCardSkeleton } from '../../components/ui/Skeletons'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi, enrollmentApi } from '../../api'
import { Course, Category, Enrollment } from '../../types'

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const priceFilters = ['All Prices', 'Free', 'Paid']

export default function BrowseCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [enrolledMap, setEnrolledMap] = useState<Record<number, boolean>>({})
  
  const [search, setSearch] = useState('')
  const [catId, setCatId] = useState<number | 'All'>('All')
  const [level, setLevel] = useState<string>('All Levels')
  const [showFree, setShowFree] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrollingId, setEnrollingId] = useState<number | null>(null)
  
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const [coursesRes, catsRes, myEnrollments] = await Promise.allSettled([
          courseApi.getCourses({
            search: search.trim() || undefined,
            category_id: catId !== 'All' ? catId : undefined,
            difficulty: level !== 'All Levels' ? level.toLowerCase() : undefined,
          }),
          courseApi.getCategories(),
          enrollmentApi.getMyCourses(),
        ])

        if (active) {
          if (coursesRes.status === 'fulfilled') {
            setCourses(coursesRes.value || [])
          }
          if (catsRes.status === 'fulfilled') {
            setCategories(catsRes.value || [])
          }
          if (myEnrollments.status === 'fulfilled') {
            const map: Record<number, boolean> = {}
            ;(myEnrollments.value || []).forEach((e: Enrollment) => {
              map[e.course_id] = true
            })
            setEnrolledMap(map)
          }
        }
      } catch (err) {
        console.error('Error loading course catalog:', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    const timer = setTimeout(fetchData, 200)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [search, catId, level])

  const handleEnroll = async (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation()
    try {
      setEnrollingId(courseId)
      await enrollmentApi.enrollCourse(courseId)
      setEnrolledMap(prev => ({ ...prev, [courseId]: true }))
      navigate(`/student/learn/${courseId}`)
    } catch (err) {
      console.error('Enrollment error:', err)
      navigate(`/student/courses/${courseId}`)
    } finally {
      setEnrollingId(null)
    }
  }

  const filtered = courses.filter(c => {
    if (showFree) {
      return c.is_free || !c.price || Number(c.price) === 0
    }
    return true
  })

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">Browse Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">Discover new skills and advance your career</p>
        </div>
        <Badge variant="muted" className="mt-1">{filtered.length} courses</Badge>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 h-14 bg-white border border-slate-200 rounded-2xl px-5 premium-shadow hover:border-indigo-300 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search courses and instructors…" 
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" 
          />
          <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={() => setCatId('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${catId === 'All' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
            All
          </button>
          {categories.map(c => (
            <button 
              key={c.id} 
              onClick={() => setCatId(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${catId === c.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              {c.name}
            </button>
          ))}
          
          <div className="ml-auto flex items-center gap-2">
            <select 
              value={level} 
              onChange={e => setLevel(e.target.value)} 
              className="h-8 px-3 border border-slate-200 rounded-xl text-xs text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-semibold"
            >
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer select-none">
              <input type="checkbox" checked={showFree} onChange={e => setShowFree(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Free only
            </label>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <CourseCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map(c => {
            const isEnrolled = enrolledMap[c.id]
            const priceTag = c.is_free || !c.price || Number(c.price) === 0 ? 'Free' : `$${c.price}`
            
            return (
              <article
                key={c.id}
                onClick={() => navigate(`/student/courses/${c.id}`)}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow hover:premium-shadow-hover transition-all duration-300 cursor-pointer group flex flex-col hover:-translate-y-1.5"
              >
                <div className="relative overflow-hidden" style={{ height: 160 }}>
                  {c.thumbnail_url ? (
                    <img src={resolveMediaUrl(c.thumbnail_url)} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 bg-slate-100" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold px-4 text-center">
                      {c.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {isEnrolled && (
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="success" dot>Enrolled</Badge>
                    </div>
                  )}
                  
                  <div className="absolute top-2.5 right-2.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${priceTag === 'Free' ? 'bg-emerald-500 text-white' : 'bg-slate-900/90 text-white backdrop-blur-sm'}`}>
                      {priceTag}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Badge variant="default">{c.category?.name || 'General'}</Badge>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-medium">{c.difficulty_level || 'All Levels'}</span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">{c.title}</h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-1">{c.instructor?.name || 'Instructor'}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 mt-auto pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-700">{c.rating ? Number(c.rating).toFixed(1) : '4.9'}</span>
                    </span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(c.total_students_enrolled || 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.estimated_duration_hours ? `${c.estimated_duration_hours}h` : 'Self-paced'}</span>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/student/learn/${c.id}`) }}
                      className="w-full h-8 border border-blue-300 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                    >
                      Continue Learning <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      disabled={enrollingId === c.id}
                      onClick={e => handleEnroll(e, c.id)}
                      className="w-full h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center"
                    >
                      {enrollingId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enroll Now'}
                    </button>
                  )}
                </div>
              </article>
            )
          })}

          {filtered.length === 0 && (
            <div className="col-span-full">
              <EmptyState 
                icon={Search}
                title="No courses found"
                description="We couldn't find any courses matching your search or filters. Try adjusting them."
                actionLabel="Clear Filters"
                onAction={() => {
                  setSearch('')
                  setCatId('All')
                  setLevel('All Levels')
                  setShowFree(false)
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
