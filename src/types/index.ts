export interface QuotationItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  type: 'quotation';
  customerName: string;
  customerContact: string;
  quotationDate: string;
  items: QuotationItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  type: 'invoice';
  invoiceNumber: string;
  customerName: string;
  customerContact: string;
  invoiceDate: string;
  dueDate?: string;
  items: QuotationItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  quotationId?: string;
  createdAt: string;
  updatedAt: string;
}

export type Document = Quotation | Invoice;

export interface MonthlyReport {
  month: string;
  year: number;
  totalInvoices: number;
  totalAmount: number;
  invoices: Invoice[];
}