import { useState, useEffect } from 'react'
import { Search, Star, Users, Clock, ChevronRight, Loader2, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi, enrollmentApi } from '../../api'
import { Course, Category, Enrollment } from '../../types'

const difficultyLevels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'All_Levels']

export default function BrowseCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [enrolledMap, setEnrolledMap] = useState<Record<number, boolean>>({})
  const [search, setSearch] = useState('')
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('All Levels')
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
            category_id: selectedCatId || undefined,
            difficulty: selectedLevel !== 'All Levels' ? selectedLevel.toLowerCase() : undefined,
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
  }, [search, selectedCatId, selectedLevel])

  const handleEnroll = async (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation()
    try {
      setEnrollingId(courseId)
      await enrollmentApi.enrollCourse(courseId)
      setEnrolledMap(prev => ({ ...prev, [courseId]: true }))
      navigate(`/student/learn/${courseId}`)
    } catch (err) {
      console.error('Enrollment error:', err)
      // Navigate to detail page if additional enrollment details needed
      navigate(`/student/courses/${courseId}`)
    } finally {
      setEnrollingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-700 text-slate-900">Explore Courses</h2>
        <p className="text-sm text-slate-500">Discover live courses taught by industry leaders and verified instructors</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 h-11 bg-white border border-slate-300 rounded-xl px-4 shadow-xs focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by course title, instructor, or keywords..."
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400 text-slate-900"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-slate-600 font-medium">
            Clear
          </button>
        )}
      </div>

      {/* Category and Level Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCatId(null)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            selectedCatId === null
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
          }`}
        >
          All Categories
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCatId(c.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCatId === c.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            {c.name}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium hidden sm:inline">Level:</label>
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="h-8 border border-slate-200 rounded-lg px-2 text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {difficultyLevels.map(l => (
              <option key={l} value={l}>
                {l.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing {courses.length} live courses from database</span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Fetching real courses from LMS server...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map(c => {
            const isEnrolled = enrolledMap[c.id]
            const priceTag = c.is_free || !c.price || Number(c.price) === 0 ? 'Free' : `$${c.price}`

            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between group"
                onClick={() => navigate(`/student/courses/${c.id}`)}
              >
                <div>
                  <div className="relative overflow-hidden bg-slate-100">
                    {c.thumbnail_url ? (
                      <img
                        src={resolveMediaUrl(c.thumbnail_url)}
                        alt={c.title}
                        className="w-full h-44 object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base">
                        {c.title}
                      </div>
                    )}
                    {isEnrolled && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="success">Enrolled</Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md shadow-xs ${
                          priceTag === 'Free' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                        }`}
                      >
                        {priceTag}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="muted">{c.category?.name || 'General'}</Badge>
                      <Badge variant="muted">{c.difficulty_level || 'All Levels'}</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-2">{c.short_description || c.description}</p>
                    <p className="text-xs text-slate-600 font-medium mb-3">
                      By {c.instructor?.name || 'Platform Instructor'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {c.rating ? Number(c.rating).toFixed(1) : '4.9'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {c.total_students_enrolled || 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {c.estimated_duration_hours ? `${c.estimated_duration_hours}h` : 'Self-paced'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {isEnrolled ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      iconRight={<ChevronRight className="w-3.5 h-3.5" />}
                      onClick={e => {
                        e.stopPropagation()
                        navigate(`/student/learn/${c.id}`)
                      }}
                    >
                      Resume Learning
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={enrollingId === c.id}
                      onClick={e => handleEnroll(e, c.id)}
                    >
                      {enrollingId === c.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enrolling...
                        </>
                      ) : (
                        'Enroll Now'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            Try adjusting your search keywords, category filters, or level selections.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch('')
              setSelectedCatId(null)
              setSelectedLevel('All Levels')
            }}
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
