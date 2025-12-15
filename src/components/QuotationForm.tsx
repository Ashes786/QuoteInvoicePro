'use client';

import { useState } from 'react';
import { Plus, Save, FileDown, Printer, Edit, Trash2 } from 'lucide-react';
import { QuotationItem, Quotation } from '@/types';
import { LocalStorage } from '@/lib/storage';
import { PDFExporter } from '@/lib/pdf-export';

interface QuotationFormProps {
  quotation?: Quotation;
  onSave: (quotation: Quotation) => void;
  onCancel: () => void;
}

export default function QuotationForm({ quotation, onSave, onCancel }: QuotationFormProps) {
  const [customerName, setCustomerName] = useState(quotation?.customerName || '');
  const [customerContact, setCustomerContact] = useState(quotation?.customerContact || '');
  const [quotationDate, setQuotationDate] = useState(
    quotation?.quotationDate || new Date().toISOString().split('T')[0]
  );
  const [items, setItems] = useState<QuotationItem[]>(
    quotation?.items || [{ id: '1', name: '', quantity: 1, unitPrice: 0, total: 0 }]
  );
  const [taxRate, setTaxRate] = useState(quotation?.taxRate || 0);

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + item.total, 0);

  const calculateTax = () => calculateSubtotal() * (taxRate / 100);

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleSave = () => {
    if (!customerName || !customerContact || items.some(item => !item.name)) {
      alert('Please fill in all required fields');
      return;
    }

    const newQuotation: Quotation = {
      id: quotation?.id || `quote-${Date.now()}`,
      type: 'quotation',
      customerName,
      customerContact,
      quotationDate,
      items,
      subtotal: calculateSubtotal(),
      taxRate: taxRate > 0 ? taxRate : undefined,
      taxAmount: taxRate > 0 ? calculateTax() : undefined,
      total: calculateTotal(),
      status: 'draft',
      createdAt: quotation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    LocalStorage.saveQuotation(newQuotation);
    onSave(newQuotation);
  };

  const handleExportPDF = async () => {
    try {
      const quotationToExport: Quotation = {
        id: quotation?.id || `quote-${Date.now()}`,
        type: 'quotation',
        customerName,
        customerContact,
        quotationDate,
        items,
        subtotal: calculateSubtotal(),
        taxRate: taxRate > 0 ? taxRate : undefined,
        taxAmount: taxRate > 0 ? calculateTax() : undefined,
        total: calculateTotal(),
        status: 'draft',
        createdAt: quotation?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await PDFExporter.exportQuotation(quotationToExport);
    } catch (error) {
      alert('Failed to export PDF');
    }
  };

  const handlePrint = () => {
    try {
      const quotationToPrint: Quotation = {
        id: quotation?.id || `quote-${Date.now()}`,
        type: 'quotation',
        customerName,
        customerContact,
        quotationDate,
        items,
        subtotal: calculateSubtotal(),
        taxRate: taxRate > 0 ? taxRate : undefined,
        taxAmount: taxRate > 0 ? calculateTax() : undefined,
        total: calculateTotal(),
        status: 'draft',
        createdAt: quotation?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      PDFExporter.printQuotation(quotationToPrint);
    } catch (error) {
      alert('Failed to print quotation');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {quotation ? 'Edit Quotation' : 'Create New Quotation'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <FileDown size={16} />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Contact *
            </label>
            <input
              type="text"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email or phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quotation Date *
            </label>
            <input
              type="date"
              value={quotationDate}
              onChange={(e) => setQuotationDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Items</h3>
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <span className="font-medium text-gray-600 w-8">{index + 1}</span>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Item name/description"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Qty"
                  min="1"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Unit price"
                  min="0"
                  step="0.01"
                />
                <div className="w-32 text-right font-medium">{PDFExporter.formatCurrency(item.total)}</div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={items.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Subtotal:</span>
                <span>{PDFExporter.formatCurrency(calculateSubtotal())}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">Tax ({taxRate}%):</span>
                  <span>{PDFExporter.formatCurrency(calculateTax())}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{PDFExporter.formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
