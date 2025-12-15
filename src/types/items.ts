export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  category?: string;
  sku?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}