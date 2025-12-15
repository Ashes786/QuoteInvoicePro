'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Search, Filter } from 'lucide-react';
import { CatalogItem, ItemCategory } from '@/types/items';
import { ItemCatalogStorage } from '@/lib/item-catalog-storage';

interface ItemCatalogManagerProps {
  onClose: () => void;
  onSelectItem: (item: CatalogItem) => void;
}

export default function ItemCatalogManager({ onClose, onSelectItem }: ItemCatalogManagerProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    ItemCatalogStorage.initializeDefaultData();
    setItems(ItemCatalogStorage.getCatalogItems());
    setCategories(ItemCatalogStorage.getCategories());
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesActive = showInactive || item.isActive;
    
    return matchesSearch && matchesCategory && matchesActive;
  });

  const createNewItem = () => {
    setEditingItem({
      id: `item-${Date.now()}`,
      name: '',
      description: '',
      unitPrice: 0,
      category: categories[0]?.id || '',
      sku: '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsCreating(true);
  };

  const saveItem = () => {
    if (!editingItem || !editingItem.name || editingItem.unitPrice <= 0) {
      alert('Item name and valid price are required');
      return;
    }

    ItemCatalogStorage.saveCatalogItem(editingItem);
    setItems(ItemCatalogStorage.getCatalogItems());
    setEditingItem(null);
    setIsCreating(false);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      ItemCatalogStorage.deleteCatalogItem(id);
      setItems(ItemCatalogStorage.getCatalogItems());
    }
  };

  const editItem = (item: CatalogItem) => {
    setEditingItem(item);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  const updateItemField = (field: keyof CatalogItem, value: any) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  const toggleItemActive = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const updatedItem = { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() };
      ItemCatalogStorage.saveCatalogItem(updatedItem);
      setItems(ItemCatalogStorage.getCatalogItems());
    }
  };

  if (editingItem) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {isCreating ? 'Create New Item' : 'Edit Item'}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <button
                onClick={saveItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{isCreating ? 'Create' : 'Save'}</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => updateItemField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={editingItem.sku || ''}
                  onChange={(e) => updateItemField('sku', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SKU or item code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price *
                </label>
                <input
                  type="number"
                  value={editingItem.unitPrice}
                  onChange={(e) => updateItemField('unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={editingItem.category || ''}
                  onChange={(e) => updateItemField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editingItem.description || ''}
                onChange={(e) => updateItemField('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Item description (optional)"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingItem.isActive}
                onChange={(e) => updateItemField('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active (available for selection)
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Item Catalog</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search items..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show inactive</span>
              </label>
            </div>
          </div>

          {/* Add Item Button */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Items ({filteredItems.length})
            </h3>
            <button
              onClick={createNewItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items found</p>
              <p className="text-gray-400 mt-2">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first item to get started'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    !item.isActive ? 'opacity-60 bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      {item.sku && (
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => editItem(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        ${item.unitPrice.toFixed(2)}
                      </p>
                      {item.category && (
                        <p className="text-xs text-gray-500">
                          {categories.find(c => c.id === item.category)?.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleItemActive(item.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          item.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                      {item.isActive && (
                        <button
                          onClick={() => {
                            onSelectItem(item);
                            onClose();
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}