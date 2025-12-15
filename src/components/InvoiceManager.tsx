'use client';

import { useState, useEffect } from 'react';
import { Plus, FileDown, RefreshCw, Printer } from 'lucide-react';
import { Quotation, Invoice } from '@/types';
import { LocalStorage } from '@/lib/storage';
import { PDFExporter } from '@/lib/pdf-export';
import QuotationForm from './QuotationForm';

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [convertingQuotation, setConvertingQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setInvoices(LocalStorage.getInvoices());
    setQuotations(LocalStorage.getQuotations());
  };

  const handleConvertQuotation = (quotation: Quotation) => {
    setConvertingQuotation(quotation);
  };

  const handleCreateInvoice = (quotation: Quotation) => {
    const invoice = LocalStorage.convertQuotationToInvoice(quotation.id);
    if (invoice) {
      loadData();
      setConvertingQuotation(null);
      setSelectedInvoice(invoice);
    }
  };

  const handleExportPDF = async (invoice: Invoice) => {
    try {
      await PDFExporter.exportInvoice(invoice);
    } catch (error) {
      alert('Failed to export PDF');
    }
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    try {
      PDFExporter.printInvoice(invoice);
    } catch (error) {
      alert('Failed to print invoice');
    }
  };

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      const updatedInvoice = { ...invoice, status, updatedAt: new Date().toISOString() };
      LocalStorage.saveInvoice(updatedInvoice);
      loadData();
    }
  };

  if (convertingQuotation) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setConvertingQuotation(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Invoices
          </button>
        </div>
        <QuotationForm
          quotation={convertingQuotation}
          onSave={handleCreateInvoice}
          onCancel={() => setConvertingQuotation(null)}
        />
      </div>
    );
  }

  if (selectedInvoice) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Invoice Details</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to List
            </button>
            <button
              onClick={() => handlePrintInvoice(selectedInvoice)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
            <button
              onClick={() => handleExportPDF(selectedInvoice)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FileDown size={16} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-600 mb-2">Bill To:</h3>
              <p className="text-gray-800"><strong>{selectedInvoice.customerName}</strong></p>
              <p className="text-gray-800">{selectedInvoice.customerContact}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-600 mb-2">Invoice Details</h3>
              <p className="text-gray-800"><strong>Invoice Number:</strong> {selectedInvoice.invoiceNumber}</p>
              <p className="text-gray-800"><strong>Date:</strong> {PDFExporter.formatDate(selectedInvoice.invoiceDate)}</p>
              {selectedInvoice.dueDate && (
                <p className="text-gray-800"><strong>Due Date:</strong> {PDFExporter.formatDate(selectedInvoice.dueDate)}</p>
              )}
              <p className="text-gray-800"><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  selectedInvoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  selectedInvoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedInvoice.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left py-2">Item Description</th>
                <th className="text-center py-2">Quantity</th>
                <th className="text-right py-2">Unit Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">{PDFExporter.formatCurrency(item.unitPrice)}</td>
                  <td className="text-right py-2">{PDFExporter.formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="font-semibold">Subtotal:</span>
                <span>{PDFExporter.formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              {selectedInvoice.taxRate && (
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Tax ({selectedInvoice.taxRate}%):</span>
                  <span>{PDFExporter.formatCurrency(selectedInvoice.taxAmount || 0)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold text-lg">
                <span>Total:</span>
                <span>{PDFExporter.formatCurrency(selectedInvoice.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => updateInvoiceStatus(selectedInvoice.id, 'sent')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={selectedInvoice.status !== 'draft'}
            >
              Mark as Sent
            </button>
            <button
              onClick={() => updateInvoiceStatus(selectedInvoice.id, 'paid')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={selectedInvoice.status === 'paid'}
            >
              Mark as Paid
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Invoice Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Create Invoice</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Convert Quotation to Invoice</h3>
          {quotations.length === 0 ? (
            <p className="text-gray-600">No quotations available to convert.</p>
          ) : (
            <div className="space-y-2">
              {quotations.map((quotation) => (
                <div key={quotation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{quotation.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {PDFExporter.formatDate(quotation.quotationDate)} • {PDFExporter.formatCurrency(quotation.total)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleConvertQuotation(quotation)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw size={16} />
                    <span>Convert</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No invoices found. Create your first invoice by converting a quotation.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {PDFExporter.formatDate(invoice.invoiceDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.dueDate ? PDFExporter.formatDate(invoice.dueDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {PDFExporter.formatCurrency(invoice.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleExportPDF(invoice)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Export
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}