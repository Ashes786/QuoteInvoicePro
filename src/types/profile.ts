export interface CompanyProfile {
  id: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  companyCountry: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyLogo?: string; // Base64 encoded image
  taxId?: string;
  registrationNumber?: string;
  bankName?: string;
  bankAccount?: string;
  bankRouting?: string;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  taxId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}