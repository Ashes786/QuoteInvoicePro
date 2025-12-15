'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, FileText, Calendar } from 'lucide-react';
import { MonthlyReport, Invoice } from '@/types';
import { LocalStorage } from '@/lib/storage';
import { PDFExporter } from '@/lib/pdf-export';

export default function Reports() {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<MonthlyReport | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    loadReports();
  }, [selectedYear]);

  const loadReports = () => {
    const monthlyReports = LocalStorage.getMonthlyReports(selectedYear);
    setReports(monthlyReports);
  };

  const loadMonthDetails = (month: string) => {
    const report = reports.find(r => r.month === month);
    if (report) {
      setSelectedMonth(report);
      setInvoices(report.invoices);
    }
  };

  const getTotalInvoices = () => {
    return LocalStorage.getInvoices().length;
  };

  const getTotalRevenue = () => {
    return LocalStorage.getInvoices().reduce((sum, invoice) => sum + invoice.total, 0);
  };

  const getYearlyRevenue = () => {
    return reports.reduce((sum, report) => sum + report.totalAmount, 0);
  };

  const getAverageInvoiceValue = () => {
    const allInvoices = LocalStorage.getInvoices();
    if (allInvoices.length === 0) return 0;
    return getTotalRevenue() / allInvoices.length;
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const exportMonthReport = async (month: MonthlyReport) => {
    const reportData = `
      Monthly Sales Report - ${month.month} ${month.year}
      
      Total Invoices: ${month.totalInvoices}
      Total Revenue: ${PDFExporter.formatCurrency(month.totalAmount)}
      
      Invoice Details:
      ${month.invoices.map(inv => `
        Invoice: ${inv.invoiceNumber}
        Customer: ${inv.customerName}
        Date: ${PDFExporter.formatDate(inv.invoiceDate)}
        Amount: ${PDFExporter.formatCurrency(inv.total)}
        Status: ${inv.status}
      `).join('\n')}
    `;

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Monthly-Report-${month.month}-${month.year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales Reports</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalInvoices()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{PDFExporter.formatCurrency(getTotalRevenue())}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yearly Revenue ({selectedYear})</p>
              <p className="text-2xl font-bold text-gray-900">{PDFExporter.formatCurrency(getYearlyRevenue())}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Invoice</p>
              <p className="text-2xl font-bold text-gray-900">{PDFExporter.formatCurrency(getAverageInvoiceValue())}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Summary */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Summary - {selectedYear}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoices
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No data available for {selectedYear}
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.month} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.totalInvoices}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {PDFExporter.formatCurrency(report.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => loadMonthDetails(report.month)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => exportMonthReport(report)}
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

        {/* Month Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedMonth ? `${selectedMonth.month} ${selectedMonth.year} Details` : 'Select a month'}
            </h3>
          </div>
          <div className="overflow-x-auto max-h-96">
            {selectedMonth ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Select a month from the summary table to view detailed invoices
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}