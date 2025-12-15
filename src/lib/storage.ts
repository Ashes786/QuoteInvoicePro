import { Quotation, Invoice, Document, MonthlyReport } from '@/types';

const STORAGE_KEYS = {
  QUOTATIONS: 'quotations',
  INVOICES: 'invoices',
  INVOICE_COUNTER: 'invoiceCounter',
};

export class LocalStorage {
  static getQuotations(): Quotation[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return data ? JSON.parse(data) : [];
  }

  static saveQuotation(quotation: Quotation): void {
    if (typeof window === 'undefined') return;
    const quotations = this.getQuotations();
    const index = quotations.findIndex(q => q.id === quotation.id);
    
    if (index >= 0) {
      quotations[index] = { ...quotation, updatedAt: new Date().toISOString() };
    } else {
      quotations.push(quotation);
    }
    
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  }

  static deleteQuotation(id: string): void {
    if (typeof window === 'undefined') return;
    const quotations = this.getQuotations().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  }

  static getInvoices(): Invoice[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return data ? JSON.parse(data) : [];
  }

  static saveInvoice(invoice: Invoice): void {
    if (typeof window === 'undefined') return;
    const invoices = this.getInvoices();
    const index = invoices.findIndex(i => i.id === invoice.id);
    
    if (index >= 0) {
      invoices[index] = { ...invoice, updatedAt: new Date().toISOString() };
    } else {
      invoices.push(invoice);
    }
    
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  static deleteInvoice(id: string): void {
    if (typeof window === 'undefined') return;
    const invoices = this.getInvoices().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  static getNextInvoiceNumber(): string {
    if (typeof window === 'undefined') return 'INV-001';
    const counter = localStorage.getItem(STORAGE_KEYS.INVOICE_COUNTER);
    const nextNumber = counter ? parseInt(counter) + 1 : 1;
    localStorage.setItem(STORAGE_KEYS.INVOICE_COUNTER, nextNumber.toString());
    return `INV-${nextNumber.toString().padStart(3, '0')}`;
  }

  static getAllDocuments(): Document[] {
    return [...this.getQuotations(), ...this.getInvoices()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  static getDocumentById(id: string): Document | null {
    const doc = this.getAllDocuments().find(d => d.id === id);
    return doc || null;
  }

  static convertQuotationToInvoice(quotationId: string): Invoice | null {
    const quotation = this.getQuotations().find(q => q.id === quotationId);
    if (!quotation) return null;

    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      type: 'invoice',
      invoiceNumber: this.getNextInvoiceNumber(),
      customerName: quotation.customerName,
      customerContact: quotation.customerContact,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: quotation.items,
      subtotal: quotation.subtotal,
      taxRate: quotation.taxRate,
      taxAmount: quotation.taxAmount,
      total: quotation.total,
      status: 'draft',
      quotationId: quotation.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveInvoice(invoice);
    return invoice;
  }

  static getMonthlyReports(year?: number): MonthlyReport[] {
    const invoices = this.getInvoices();
    const targetYear = year || new Date().getFullYear();
    
    const monthlyData: { [key: string]: MonthlyReport } = {};
    
    invoices
      .filter(invoice => new Date(invoice.invoiceDate).getFullYear() === targetYear)
      .forEach(invoice => {
        const month = new Date(invoice.invoiceDate).toLocaleString('default', { month: 'long' });
        const key = `${month}-${targetYear}`;
        
        if (!monthlyData[key]) {
          monthlyData[key] = {
            month,
            year: targetYear,
            totalInvoices: 0,
            totalAmount: 0,
            invoices: [],
          };
        }
        
        monthlyData[key].totalInvoices++;
        monthlyData[key].totalAmount += invoice.total;
        monthlyData[key].invoices.push(invoice);
      });
    
    return Object.values(monthlyData).sort((a, b) => {
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  }
}