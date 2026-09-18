import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Course, Category, DifficultyLevel } from '../../types';
import { courseApi } from '../../api';
import { CourseCard } from '../../components/course/CourseCard';
import { CourseCardSkeleton } from '../../components/ui/Skeletons';
import EmptyState from '../../components/ui/EmptyState';
import { Search, Filter, BookOpen } from 'lucide-react';

export const CoursesCatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined;
  const selectedDifficulty = (searchParams.get('difficulty') as DifficultyLevel) || undefined;
  const sortBy = searchParams.get('sort_by') || 'popular';

  useEffect(() => {
    courseApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    courseApi.getCourses({
      search: search || undefined,
      category_id: selectedCategory,
      difficulty: selectedDifficulty,
      sort_by: sortBy,
    })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [search, selectedCategory, selectedDifficulty, sortBy]);

  const updateFilters = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-800 text-slate-900 mb-2">
          Explore All Courses
        </h1>
        <p className="text-base text-slate-500">
          Discover cutting-edge engineering and data courses created by industry experts.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 premium-shadow flex flex-wrap gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-11 pr-4 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            placeholder="Search by title, description, or keyword..."
            value={search}
            onChange={(e) => updateFilters('search', e.target.value || null)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          {/* Category */}
          <select
            className="h-11 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            value={selectedCategory || ''}
            onChange={(e) => updateFilters('category_id', e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Difficulty */}
          <select
            className="h-11 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            value={selectedDifficulty || ''}
            onChange={(e) => updateFilters('difficulty', e.target.value || null)}
          >
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Sort By */}
          <select
            className="h-11 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 font-medium"
            value={sortBy}
            onChange={(e) => updateFilters('sort_by', e.target.value)}
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest Releases</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <CourseCardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 premium-shadow">
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="Try adjusting your search query or removing active filters to discover available content."
            actionLabel="Clear All Filters"
            onAction={() => setSearchParams({})}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
