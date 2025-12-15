import { CompanyProfile, Customer } from '@/types/profile';

export class ProfileStorage {
  static getCompanyProfile(): CompanyProfile | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('companyProfile');
    return data ? JSON.parse(data) : null;
  }

  static saveCompanyProfile(profile: CompanyProfile): void {
    if (typeof window === 'undefined') return;
    const updatedProfile = { ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem('companyProfile', JSON.stringify(updatedProfile));
  }

  static getCustomers(): Customer[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('customers');
    return data ? JSON.parse(data) : [];
  }

  static saveCustomer(customer: Customer): void {
    if (typeof window === 'undefined') return;
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    
    if (index >= 0) {
      customers[index] = { ...customer, updatedAt: new Date().toISOString() };
    } else {
      customers.push({ ...customer, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem('customers', JSON.stringify(customers));
  }

  static deleteCustomer(id: string): void {
    if (typeof window === 'undefined') return;
    const customers = this.getCustomers().filter(c => c.id !== id);
    localStorage.setItem('customers', JSON.stringify(customers));
  }

  static getCustomerById(id: string): Customer | null {
    const customers = this.getCustomers();
    return customers.find(c => c.id === id) || null;
  }
}