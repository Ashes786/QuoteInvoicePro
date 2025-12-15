'use client';

import { useState } from 'react';
import { 
  FileText, 
  Receipt, 
  FolderOpen, 
  BarChart3,
  Building,
  Users,
  Menu, 
  X 
} from 'lucide-react';
import CompanyProfileManager from './CompanyProfileManager';
import CustomerManager from './CustomerManager';
import { CompanyProfile } from '@/types/profile';
import { ProfileStorage } from '@/lib/profile-storage';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [showCustomerManager, setShowCustomerManager] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);

  useState(() => {
    const profile = ProfileStorage.getCompanyProfile();
    setCompanyProfile(profile);
  }, []);

  const menuItems = [
    { id: 'quotation', label: 'Quotation', icon: FileText },
    { id: 'invoice', label: 'Invoice', icon: Receipt },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const handleCompanyProfileSave = (profile: CompanyProfile) => {
    setCompanyProfile(profile);
    setShowCompanyProfile(false);
  };

  const handleCustomerManagerSave = () => {
    setShowCustomerManager(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-gray-800 ${!sidebarOpen && 'hidden'}`}>
              QuoteInvoice Pro
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Company Profile & Customer Management */}
        <div className="p-4 border-t">
          {sidebarOpen && (
            <div className="space-y-2">
              <button
                onClick={() => setShowCompanyProfile(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
              >
                <Building size={20} />
                <span className="font-medium">Company Profile</span>
              </button>
              <button
                onClick={() => setShowCustomerManager(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
              >
                <Users size={20} />
                <span className="font-medium">Customers</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>

      {/* Company Profile Modal */}
      {showCompanyProfile && (
        <CompanyProfileManager
          onClose={() => setShowCompanyProfile(false)}
          onSave={handleCompanyProfileSave}
        />
      )}

      {/* Customer Manager Modal */}
      {showCustomerManager && (
        <CustomerManager
          onClose={() => setShowCustomerManager(false)}
          onSave={handleCustomerManagerSave}
        />
      )}
    </div>
  );
}