import { DocumentTemplate, DocumentTemplateSettings } from '@/types/templates';

export class TemplateStorage {
  static getTemplates(): DocumentTemplate[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('documentTemplates');
    return data ? JSON.parse(data) : [];
  }

  static saveTemplate(template: DocumentTemplate): void {
    if (typeof window === 'undefined') return;
    const templates = this.getTemplates();
    const index = templates.findIndex(t => t.id === template.id);
    
    if (index >= 0) {
      templates[index] = { ...template, updatedAt: new Date().toISOString() };
    } else {
      templates.push({ ...template, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem('documentTemplates', JSON.stringify(templates));
  }

  static deleteTemplate(id: string): void {
    if (typeof window === 'undefined') return;
    const templates = this.getTemplates().filter(t => t.id !== id);
    localStorage.setItem('documentTemplates', JSON.stringify(templates));
  }

  static getTemplate(id: string): DocumentTemplate | null {
    const templates = this.getTemplates();
    return templates.find(t => t.id === id) || null;
  }

  static saveActiveTemplate(template: DocumentTemplate): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('activeTemplate', JSON.stringify(template));
  }

  static getActiveTemplate(): DocumentTemplate | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('activeTemplate');
    return data ? JSON.parse(data) : null;
  }

  static clearActiveTemplate(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('activeTemplate');
  }

  // Default templates
  static getDefaultTemplates(): DocumentTemplate[] {
    return [
      {
        id: 'modern-standard',
        name: 'Modern Standard',
        description: 'Clean, professional layout with modern styling',
        isDefault: true,
        settings: {
          headerLayout: 'modern',
          footerLayout: 'detailed',
          logoPosition: 'top-left',
          companyInfoPosition: 'right',
          paperSize: 'a4',
          orientation: 'portrait',
          margins: { top: 20, right: 20, bottom: 20, left: 20 },
          primaryColor: '#1a1a1a',
          secondaryColor: '#64748b',
          accentColor: '#3b82f6',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          borderColor: '#e5e7eb',
          headerFont: 'Inter',
          bodyFont: 'Inter',
          fontSize: 'medium',
          tableStyle: 'borders',
          headerBackgroundColor: '#f8fafc',
          headerTextColor: '#1a1a1a',
          showWatermark: false,
          watermarkText: '',
          showPageNumbers: true,
          showLogo: true,
          showCompanyInfo: true,
          showCustomerInfo: true,
          showPaymentInfo: true,
          showTaxId: true,
          showRegistrationNumber: false,
          showDueDate: true,
          showBankInfo: false,
          showTerms: true,
          showNotes: true,
          showCustomFields: false,
          customFields: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'classic-professional',
        name: 'Classic Professional',
        description: 'Traditional business document with formal styling',
        isDefault: false,
        settings: {
          headerLayout: 'classic',
          footerLayout: 'simple',
          logoPosition: 'top-center',
          companyInfoPosition: 'left',
          paperSize: 'a4',
          orientation: 'portrait',
          margins: { top: 25, right: 25, bottom: 25, left: 25 },
          primaryColor: '#1f2937',
          secondaryColor: '#374151',
          accentColor: '#dc2626',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          borderColor: '#000000',
          headerFont: 'Times New Roman',
          bodyFont: 'Times New Roman',
          fontSize: 'medium',
          tableStyle: 'striped',
          headerBackgroundColor: '#ffffff',
          headerTextColor: '#000000',
          showWatermark: true,
          watermarkText: 'DRAFT',
          showPageNumbers: true,
          showLogo: true,
          showCompanyInfo: true,
          showCustomerInfo: true,
          showPaymentInfo: true,
          showTaxId: true,
          showRegistrationNumber: true,
          showDueDate: true,
          showBankInfo: true,
          showTerms: true,
          showNotes: true,
          showCustomFields: false,
          customFields: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        description: 'Simple, clean layout with minimal styling',
        isDefault: false,
        settings: {
          headerLayout: 'minimal',
          footerLayout: 'none',
          logoPosition: 'none',
          companyInfoPosition: 'hidden',
          paperSize: 'a4',
          orientation: 'portrait',
          margins: { top: 15, right: 15, bottom: 15, left: 15 },
          primaryColor: '#000000',
          secondaryColor: '#666666',
          accentColor: '#999999',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          borderColor: '#cccccc',
          headerFont: 'Arial',
          bodyFont: 'Arial',
          fontSize: 'small',
          tableStyle: 'minimal',
          headerBackgroundColor: '#ffffff',
          headerTextColor: '#000000',
          showWatermark: false,
          watermarkText: '',
          showPageNumbers: false,
          showLogo: false,
          showCompanyInfo: false,
          showCustomerInfo: true,
          showPaymentInfo: false,
          showTaxId: false,
          showRegistrationNumber: false,
          showDueDate: false,
          showBankInfo: false,
          showTerms: false,
          showNotes: false,
          showCustomFields: false,
          customFields: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'creative-modern',
        name: 'Creative Modern',
        description: 'Modern layout with creative styling and colors',
        isDefault: false,
        settings: {
          headerLayout: 'modern',
          footerLayout: 'detailed',
          logoPosition: 'top-right',
          companyInfoPosition: 'left',
          paperSize: 'a4',
          orientation: 'portrait',
          margins: { top: 30, right: 30, bottom: 30, left: 30 },
          primaryColor: '#6366f1',
          secondaryColor: '#a78bfa',
          accentColor: '#f59e0b',
          backgroundColor: '#fef3c7',
          textColor: '#1f2937',
          borderColor: '#e5e7eb',
          headerFont: 'Inter',
          bodyFont: 'Inter',
          fontSize: 'large',
          tableStyle: 'borders',
          headerBackgroundColor: '#6366f1',
          headerTextColor: '#ffffff',
          showWatermark: false,
          watermarkText: '',
          showPageNumbers: true,
          showLogo: true,
          showCompanyInfo: true,
          showCustomerInfo: true,
          showPaymentInfo: true,
          showTaxId: true,
          showRegistrationNumber: false,
          showDueDate: true,
          showBankInfo: false,
          showTerms: true,
          showNotes: true,
          showCustomFields: true,
          customFields: [
            {
              id: 'po-number',
              name: 'PO Number',
              type: 'text',
              label: 'PO Number',
              required: false,
              position: 'header',
              order: 1
            },
            {
              id: 'department',
              name: 'Department',
              type: 'text',
              label: 'Department',
              required: false,
              position: 'header',
              order: 2
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  static saveCustomTemplate(template: DocumentTemplate): void {
    if (typeof window === 'undefined') return;
    const templates = this.getTemplates();
    const customTemplate = { ...template, isDefault: false };
    templates.push(customTemplate);
    localStorage.setItem('documentTemplates', JSON.stringify(templates));
  }
}