import { useState, useEffect } from 'react'
import { Search, Star, Users, Clock, ChevronRight, Loader2, BookOpen, Filter, Sparkles, CheckCircle2, Play, Award, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi, enrollmentApi } from '../../api'
import { Course, Category, Enrollment } from '../../types'

const difficultyLevels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const priceFilters = ['All Prices', 'Free', 'Paid']
const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest Releases', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

export default function BrowseCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [enrolledMap, setEnrolledMap] = useState<Record<number, boolean>>({})
  const [search, setSearch] = useState('')
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('All Levels')
  const [selectedPrice, setSelectedPrice] = useState<string>('All Prices')
  const [sortBy, setSortBy] = useState<string>('popular')
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
      navigate(`/student/courses/${courseId}`)
    } finally {
      setEnrollingId(null)
    }
  }

  // Filter & sort courses in memory for instantaneous UX
  const filteredAndSortedCourses = courses
    .filter(c => {
      if (selectedPrice === 'Free') {
        return c.is_free || !c.price || Number(c.price) === 0
      }
      if (selectedPrice === 'Paid') {
        return !c.is_free && Number(c.price) > 0
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.total_students_enrolled || 0) - (a.total_students_enrolled || 0)
      if (sortBy === 'rating') return (Number(b.rating) || 0) - (Number(a.rating) || 0)
      if (sortBy === 'newest') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      if (sortBy === 'price_asc') return (Number(a.price) || 0) - (Number(b.price) || 0)
      if (sortBy === 'price_desc') return (Number(b.price) || 0) - (Number(a.price) || 0)
      return 0
    })

  const getLevelBadgeColor = (lvl?: string) => {
    const l = (lvl || '').toLowerCase()
    if (l === 'beginner') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (l === 'intermediate') return 'bg-blue-50 text-blue-700 border-blue-200'
    if (l === 'advanced') return 'bg-purple-50 text-purple-700 border-purple-200'
    return 'bg-slate-50 text-slate-700 border-slate-200'
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Curated Professional Learning Paths</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white">
            Master Job-Ready Skills with Top Instructors
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Hands-on projects, high-definition video masterclasses, interactive quizzes, and verified certification on completion.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="flex-1 flex items-center gap-3 h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white focus-within:border-blue-500 transition-all">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by course topic, technology, or instructor name..."
              className="bg-transparent text-xs sm:text-sm outline-none flex-1 placeholder:text-slate-400 text-slate-900"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs text-slate-400 hover:text-slate-700 font-medium px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <label className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort By:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-11 border border-slate-200 rounded-xl px-3 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCatId(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCatId === null
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCatId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCatId === c.id
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Level & Price Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="h-8 border border-slate-200 rounded-lg px-2.5 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {difficultyLevels.map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              value={selectedPrice}
              onChange={e => setSelectedPrice(e.target.value)}
              className="h-8 border border-slate-200 rounded-lg px-2.5 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {priceFilters.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course List Status */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Showing {filteredAndSortedCourses.length} active courses</span>
        {(selectedCatId || selectedLevel !== 'All Levels' || selectedPrice !== 'All Prices' || search) && (
          <button
            onClick={() => {
              setSearch('')
              setSelectedCatId(null)
              setSelectedLevel('All Levels')
              setSelectedPrice('All Prices')
            }}
            className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Courses */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] gap-3 bg-white rounded-3xl border border-slate-200 p-12">
          <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
          <p className="text-sm text-slate-500 font-semibold">Loading real-time course catalog...</p>
        </div>
      ) : filteredAndSortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map(c => {
            const isEnrolled = enrolledMap[c.id]
            const priceTag = c.is_free || !c.price || Number(c.price) === 0 ? 'Free' : `$${c.price}`

            return (
              <div
                key={c.id}
                onClick={() => navigate(`/student/courses/${c.id}`)}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden bg-slate-900 aspect-video">
                    {c.thumbnail_url ? (
                      <img
                        src={resolveMediaUrl(c.thumbnail_url)}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-700 via-indigo-800 to-slate-900 flex items-center justify-center text-white font-display font-bold text-base p-4 text-center">
                        {c.title}
                      </div>
                    )}

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {isEnrolled && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Enrolled
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${getLevelBadgeColor(c.difficulty_level)}`}>
                        {c.difficulty_level || 'All Levels'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-lg shadow-md ${
                          priceTag === 'Free' ? 'bg-emerald-600 text-white' : 'bg-slate-950/90 text-white backdrop-blur-sm'
                        }`}
                      >
                        {priceTag}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {c.category?.name || 'Curriculum'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {c.estimated_duration_hours ? `${c.estimated_duration_hours} hrs` : 'Self-paced'}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {c.short_description || c.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                      <p className="text-slate-600 font-medium truncate max-w-[140px]">
                        By <strong className="text-slate-800">{c.instructor?.name || 'Platform Faculty'}</strong>
                      </p>

                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{c.rating ? Number(c.rating).toFixed(1) : '4.9'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({c.total_students_enrolled || 12})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action CTA */}
                <div className="p-5 pt-0">
                  {isEnrolled ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full font-bold border-blue-200 text-blue-600 hover:bg-blue-50"
                      iconRight={<ChevronRight className="w-4 h-4" />}
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
                      className="w-full font-bold shadow-xs"
                      disabled={enrollingId === c.id}
                      onClick={e => handleEnroll(e, c.id)}
                    >
                      {enrollingId === c.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enrolling...
                        </>
                      ) : (
                        `Enroll Now • ${priceTag}`
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No courses match your selected filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your filters or searching for different topics.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch('')
              setSelectedCatId(null)
              setSelectedLevel('All Levels')
              setSelectedPrice('All Prices')
            }}
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
