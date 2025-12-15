import { CatalogItem, ItemCategory } from '@/types/items';

export class ItemCatalogStorage {
  static getCatalogItems(): CatalogItem[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('itemCatalog');
    return data ? JSON.parse(data) : [];
  }

  static saveCatalogItem(item: CatalogItem): void {
    if (typeof window === 'undefined') return;
    const items = this.getCatalogItems();
    const index = items.findIndex(i => i.id === item.id);
    
    if (index >= 0) {
      items[index] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      items.push({ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem('itemCatalog', JSON.stringify(items));
  }

  static deleteCatalogItem(id: string): void {
    if (typeof window === 'undefined') return;
    const items = this.getCatalogItems().filter(i => i.id !== id);
    localStorage.setItem('itemCatalog', JSON.stringify(items));
  }

  static getCatalogItem(id: string): CatalogItem | null {
    const items = this.getCatalogItems();
    return items.find(i => i.id === id) || null;
  }

  static getCategories(): ItemCategory[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('itemCategories');
    return data ? JSON.parse(data) : [];
  }

  static saveCategory(category: ItemCategory): void {
    if (typeof window === 'undefined') return;
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    
    if (index >= 0) {
      categories[index] = { ...category, updatedAt: new Date().toISOString() };
    } else {
      categories.push({ ...category, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem('itemCategories', JSON.stringify(categories));
  }

  static deleteCategory(id: string): void {
    if (typeof window === 'undefined') return;
    const categories = this.getCategories().filter(c => c.id !== id);
    localStorage.setItem('itemCategories', JSON.stringify(categories));
  }

  static getDefaultCategories(): ItemCategory[] {
    return [
      {
        id: 'cat-services',
        name: 'Services',
        description: 'Professional services',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-products',
        name: 'Products',
        description: 'Physical products',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-materials',
        name: 'Materials',
        description: 'Raw materials and supplies',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-labor',
        name: 'Labor',
        description: 'Labor and installation',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  static initializeDefaultData(): void {
    if (typeof window === 'undefined') return;
    
    // Initialize default categories if none exist
    const existingCategories = this.getCategories();
    if (existingCategories.length === 0) {
      const defaultCategories = this.getDefaultCategories();
      defaultCategories.forEach(category => this.saveCategory(category));
    }

    // Initialize some default items if none exist
    const existingItems = this.getCatalogItems();
    if (existingItems.length === 0) {
      const defaultItems = this.getDefaultItems();
      defaultItems.forEach(item => this.saveCatalogItem(item));
    }
  }

  static getDefaultItems(): CatalogItem[] {
    return [
      {
        id: 'item-consultation',
        name: 'Initial Consultation',
        description: 'Initial project consultation and requirements gathering',
        unitPrice: 150.00,
        category: 'cat-services',
        sku: 'CONS-001',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item-design',
        name: 'Design Service',
        description: 'Professional design and mockup creation',
        unitPrice: 75.00,
        category: 'cat-services',
        sku: 'DES-001',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item-development',
        name: 'Development Hour',
        description: 'Custom software development per hour',
        unitPrice: 125.00,
        category: 'cat-services',
        sku: 'DEV-001',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item-hosting',
        name: 'Web Hosting (Monthly)',
        description: 'Shared web hosting service',
        unitPrice: 25.00,
        category: 'cat-services',
        sku: 'HOST-001',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item-domain',
        name: 'Domain Registration (Yearly)',
        description: 'Domain name registration for one year',
        unitPrice: 15.00,
        category: 'cat-services',
        sku: 'DOM-001',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  static searchItems(query: string): CatalogItem[] {
    const items = this.getCatalogItems();
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
      item.isActive && (
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.sku?.toLowerCase().includes(lowerQuery) ||
        item.category?.toLowerCase().includes(lowerQuery)
      )
    );
  }

  static getItemsByCategory(categoryId: string): CatalogItem[] {
    const items = this.getCatalogItems();
    return items.filter(item => item.isActive && item.category === categoryId);
  }
}