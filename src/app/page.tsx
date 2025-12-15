'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import QuotationForm from '@/components/QuotationForm';
import InvoiceManager from '@/components/InvoiceManager';
import DocumentList from '@/components/DocumentList';
import Reports from '@/components/Reports';
import { Quotation } from '@/types';

export default function Home() {
  const [currentView, setCurrentView] = useState('quotation');
  const [editingQuotation, setEditingQuotation] = useState<Quotation | undefined>(undefined);

  const handleQuotationSave = (quotation: Quotation) => {
    setEditingQuotation(undefined);
    setCurrentView('documents');
  };

  const handleQuotationCancel = () => {
    setEditingQuotation(undefined);
    setCurrentView('documents');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'quotation':
        return (
          <QuotationForm
            quotation={editingQuotation}
            onSave={handleQuotationSave}
            onCancel={handleQuotationCancel}
          />
        );
      case 'invoice':
        return <InvoiceManager />;
      case 'documents':
        return <DocumentList />;
      case 'reports':
        return <Reports />;
      default:
        return (
          <QuotationForm
            quotation={editingQuotation}
            onSave={handleQuotationSave}
            onCancel={handleQuotationCancel}
          />
        );
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
}