'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, X, Plus, Trash2, Edit } from 'lucide-react';
import { CompanyProfile } from '@/types/profile';
import { ProfileStorage } from '@/lib/profile-storage';

interface CompanyProfileManagerProps {
  onClose: () => void;
  onSave: (profile: CompanyProfile) => void;
}

export default function CompanyProfileManager({ onClose, onSave }: CompanyProfileManagerProps) {
  const [profile, setProfile] = useState<CompanyProfile>({
    id: 'company-1',
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZip: '',
    companyCountry: '',
    companyPhone: '',
    companyEmail: '',
    companyWebsite: '',
    taxId: '',
    registrationNumber: '',
    bankName: '',
    bankAccount: '',
    bankRouting: '',
    paymentTerms: '',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    const savedProfile = ProfileStorage.getCompanyProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setLogoPreview(savedProfile.companyLogo || '');
    }
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setProfile({ ...profile, companyLogo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!profile.companyName) {
      alert('Company name is required');
      return;
    }

    ProfileStorage.saveCompanyProfile(profile);
    onSave(profile);
  };

  const handleInputChange = (field: keyof CompanyProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Company Profile & Branding</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Logo Upload */}
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Company Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Upload Logo</p>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    <Upload size={16} />
                    <span>Choose Logo</span>
                  </label>
                  {logoPreview && (
                    <button
                      onClick={() => {
                        setLogoPreview('');
                        setProfile({ ...profile, companyLogo: undefined });
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profile.companyWebsite}
                  onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={profile.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Business Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={profile.companyCity}
                  onChange={(e) => handleInputChange('companyCity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Business City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={profile.companyState}
                  onChange={(e) => handleInputChange('companyState', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={profile.companyZip}
                  onChange={(e) => handleInputChange('companyZip', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={profile.companyCountry}
                  onChange={(e) => handleInputChange('companyCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.companyPhone}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="info@yourcompany.com"
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID / VAT Number
                </label>
                <input
                  type="text"
                  value={profile.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tax ID or VAT number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={profile.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Business registration number"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={profile.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bank name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={profile.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routing Number
                </label>
                <input
                  type="text"
                  value={profile.bankRouting}
                  onChange={(e) => handleInputChange('bankRouting', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Routing number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={profile.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Net 30, Due on receipt, etc."
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={profile.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes to appear on documents"
            />
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}