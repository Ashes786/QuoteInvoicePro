export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  settings: DocumentTemplateSettings;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTemplateSettings {
  // Layout settings
  headerLayout: 'classic' | 'modern' | 'minimal';
  footerLayout: 'simple' | 'detailed' | 'none';
  logoPosition: 'top-left' | 'top-center' | 'top-right' | 'none';
  companyInfoPosition: 'left' | 'right' | 'hidden';
  
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  
  // Typography
  headerFont: string;
  bodyFont: string;
  fontSize: 'small' | 'medium' | 'large';
  
  // Table settings
  tableStyle: 'borders' | 'striped' | 'minimal';
  headerBackgroundColor: string;
  headerTextColor: string;
  
  // Footer settings
  showWatermark: boolean;
  watermarkText: string;
  showPageNumbers: boolean;
  
  // Field visibility
  showLogo: boolean;
  showCompanyInfo: boolean;
  showCustomerInfo: boolean;
  showPaymentInfo: boolean;
  showNotes: boolean;
  showTaxId: boolean;
  showRegistrationNumber: boolean;
  showDueDate: boolean;
  showBankInfo: boolean;
  showTerms: boolean;
  showCustomFields: boolean;
  
  // Custom fields
  customFields: CustomField[];
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[];
  defaultValue?: string;
  position: 'header' | 'footer' | 'items' | 'totals';
  order: number;
}

export interface DocumentFormat {
  id: string;
  name: string;
  paperSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  settings: DocumentTemplateSettings;
}