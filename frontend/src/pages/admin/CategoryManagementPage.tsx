import React, { useState, useEffect } from 'react';
import { courseApi } from '../../api';
import { Category } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  FolderTree, PlusCircle, Edit, Trash2, Code, Cpu, Cloud, Layout
} from 'lucide-react';

export const CategoryManagementPage: React.FC = () => {
  const { showToast } = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<number | null>(null);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const loadCategories = () => {
    setLoading(true);
    courseApi.getAllCategoriesAdmin()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await courseApi.updateCategory(editingCategory.id, { name, description, display_order: displayOrder });
        showToast('Category updated', 'success');
      } else {
        await courseApi.createCategory({ name, description, display_order: displayOrder });
        showToast('Category created', 'success');
      }
      setShowModal(false);
      setEditingCategory(null);
      loadCategories();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to save category', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteCatId) return;
    try {
      await courseApi.deleteCategory(deleteCatId);
      showToast('Category deleted', 'info');
      setDeleteCatId(null);
      loadCategories();
    } catch (err: any) {
      showToast('Failed to delete category', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Category Management</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Organize platform courses into searchable learning disciplines.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setName('');
            setDescription('');
            setDisplayOrder(0);
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Add Category
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading categories..." />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Order</th>
                <th>Courses</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 700 }}>{cat.name}</td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                    {cat.slug}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {cat.description || '—'}
                  </td>
                  <td>{cat.display_order}</td>
                  <td>
                    <span className="badge badge-secondary">{cat.courses_count || 0}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setName(cat.name);
                          setDescription(cat.description || '');
                          setDisplayOrder(cat.display_order);
                          setShowModal(true);
                        }}
                        className="btn-icon"
                      >
                        <Edit size={16} color="var(--primary)" />
                      </button>
                      <button
                        onClick={() => setDeleteCatId(cat.id)}
                        className="btn-icon"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              className="form-input"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteCatId !== null}
        onClose={() => setDeleteCatId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        isDestructive={true}
      />
    </div>
  );
};
