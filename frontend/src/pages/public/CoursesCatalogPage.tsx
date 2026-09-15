import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Course, Category, DifficultyLevel } from '../../types';
import { courseApi } from '../../api';
import { CourseCard } from '../../components/course/CourseCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Explore All Courses
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Discover cutting-edge engineering and data courses created by industry experts.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '14px' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by title, description, or keyword..."
            style={{ paddingLeft: '42px' }}
            value={search}
            onChange={(e) => updateFilters('search', e.target.value || null)}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Category */}
          <select
            className="form-select"
            style={{ width: 'auto' }}
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
            className="form-select"
            style={{ width: 'auto' }}
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
            className="form-select"
            style={{ width: 'auto' }}
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
        <LoadingSpinner message="Searching courses..." />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Try adjusting your search query or removing active filters to discover available content."
          actionText="Clear All Filters"
          onAction={() => setSearchParams({})}
        />
      ) : (
        <div className="grid-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
