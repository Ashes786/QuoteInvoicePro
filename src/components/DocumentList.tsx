'use client';

import { useState, useEffect } from 'react';
import { FileText, Receipt, FileDown, Trash2, Eye, Printer } from 'lucide-react';
import { Document, Quotation, Invoice } from '@/types';
import { LocalStorage } from '@/lib/storage';
import { PDFExporter } from '@/lib/pdf-export';

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filter, setFilter] = useState<'all' | 'quotation' | 'invoice'>('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const allDocs = LocalStorage.getAllDocuments();
    const filteredDocs = filter === 'all' ? allDocs : allDocs.filter(doc => doc.type === filter);
    setDocuments(filteredDocs);
  };

  useEffect(() => {
    loadDocuments();
  }, [filter]);

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleExportPDF = async (document: Document) => {
    try {
      if (document.type === 'quotation') {
        await PDFExporter.exportQuotation(document as Quotation);
      } else {
        await PDFExporter.exportInvoice(document as Invoice);
      }
    } catch (error) {
      alert('Failed to export PDF');
    }
  };

  const handlePrintDocument = (document: Document) => {
    try {
      if (document.type === 'quotation') {
        PDFExporter.printQuotation(document as Quotation);
      } else {
        PDFExporter.printInvoice(document as Invoice);
      }
    } catch (error) {
      alert('Failed to print document');
    }
  };

  const handleDeleteDocument = (documentId: string, documentType: 'quotation' | 'invoice') => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      if (documentType === 'quotation') {
        LocalStorage.deleteQuotation(documentId);
      } else {
        LocalStorage.deleteInvoice(documentId);
      }
      loadDocuments();
    }
  };

  const getStatusColor = (status: string, type: 'quotation' | 'invoice') => {
    if (type === 'quotation') {
      switch (status) {
        case 'accepted': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'sent': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-800';
        case 'overdue': return 'bg-red-100 text-red-800';
        case 'sent': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const renderDocumentPreview = (document: Document) => {
    if (document.type === 'quotation') {
      const quotation = document as Quotation;
      return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">QUOTATION</h1>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-600 mb-2">Customer Information</h3>
              <p className="text-gray-800"><strong>Name:</strong> {quotation.customerName}</p>
              <p className="text-gray-800"><strong>Contact:</strong> {quotation.customerContact}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-600 mb-2">Quotation Details</h3>
              <p className="text-gray-800"><strong>Date:</strong> {PDFExporter.formatDate(quotation.quotationDate)}</p>
              <p className="text-gray-800"><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(quotation.status, 'quotation')}`}>
                  {quotation.status.toUpperCase()}
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
              {quotation.items.map((item) => (
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
                <span>{PDFExporter.formatCurrency(quotation.subtotal)}</span>
              </div>
              {quotation.taxRate && (
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Tax ({quotation.taxRate}%):</span>
                  <span>{PDFExporter.formatCurrency(quotation.taxAmount || 0)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold text-lg">
                <span>Total:</span>
                <span>{PDFExporter.formatCurrency(quotation.total)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      const invoice = document as Invoice;
      return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-600 mb-2">Bill To:</h3>
              <p className="text-gray-800"><strong>{invoice.customerName}</strong></p>
              <p className="text-gray-800">{invoice.customerContact}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-600 mb-2">Invoice Details</h3>
              <p className="text-gray-800"><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
              <p className="text-gray-800"><strong>Date:</strong> {PDFExporter.formatDate(invoice.invoiceDate)}</p>
              {invoice.dueDate && (
                <p className="text-gray-800"><strong>Due Date:</strong> {PDFExporter.formatDate(invoice.dueDate)}</p>
              )}
              <p className="text-gray-800"><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(invoice.status, 'invoice')}`}>
                  {invoice.status.toUpperCase()}
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
              {invoice.items.map((item) => (
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
                <span>{PDFExporter.formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.taxRate && (
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Tax ({invoice.taxRate}%):</span>
                  <span>{PDFExporter.formatCurrency(invoice.taxAmount || 0)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold text-lg">
                <span>Total:</span>
                <span>{PDFExporter.formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  if (selectedDocument) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedDocument.type === 'quotation' ? 'Quotation' : 'Invoice'} Details
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedDocument(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to List
            </button>
            <button
              onClick={() => handlePrintDocument(selectedDocument)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
            <button
              onClick={() => handleExportPDF(selectedDocument)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FileDown size={16} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {renderDocumentPreview(selectedDocument)}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('quotation')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'quotation' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Quotations
          </button>
          <button
            onClick={() => setFilter('invoice')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'invoice' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Invoices
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number/ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No documents found.
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {document.type === 'quotation' ? (
                          <FileText className="text-blue-600" size={20} />
                        ) : (
                          <Receipt className="text-green-600" size={20} />
                        )}
                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                          {document.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.type === 'quotation' ? 
                        (document as Quotation).id.slice(-8) : 
                        (document as Invoice).invoiceNumber
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {PDFExporter.formatDate(
                        document.type === 'quotation' ? 
                          (document as Quotation).quotationDate : 
                          (document as Invoice).invoiceDate
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {PDFExporter.formatCurrency(document.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(document.status, document.type)}`}>
                        {document.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDocument(document)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handlePrintDocument(document)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => handleExportPDF(document)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <FileDown size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(document.id, document.type)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
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