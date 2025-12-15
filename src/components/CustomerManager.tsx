'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, Save } from 'lucide-react';
import { Customer } from '@/types/profile';
import { ProfileStorage } from '@/lib/profile-storage';

interface CustomerManagerProps {
  onClose: () => void;
  onSave: (customer: Customer) => void;
  selectedCustomerId?: string;
}

export default function CustomerManager({ onClose, onSave, selectedCustomerId }: CustomerManagerProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setCustomers(ProfileStorage.getCustomers());
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      const customer = ProfileStorage.getCustomerById(selectedCustomerId);
      if (customer) {
        setEditingCustomer(customer);
      }
    }
  }, [selectedCustomerId]);

  const createNewCustomer = () => {
    setEditingCustomer({
      id: `customer-${Date.now()}`,
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      company: '',
      taxId: '',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsCreating(true);
  };

  const saveCustomer = () => {
    if (!editingCustomer || !editingCustomer.name || !editingCustomer.email) {
      alert('Customer name and email are required');
      return;
    }

    ProfileStorage.saveCustomer(editingCustomer);
    setEditingCustomer(null);
    setIsCreating(false);
    onSave(editingCustomer);
  };

  const deleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      ProfileStorage.deleteCustomer(id);
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const editCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingCustomer(null);
    setIsCreating(false);
  };

  const updateCustomerField = (field: keyof Customer, value: string) => {
    if (editingCustomer) {
      setEditingCustomer({ ...editingCustomer, [field]: value });
    }
  };

  if (editingCustomer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {isCreating ? 'Create New Customer' : 'Edit Customer'}
            </h2>
            <button
              onClick={cancelEdit}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => updateCustomerField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={editingCustomer.company || ''}
                  onChange={(e) => updateCustomerField('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => updateCustomerField('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editingCustomer.phone || ''}
                  onChange={(e) => updateCustomerField('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={editingCustomer.address || ''}
                  onChange={(e) => updateCustomerField('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={editingCustomer.city || ''}
                  onChange={(e) => updateCustomerField('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={editingCustomer.state || ''}
                  onChange={(e) => updateCustomerField('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={editingCustomer.zip || ''}
                  onChange={(e) => updateCustomerField('zip', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={editingCustomer.country || ''}
                  onChange={(e) => updateCustomerField('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="United States"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID
                </label>
                <input
                  type="text"
                  value={editingCustomer.taxId || ''}
                  onChange={(e) => updateCustomerField('taxId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tax ID number"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={editingCustomer.notes || ''}
                onChange={(e) => updateCustomerField('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes about this customer"
              />
            </div>
          </div>

          <div className="flex justify-end p-6 border-t bg-gray-50">
            <div className="flex space-x-3">
              <button
                onClick={cancelEdit}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomer}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Customer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Customers</h3>
            <button
              onClick={createNewCustomer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Customer</span>
            </button>
          </div>

          {customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No customers found</p>
              <p className="text-gray-400 mt-2">Create your first customer to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          {customer.company && (
                            <div className="text-sm text-gray-500">{customer.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {customer.company || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {customer.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {customer.phone || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}