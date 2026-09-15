import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Course, Category } from '../../types';
import { courseApi } from '../../api';
import { CourseCard } from '../../components/course/CourseCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  GraduationCap, BookOpen, Award, Users, ArrowRight, CheckCircle,
  Sparkles, Code, Cpu, Cloud, Layout, ShieldCheck, PlayCircle
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      courseApi.getCourses({ limit: 6 }),
      courseApi.getCategories(),
    ]).then(([coursesData, categoriesData]) => {
      setFeaturedCourses(coursesData);
      setCategories(categoriesData);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'web-development': return <Code size={24} color="var(--primary)" />;
      case 'ai-data-science': return <Cpu size={24} color="#0ea5e9" />;
      case 'cloud-devops': return <Cloud size={24} color="#10b981" />;
      case 'ui-ux-design': return <Layout size={24} color="#f59e0b" />;
      default: return <BookOpen size={24} color="var(--primary)" />;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1.5rem 6rem',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} /> Interactive Online Learning Platform
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              color: 'var(--text-primary)',
            }}
          >
            Master Real-World Tech Skills with <br />
            <span style={{ color: 'var(--primary)', background: 'linear-gradient(135deg, var(--primary), #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Hands-On Projects & Verifiable Credentials
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Join thousands of developers and engineers mastering full-stack engineering, cloud architecture, and AI through interactive curriculum, real-time video learning, automated quizzes, and graded capstones.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explore Courses <ArrowRight size={18} />
            </Link>
            <Link to="/verify-certificate" className="btn btn-secondary btn-lg">
              <ShieldCheck size={18} /> Verify Credential
            </Link>
          </div>

          {/* Key Value Badges */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2.5rem',
              marginTop: '4rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <CheckCircle size={18} color="var(--success)" /> Automated Instant Quiz Grading
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <CheckCircle size={18} color="var(--success)" /> Real-Time Video Progress Sync
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)' }}>
              <CheckCircle size={18} color="var(--success)" /> Official Cryptographic Certificates
            </div>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Categories</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore by Field</h2>
          </div>
          <Link to="/courses" className="btn btn-secondary btn-sm">
            View All Categories <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/courses?category_id=${cat.id}`}
              className="card card-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getCategoryIcon(cat.slug)}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.name}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {cat.courses_count || 0} Courses
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Featured Curriculum</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Top Rated Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-primary btn-sm">
              Explore All Courses <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading courses..." />
          ) : (
            <div className="grid-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Instructors CTA Section */}
      <section style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div className="card glass-card" style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(129, 140, 248, 0.04))', borderColor: 'var(--primary-glow)' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            Become an Instructor on EduPulse
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Share your expertise with learners worldwide. Build comprehensive curriculum, host interactive quizzes, grade assignments, and issue certified completion certificates.
          </p>
          <Link to="/register?role=instructor" className="btn btn-primary btn-lg">
            Start Teaching Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};
