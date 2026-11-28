import { useEffect, useState } from 'react'
import './CategoriesSearch.css'
import {
  Tag,
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
} from 'lucide-react'

export default function CategoriesSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
const [newCategory, setNewCategory] = useState({
  name: '',
  description: '',
  items: 0,
})
const [showEditForm, setShowEditForm] = useState(false)
const [editingCategory, setEditingCategory] = useState(null)
  const [categories, setCategories] = useState(() => {
  const savedCategories = localStorage.getItem('rentify_categories')

  return savedCategories
    ? JSON.parse(savedCategories)
    : [
        { id: 1, name: 'Photography', description: 'Cameras and photography equipment', items: 12 },
        { id: 2, name: 'Electronics', description: 'Electronic devices and gadgets', items: 18 },
        { id: 3, name: 'Tools', description: 'Power tools and equipment', items: 9 },
        { id: 4, name: 'Events', description: 'Event supplies and equipment', items: 7 },
        { id: 5, name: 'Outdoor', description: 'Camping and outdoor equipment', items: 14 },
        { id: 6, name: 'Household', description: 'Home and household items', items: 11 },
      ]
})
useEffect(() => {
  localStorage.setItem('rentify_categories', JSON.stringify(categories))
}, [categories])

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const handleAddCategory = (e) => {
  e.preventDefault()

  if (!newCategory.name.trim()) return

  const category = {
    id: Date.now(),
    name: newCategory.name.trim(),
    description: newCategory.description.trim(),
    items: 0,
  }

  setCategories((prev) => [...prev, category])

  setNewCategory({
    name: '',
    description: '',
    items: 0,
  })

  setShowAddForm(false)
}
const handleEditCategory = (e) => {
  e.preventDefault()

  if (!editingCategory.name.trim()) return

  setCategories((prev) =>
    prev.map((category) =>
      category.id === editingCategory.id
        ? {
            ...category,
            name: editingCategory.name.trim(),
            description: editingCategory.description.trim(),
          }
        : category
    )
  )

  setEditingCategory(null)
  setShowEditForm(false)
}
const handleDeleteCategory = (id) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this category?'
  )

  if (!confirmDelete) return

  setCategories((prev) =>
    prev.filter((category) => category.id !== id)
  )
}
  return (
    <div className="cs-page">
      <div className="cs-header">
        <div>
          <h1>Categories & Search</h1>
          <p>Manage rental categories and organize marketplace listings.</p>
        </div>

        <button
  className="cs-add-btn"
  onClick={() => setShowAddForm(true)}
>
  <Plus size={17} />
  Add Category
</button>
      </div>

      <div className="cs-summary">
        <div className="cs-summary-card">
          <div className="cs-summary-icon">
            <Tag size={21} />
          </div>
          <div>
            <p>Total Categories</p>
            <h2>{categories.length}</h2>
          </div>
        </div>

        <div className="cs-summary-card">
          <div className="cs-summary-icon">
            <Package size={21} />
          </div>
          <div>
            <p>Total Listed Items</p>
            <h2>
              {categories.reduce((total, category) => total + category.items, 0)}
            </h2>
          </div>
        </div>
      </div>

        {showAddForm && (
  <div className="cs-modal-overlay">
    <div className="cs-modal">
      <h2>Add New Category</h2>
      <p>Enter the details for your new rental category.</p>

      <form onSubmit={handleAddCategory}>
        <label>Category Name</label>
        <input
          type="text"
          placeholder="Enter category name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Enter category description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
          rows="3"
        />

        <div className="cs-modal-actions">
          <button
            type="button"
            className="cs-cancel-btn"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>

          <button type="submit" className="cs-add-btn">
            Add Category
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{showEditForm && editingCategory && (
  <div className="cs-modal-overlay">
    <div className="cs-modal">
      <h2>Edit Category</h2>
      <p>Update the details of this rental category.</p>

      <form onSubmit={handleEditCategory}>
        <label>Category Name</label>
        <input
          type="text"
          placeholder="Enter category name"
          value={editingCategory.name}
          onChange={(e) =>
            setEditingCategory({
              ...editingCategory,
              name: e.target.value,
            })
          }
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Enter category description"
          value={editingCategory.description}
          onChange={(e) =>
            setEditingCategory({
              ...editingCategory,
              description: e.target.value,
            })
          }
          rows="3"
        />

        <div className="cs-modal-actions">
          <button
            type="button"
            className="cs-cancel-btn"
            onClick={() => {
              setEditingCategory(null)
              setShowEditForm(false)
            }}
          >
            Cancel
          </button>

          <button type="submit" className="cs-add-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      <div className="cs-content">
        <div className="cs-content-header">
          <div>
            <h2>Rental Categories</h2>
            <p>View and manage all available categories.</p>
          </div>
        </div>

        <div className="cs-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="cs-grid">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div className="cs-category-card" key={category.id}>
                <div className="cs-category-top">
                  <div className="cs-category-icon">
                    <Tag size={20} />
                  </div>

                  <div className="cs-actions">
                    <button
                        aria-label="Edit category"
                        title="Edit category"
                        onClick={() => {
                            setEditingCategory({ ...category })
                            setShowEditForm(true)
                        }}
                        >
                        <Pencil size={15} />
                        </button>
                    <button
                        aria-label="Delete category"
                        title="Delete category"
                        onClick={() => handleDeleteCategory(category.id)}
                        >
                        <Trash2 size={15} />
                        </button>
                  </div>
                </div>

                <h3>{category.name}</h3>
                <p>{category.description}</p>

                <div className="cs-category-footer">
                  <Package size={15} />
                  <span>{category.items} listed items</span>
                </div>
              </div>
            ))
          ) : (
            <div className="cs-empty">
              No categories found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
