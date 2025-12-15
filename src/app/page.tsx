'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import QuotationForm from '@/components/QuotationForm';
import InvoiceManager from '@/components/InvoiceManager';
import DocumentList from '@/components/DocumentList';
import Reports from '@/components/Reports';
import ItemsView from '@/components/ItemsView';
import { Quotation } from '@/types';

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI;

export default function Home() {
  const [currentView, setCurrentView] = useState('quotation');
  const [editingQuotation, setEditingQuotation] = useState<Quotation | undefined>(undefined);

  // Handle Electron menu events
  useEffect(() => {
    if (!isElectron) return;

    const handleMenuAction = (action: string) => {
      switch (action) {
        case 'menu-new-quotation':
          setEditingQuotation(undefined);
          setCurrentView('quotation');
          break;
        case 'menu-new-invoice':
          setCurrentView('invoice');
          break;
        case 'menu-save':
          // Trigger save action on current form
          const event = new CustomEvent('electron-save');
          window.dispatchEvent(event);
          break;
        case 'menu-export-pdf':
          // Trigger PDF export
          const pdfEvent = new CustomEvent('electron-export-pdf');
          window.dispatchEvent(pdfEvent);
          break;
      }
    };

    // Register menu event listeners
    window.electronAPI.onMenuAction(handleMenuAction);

    // Cleanup
    return () => {
      if (isElectron) {
        window.electronAPI.removeAllListeners('menu-new-quotation');
        window.electronAPI.removeAllListeners('menu-new-invoice');
        window.electronAPI.removeAllListeners('menu-save');
        window.electronAPI.removeAllListeners('menu-export-pdf');
      }
    };
  }, [currentView]);

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
      case 'items':
        return <ItemsView />;
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