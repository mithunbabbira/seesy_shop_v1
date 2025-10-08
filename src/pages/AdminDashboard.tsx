import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Loader2,
  Package,
  FolderPlus
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getCategories,
  getItemsByCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  addItem,
  updateItem,
  deleteItem,
  Category,
  Item
} from '../firebase/services';
import ImageUpload from '../components/ImageUpload';
import { deleteImageFromStorage, isFirebaseStorageUrl } from '../utils/imageUpload';

// Schemas
const categorySchema = yup.object().shape({
  name: yup.string().required('Nom de catégorie requis'),
  imageUrl: yup.string().required('Image requise'),
});

const itemSchema = yup.object().shape({
  name: yup.string().required('Nom d\'article requis'),
  description: yup.string().required('Description requise'),
  price: yup.number().positive('Le prix doit être positif').required('Prix requis'),
  priceUnit: yup.string().required('Unité de prix requise'),
  imageUrl: yup.string().required('Image requise'),
  isAvailable: yup.boolean().required('Disponibilité requise'),
});

type CategoryFormData = {
  name: string;
  imageUrl: string;
};

type ItemFormData = {
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  imageUrl: string;
  isAvailable: boolean;
};

const AdminDashboard: React.FC = () => {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('categories');
  
  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  // Loading states
  const [saving, setSaving] = useState(false);

  // Forms
  const categoryForm = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
  });

  const itemForm = useForm<ItemFormData>({
    resolver: yupResolver(itemSchema),
  });

  // Effects
  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchItems(selectedCategory.id!);
    }
  }, [selectedCategory]);

  // Fetch functions
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(fetchedCategories[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (categoryId: string) => {
    try {
      const fetchedItems = await getItemsByCategory(categoryId);
      setItems(fetchedItems);
    } catch (error) {
      toast.error('Failed to fetch items');
      console.error('Error fetching items:', error);
    }
  };

  // Category functions
  const handleCategorySubmit = async (data: CategoryFormData) => {
    if (!data.imageUrl) {
      toast.error('Veuillez télécharger une image');
      return;
    }

    try {
      setSaving(true);

      // If updating and the old image was from Firebase Storage, delete it
      if (editingCategory && editingCategory.imageUrl !== data.imageUrl && 
          isFirebaseStorageUrl(editingCategory.imageUrl)) {
        await deleteImageFromStorage(editingCategory.imageUrl);
      }

      const categoryData = {
        name: data.name,
        imageUrl: data.imageUrl,
        createdAt: editingCategory?.createdAt || new Date(),
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id!, categoryData);
        toast.success('Catégorie mise à jour avec succès');
      } else {
        await addCategory(categoryData);
        toast.success('Catégorie ajoutée avec succès');
      }

      await fetchCategories();
      handleCloseCategoryModal();
    } catch (error) {
      toast.error('Échec de la sauvegarde de la catégorie');
      console.error('Error saving category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      // Delete associated image from Firebase Storage if it exists
      if (category.imageUrl && isFirebaseStorageUrl(category.imageUrl)) {
        await deleteImageFromStorage(category.imageUrl);
      }
      
      await deleteCategory(category.id!);
      toast.success('Catégorie supprimée avec succès');
      await fetchCategories();
      if (selectedCategory?.id === category.id) {
        setSelectedCategory(categories.length > 1 ? categories[0] : null);
      }
    } catch (error) {
      toast.error('Échec de la suppression de la catégorie');
      console.error('Error deleting category:', error);
    }
  };

  // Item functions
  const handleItemSubmit = async (data: ItemFormData) => {
    if (!data.imageUrl) {
      toast.error('Veuillez télécharger une image');
      return;
    }

    if (!selectedCategory) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }

    try {
      setSaving(true);

      // If updating and the old image was from Firebase Storage, delete it
      if (editingItem && editingItem.imageUrl !== data.imageUrl && 
          isFirebaseStorageUrl(editingItem.imageUrl)) {
        await deleteImageFromStorage(editingItem.imageUrl);
      }

      const itemData = {
        sku: editingItem?.sku || '1', // Keep existing SKU or default to '1' for new items
        name: data.name,
        description: data.description,
        price: data.price,
        priceUnit: data.priceUnit,
        imageUrl: data.imageUrl,
        isAvailable: data.isAvailable,
        categoryId: selectedCategory.id!,
        createdAt: editingItem?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (editingItem) {
        await updateItem(editingItem.id!, itemData);
        toast.success('Article mis à jour avec succès');
      } else {
        await addItem(itemData);
        toast.success('Article ajouté avec succès');
      }

      await fetchItems(selectedCategory.id!);
      handleCloseItemModal();
    } catch (error) {
      toast.error('Échec de la sauvegarde de l\'article');
      console.error('Error saving item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (item: Item) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      // Delete associated image from Firebase Storage if it exists
      if (item.imageUrl && isFirebaseStorageUrl(item.imageUrl)) {
        await deleteImageFromStorage(item.imageUrl);
      }
      
      await deleteItem(item.id!);
      toast.success('Article supprimé avec succès');
      if (selectedCategory) {
        await fetchItems(selectedCategory.id!);
      }
    } catch (error) {
      toast.error('Échec de la suppression de l\'article');
      console.error('Error deleting item:', error);
    }
  };

  // Modal functions
  const handleOpenCategoryModal = (category?: Category) => {
    setEditingCategory(category || null);
    
    if (category) {
      categoryForm.reset({
        name: category.name,
        imageUrl: category.imageUrl,
      });
    } else {
      categoryForm.reset({ name: '', imageUrl: '' });
    }
    
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    categoryForm.reset();
  };

  const handleOpenItemModal = (item?: Item) => {
    setEditingItem(item || null);
    
    if (item) {
      itemForm.reset({
        name: item.name,
        description: item.description,
        price: item.price,
        priceUnit: item.priceUnit,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
      });
    } else {
      itemForm.reset({ name: '', description: '', price: 0, priceUnit: '', imageUrl: '', isAvailable: true });
    }
    
    setShowItemModal(true);
  };

  const handleCloseItemModal = () => {
    setShowItemModal(false);
    setEditingItem(null);
    itemForm.reset();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your store categories and items</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'items'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            disabled={!selectedCategory}
          >
            Items ({items.length})
          </button>
        </nav>
      </div>

      {activeTab === 'categories' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
            <button
              onClick={() => handleOpenCategoryModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <FolderPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first category</p>
              <button
                onClick={() => handleOpenCategoryModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 ${
                    selectedCategory?.id === category.id
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                      >
                        {selectedCategory?.id === category.id ? 'Selected' : 'Select'}
                      </button>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenCategoryModal(category)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'items' && selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Items in {selectedCategory.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => handleOpenItemModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
              <p className="text-gray-500 mb-4">Add items to this category</p>
              <button
                onClick={() => handleOpenItemModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.name}
                        {!item.isAvailable && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Unavailable
                          </span>
                        )}
                      </h3>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary-600">
                          ${item.price.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500">
                          {item.priceUnit}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      {item.isAvailable && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenItemModal(item)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={handleCloseCategoryModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={categoryForm.handleSubmit(handleCategorySubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  {...categoryForm.register('name')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {categoryForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {categoryForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <ImageUpload
                label="Image de la catégorie"
                uploadPath="categories"
                currentImage={categoryForm.watch('imageUrl')}
                onImageUpload={(url) => {
                  categoryForm.setValue('imageUrl', url);
                  categoryForm.clearErrors('imageUrl');
                }}
              />
              {categoryForm.formState.errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {categoryForm.formState.errors.imageUrl.message}
                </p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseCategoryModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingCategory ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md bg-white rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit Item' : 'Add Item'}
              </h3>
              <button
                onClick={handleCloseItemModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={itemForm.handleSubmit(handleItemSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  {...itemForm.register('name')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {itemForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {itemForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  {...itemForm.register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {itemForm.formState.errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {itemForm.formState.errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price Unit</label>
                <input
                  {...itemForm.register('priceUnit')}
                  type="text"
                  placeholder="e.g., Euro / 1.5 kg"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {itemForm.formState.errors.priceUnit && (
                  <p className="mt-1 text-sm text-red-600">
                    {itemForm.formState.errors.priceUnit.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    {...itemForm.register('isAvailable')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Available for purchase</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...itemForm.register('description')}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {itemForm.formState.errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {itemForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              <ImageUpload
                label="Image de l'article"
                uploadPath="items"
                currentImage={itemForm.watch('imageUrl')}
                onImageUpload={(url) => {
                  itemForm.setValue('imageUrl', url);
                  itemForm.clearErrors('imageUrl');
                }}
              />
              {itemForm.formState.errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {itemForm.formState.errors.imageUrl.message}
                </p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseItemModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingItem ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;