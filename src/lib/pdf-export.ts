import jsPDF from 'jspdf';
import { Quotation, Invoice } from '@/types';
import { CompanyProfile } from '@/types/profile';
import { ProfileStorage } from '@/lib/profile-storage';

export class PDFExporter {
  static getCompanyProfile(): CompanyProfile | null {
    return ProfileStorage.getCompanyProfile();
  }

  static async exportQuotation(quotation: Quotation): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Helper function to add new page if needed
      const checkPageBreak = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
      };

      const companyProfile = this.getCompanyProfile();

      // Add company logo if available
      if (companyProfile?.companyLogo) {
        try {
          pdf.addImage(companyProfile.companyLogo, 'PNG', 20, yPosition, { width: 30, height: 30 });
          yPosition += 40;
        } catch (error) {
          console.warn('Could not add company logo to PDF');
        }
      }

      // Add company header
      if (companyProfile?.companyName) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(companyProfile.companyName, 20, yPosition);
        yPosition += 8;
      }

      if (companyProfile?.companyAddress || companyProfile?.companyCity || companyProfile?.companyState || companyProfile?.companyZip || companyProfile?.companyCountry) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const addressParts = [
          companyProfile.companyAddress,
          `${companyProfile.companyCity || ''}, ${companyProfile.companyState || ''} ${companyProfile.companyZip || ''}`,
          companyProfile.companyCountry
        ].filter(Boolean);
        
        addressParts.forEach(part => {
          pdf.text(part, 20, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      }

      if (companyProfile?.companyPhone || companyProfile?.companyEmail) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        if (companyProfile.companyPhone) {
          pdf.text(`Phone: ${companyProfile.companyPhone}`, 20, yPosition);
          yPosition += 5;
        }
        if (companyProfile.companyEmail) {
          pdf.text(`Email: ${companyProfile.companyEmail}`, 20, yPosition);
          yPosition += 5;
        }
        yPosition += 5;
      }

      // Add horizontal line
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;

      // Add header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('QUOTATION', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Add horizontal line
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;

      // Customer and Quotation Details
      checkPageBreak(40);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Left column - Customer Info
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', 20, yPosition);
      yPosition += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${quotation.customerName}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Contact: ${quotation.customerContact}`, 20, yPosition);
      yPosition += 6;

      // Right column - Quotation Details
      let rightColumnY = yPosition - 18;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Quotation Details:', pageWidth - 80, rightColumnY);
      rightColumnY += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${this.formatDate(quotation.quotationDate)}`, pageWidth - 80, rightColumnY);
      rightColumnY += 6;
      pdf.text(`Status: ${quotation.status.toUpperCase()}`, pageWidth - 80, rightColumnY);
      yPosition += 15;

      // Items table header
      checkPageBreak(50);
      yPosition += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Item Description', 20, yPosition);
      pdf.text('Quantity', 100, yPosition);
      pdf.text('Unit Price', 130, yPosition);
      pdf.text('Total', 160, yPosition, { align: 'right' });
      yPosition += 5;

      // Table line
      pdf.setLineWidth(0.3);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 8;

      // Items
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      quotation.items.forEach((item) => {
        checkPageBreak(12);
        
        // Split long item names into multiple lines
        const lines = pdf.splitTextToSize(item.name, 70);
        lines.forEach((line: string, index: number) => {
          if (index === 0) {
            pdf.text(line, 20, yPosition);
            pdf.text(item.quantity.toString(), 100, yPosition);
            pdf.text(this.formatCurrency(item.unitPrice), 130, yPosition);
            pdf.text(this.formatCurrency(item.total), 160, yPosition, { align: 'right' });
          } else {
            pdf.text(line, 20, yPosition);
          }
          yPosition += 5;
        });
        yPosition += 3;
      });

      // Totals section
      checkPageBreak(40);
      yPosition += 10;
      
      // Line before totals
      pdf.setLineWidth(0.3);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      // Right-aligned totals
      const totalsX = pageWidth - 60;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Subtotal:', totalsX, yPosition);
      pdf.text(this.formatCurrency(quotation.subtotal), pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 8;

      if (quotation.taxRate && quotation.taxAmount) {
        pdf.text(`Tax (${quotation.taxRate}%):`, totalsX, yPosition);
        pdf.text(this.formatCurrency(quotation.taxAmount), pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 8;
      }

      // Total line
      pdf.setLineWidth(0.5);
      pdf.line(totalsX - 5, yPosition, pageWidth - 15, yPosition);
      yPosition += 8;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Total:', totalsX, yPosition);
      pdf.text(this.formatCurrency(quotation.total), pageWidth - 20, yPosition, { align: 'right' });

      // Add payment terms if available
      if (companyProfile?.paymentTerms) {
        checkPageBreak(30);
        yPosition += 15;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Payment Terms:', 20, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        const termsLines = pdf.splitTextToSize(companyProfile.paymentTerms, pageWidth - 40);
        termsLines.forEach((line: string) => {
          pdf.text(line, 20, yPosition);
          yPosition += 5;
        });
      }

      // Add notes if available
      if (companyProfile?.notes) {
        checkPageBreak(30);
        yPosition += 10;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Notes:', 20, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        const notesLines = pdf.splitTextToSize(companyProfile.notes, pageWidth - 40);
        notesLines.forEach((line: string) => {
          pdf.text(line, 20, yPosition);
          yPosition += 5;
        });
      }

      // Save the PDF
      pdf.save(`Quotation-${quotation.customerName}-${quotation.quotationDate}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static async exportInvoice(invoice: Invoice): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Helper function to add new page if needed
      const checkPageBreak = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
      };

      const companyProfile = this.getCompanyProfile();

      // Add company logo if available
      if (companyProfile?.companyLogo) {
        try {
          pdf.addImage(companyProfile.companyLogo, 'PNG', 20, yPosition, { width: 30, height: 30 });
          yPosition += 40;
        } catch (error) {
          console.warn('Could not add company logo to PDF');
        }
      }

      // Add company header
      if (companyProfile?.companyName) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(companyProfile.companyName, 20, yPosition);
        yPosition += 8;
      }

      if (companyProfile?.companyAddress || companyProfile?.companyCity || companyProfile?.companyState || companyProfile?.companyZip || companyProfile?.companyCountry) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const addressParts = [
          companyProfile.companyAddress,
          `${companyProfile.companyCity || ''}, ${companyProfile.companyState || ''} ${companyProfile.companyZip || ''}`,
          companyProfile.companyCountry
        ].filter(Boolean);
        
        addressParts.forEach(part => {
          pdf.text(part, 20, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      }

      if (companyProfile?.companyPhone || companyProfile?.companyEmail) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        if (companyProfile.companyPhone) {
          pdf.text(`Phone: ${companyProfile.companyPhone}`, 20, yPosition);
          yPosition += 5;
        }
        if (companyProfile.companyEmail) {
          pdf.text(`Email: ${companyProfile.companyEmail}`, 20, yPosition);
          yPosition += 5;
        }
        yPosition += 5;
      }

      // Add horizontal line
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;

      // Add header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Add horizontal line
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;

      // Customer and Invoice Details
      checkPageBreak(50);
      pdf.setFontSize(12);
      
      // Left column - Bill To
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', 20, yPosition);
      yPosition += 7;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text(invoice.customerName, 20, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(invoice.customerContact, 20, yPosition);
      yPosition += 10;

      // Right column - Invoice Details
      let rightColumnY = yPosition - 33;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Invoice Details:', pageWidth - 80, rightColumnY);
      rightColumnY += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 80, rightColumnY);
      rightColumnY += 6;
      pdf.text(`Date: ${this.formatDate(invoice.invoiceDate)}`, pageWidth - 80, rightColumnY);
      rightColumnY += 6;
      if (invoice.dueDate) {
        pdf.text(`Due Date: ${this.formatDate(invoice.dueDate)}`, pageWidth - 80, rightColumnY);
        rightColumnY += 6;
      }
      pdf.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - 80, rightColumnY);
      yPosition += 10;

      // Items table header
      checkPageBreak(50);
      yPosition += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text('Item Description', 20, yPosition);
      pdf.text('Quantity', 100, yPosition);
      pdf.text('Unit Price', 130, yPosition);
      pdf.text('Total', 160, yPosition, { align: 'right' });
      yPosition += 5;

      // Table line
      pdf.setLineWidth(0.3);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 8;

      // Items
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      invoice.items.forEach((item) => {
        checkPageBreak(12);
        
        // Split long item names into multiple lines
        const lines = pdf.splitTextToSize(item.name, 70);
        lines.forEach((line: string, index: number) => {
          if (index === 0) {
            pdf.text(line, 20, yPosition);
            pdf.text(item.quantity.toString(), 100, yPosition);
            pdf.text(this.formatCurrency(item.unitPrice), 130, yPosition);
            pdf.text(this.formatCurrency(item.total), 160, yPosition, { align: 'right' });
          } else {
            pdf.text(line, 20, yPosition);
          }
          yPosition += 5;
        });
        yPosition += 3;
      });

      // Totals section
      checkPageBreak(40);
      yPosition += 10;
      
      // Line before totals
      pdf.setLineWidth(0.3);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      // Right-aligned totals
      const totalsX = pageWidth - 60;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Subtotal:', totalsX, yPosition);
      pdf.text(this.formatCurrency(invoice.subtotal), pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 8;

      if (invoice.taxRate && invoice.taxAmount) {
        pdf.text(`Tax (${invoice.taxRate}%):`, totalsX, yPosition);
        pdf.text(this.formatCurrency(invoice.taxAmount), pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 8;
      }

      // Total line
      pdf.setLineWidth(0.5);
      pdf.line(totalsX - 5, yPosition, pageWidth - 15, yPosition);
      yPosition += 8;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Total:', totalsX, yPosition);
      pdf.text(this.formatCurrency(invoice.total), pageWidth - 20, yPosition, { align: 'right' });

      // Add payment information if available
      if (companyProfile?.bankName || companyProfile?.bankAccount || companyProfile?.paymentTerms) {
        checkPageBreak(50);
        yPosition += 15;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Payment Information:', 20, yPosition);
        yPosition += 7;
        pdf.setFont('helvetica', 'normal');
        
        if (companyProfile.bankName) {
          pdf.text(`Bank: ${companyProfile.bankName}`, 20, yPosition);
          yPosition += 5;
        }
        if (companyProfile.bankAccount) {
          pdf.text(`Account: ${companyProfile.bankAccount}`, 20, yPosition);
          yPosition += 5;
        }
        if (companyProfile.bankRouting) {
          pdf.text(`Routing: ${companyProfile.bankRouting}`, 20, yPosition);
          yPosition += 5;
        }
        if (companyProfile.paymentTerms) {
          pdf.text(`Terms: ${companyProfile.paymentTerms}`, 20, yPosition);
          yPosition += 5;
        }
      }

      // Add notes if available
      if (companyProfile?.notes) {
        checkPageBreak(30);
        yPosition += 10;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('Notes:', 20, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        const notesLines = pdf.splitTextToSize(companyProfile.notes, pageWidth - 40);
        notesLines.forEach((line: string) => {
          pdf.text(line, 20, yPosition);
          yPosition += 5;
        });
      }

      // Save the PDF
      pdf.save(`Invoice-${invoice.invoiceNumber}-${invoice.customerName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static printQuotation(quotation: Quotation): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    const htmlContent = this.generateQuotationHTML(quotation);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  static printInvoice(invoice: Invoice): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    const htmlContent = this.generateInvoiceHTML(invoice);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  private static generateQuotationHTML(quotation: Quotation): string {
    const companyProfile = this.getCompanyProfile();
    
    const itemsHTML = quotation.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${this.formatCurrency(item.unitPrice)}</td>
        <td style="text-align: right;">${this.formatCurrency(item.total)}</td>
      </tr>
    `).join('');

    const taxHTML = quotation.taxRate && quotation.taxAmount ? `
      <tr>
        <td colspan="3" style="text-align: right; font-weight: bold;">Tax (${quotation.taxRate}%):</td>
        <td style="text-align: right;">${this.formatCurrency(quotation.taxAmount)}</td>
      </tr>
    ` : '';

    const companyHeader = companyProfile ? `
      <div class="company-header">
        ${companyProfile.companyLogo ? `<img src="${companyProfile.companyLogo}" alt="Company Logo" style="max-height: 60px; max-width: 120px; object-fit: contain;">` : ''}
        ${companyProfile.companyName ? `<h2 style="margin: 10px 0 5px 0; color: #1a1a1a; font-size: 18px; font-weight: bold;">${companyProfile.companyName}</h2>` : ''}
        ${companyProfile.companyAddress || companyProfile.companyCity || companyProfile.companyState || companyProfile.companyZip || companyProfile.companyCountry ? `
          <div style="font-size: 12px; color: #666; line-height: 1.4;">
            ${companyProfile.companyAddress ? `<div>${companyProfile.companyAddress}</div>` : ''}
            ${companyProfile.companyCity || companyProfile.companyState || companyProfile.companyZip ? `<div>${companyProfile.companyCity}, ${companyProfile.companyState} ${companyProfile.companyZip}</div>` : ''}
            ${companyProfile.companyCountry ? `<div>${companyProfile.companyCountry}</div>` : ''}
          </div>
        ` : ''}
        ${companyProfile.companyPhone || companyProfile.companyEmail ? `
          <div style="font-size: 12px; color: #666; margin-top: 5px;">
            ${companyProfile.companyPhone ? `<div>Phone: ${companyProfile.companyPhone}</div>` : ''}
            ${companyProfile.companyEmail ? `<div>Email: ${companyProfile.companyEmail}</div>` : ''}
          </div>
        ` : ''}
      </div>
    ` : '';

    const paymentTermsHTML = companyProfile?.paymentTerms ? `
      <div class="payment-terms">
        <h4>Payment Terms</h4>
        <p>${companyProfile.paymentTerms}</p>
      </div>
    ` : '';

    const notesHTML = companyProfile?.notes ? `
      <div class="notes">
        <h4>Notes</h4>
        <p>${companyProfile.notes}</p>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quotation - ${quotation.customerName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .company-header { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { font-size: 32px; margin: 0; color: #1a1a1a; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info-section > div { width: 45%; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .totals { text-align: right; }
          .totals td { border: none; padding: 5px 8px; }
          .totals .total { font-weight: bold; font-size: 16px; border-top: 2px solid #333; }
          .status { display: inline-block; padding: 4px 8px; background: #f0f0f0; border-radius: 4px; font-size: 12px; }
          .payment-terms, .notes { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px; }
          .payment-terms h4, .notes h4 { margin: 0 0 10px 0; color: #333; }
          .payment-terms p, .notes p { margin: 0; color: #666; line-height: 1.4; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        ${companyHeader}
        
        <div class="header">
          <h1>QUOTATION</h1>
        </div>
        
        <div class="info-section">
          <div>
            <h3>Bill To:</h3>
            <p style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${quotation.customerName}</p>
            <p>${quotation.customerContact}</p>
          </div>
          <div>
            <h3>Quotation Details</h3>
            <p><strong>Date:</strong> ${this.formatDate(quotation.quotationDate)}</p>
            <p><strong>Status:</strong> <span class="status">${quotation.status.toUpperCase()}</span></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <table class="totals">
          <tr>
            <td colspan="3" style="text-align: right; font-weight: bold;">Subtotal:</td>
            <td style="text-align: right;">${this.formatCurrency(quotation.subtotal)}</td>
          </tr>
          ${taxHTML}
          <tr class="total">
            <td colspan="3" style="text-align: right;">Total:</td>
            <td style="text-align: right;">${this.formatCurrency(quotation.total)}</td>
          </tr>
        </table>

        ${paymentTermsHTML}
        ${notesHTML}
      </body>
      </html>
    `;
  }

  private static generateInvoiceHTML(invoice: Invoice): string {
    const companyProfile = this.getCompanyProfile();
    
    const itemsHTML = invoice.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${this.formatCurrency(item.unitPrice)}</td>
        <td style="text-align: right;">${this.formatCurrency(item.total)}</td>
      </tr>
    `).join('');

    const taxHTML = invoice.taxRate && invoice.taxAmount ? `
      <tr>
        <td colspan="3" style="text-align: right; font-weight: bold;">Tax (${invoice.taxRate}%):</td>
        <td style="text-align: right;">${this.formatCurrency(invoice.taxAmount)}</td>
      </tr>
    ` : '';

    const dueDateHTML = invoice.dueDate ? `<p><strong>Due Date:</strong> ${this.formatDate(invoice.dueDate)}</p>` : '';

    const companyHeader = companyProfile ? `
      <div class="company-header">
        ${companyProfile.companyLogo ? `<img src="${companyProfile.companyLogo}" alt="Company Logo" style="max-height: 60px; max-width: 120px; object-fit: contain;">` : ''}
        ${companyProfile.companyName ? `<h2 style="margin: 10px 0 5px 0; color: #1a1a1a; font-size: 18px; font-weight: bold;">${companyProfile.companyName}</h2>` : ''}
        ${companyProfile.companyAddress || companyProfile.companyCity || companyProfile.companyState || companyProfile.companyZip || companyProfile.companyCountry ? `
          <div style="font-size: 12px; color: #666; line-height: 1.4;">
            ${companyProfile.companyAddress ? `<div>${companyProfile.companyAddress}</div>` : ''}
            ${companyProfile.companyCity || companyProfile.companyState || companyProfile.companyZip ? `<div>${companyProfile.companyCity}, ${companyProfile.companyState} ${companyProfile.companyZip}</div>` : ''}
            ${companyProfile.companyCountry ? `<div>${companyProfile.companyCountry}</div>` : ''}
          </div>
        ` : ''}
        ${companyProfile.companyPhone || companyProfile.companyEmail ? `
          <div style="font-size: 12px; color: #666; margin-top: 5px;">
            ${companyProfile.companyPhone ? `<div>Phone: ${companyProfile.companyPhone}</div>` : ''}
            ${companyProfile.companyEmail ? `<div>Email: ${companyProfile.companyEmail}</div>` : ''}
          </div>
        ` : ''}
      </div>
    ` : '';

    const paymentInfoHTML = companyProfile?.bankName || companyProfile?.bankAccount || companyProfile?.bankRouting ? `
      <div class="payment-info">
        <h4>Payment Information</h4>
        ${companyProfile.bankName ? `<p><strong>Bank:</strong> ${companyProfile.bankName}</p>` : ''}
        ${companyProfile.bankAccount ? `<p><strong>Account:</strong> ${companyProfile.bankAccount}</p>` : ''}
        ${companyProfile.bankRouting ? `<p><strong>Routing:</strong> ${companyProfile.bankRouting}</p>` : ''}
        ${companyProfile.paymentTerms ? `<p><strong>Terms:</strong> ${companyProfile.paymentTerms}</p>` : ''}
      </div>
    ` : '';

    const paymentTermsHTML = companyProfile?.paymentTerms ? `
      <div class="payment-terms">
        <h4>Payment Terms</h4>
        <p>${companyProfile.paymentTerms}</p>
      </div>
    ` : '';

    const notesHTML = companyProfile?.notes ? `
      <div class="notes">
        <h4>Notes</h4>
        <p>${companyProfile.notes}</p>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .company-header { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { font-size: 32px; margin: 0; color: #1a1a1a; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info-section > div { width: 45%; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .totals { text-align: right; }
          .totals td { border: none; padding: 5px 8px; }
          .totals .total { font-weight: bold; font-size: 16px; border-top: 2px solid #333; }
          .status { display: inline-block; padding: 4px 8px; background: #f0f0f0; border-radius: 4px; font-size: 12px; }
          .payment-info, .payment-terms, .notes { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px; }
          .payment-info h4, .payment-terms h4, .notes h4 { margin: 0 0 10px 0; color: #333; }
          .payment-info p, .payment-terms p, .notes p { margin: 0; color: #666; line-height: 1.4; }
          .customer-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        ${companyHeader}
        
        <div class="header">
          <h1>INVOICE</h1>
        </div>
        
        <div class="info-section">
          <div>
            <h3>Bill To:</h3>
            <div class="customer-name">${invoice.customerName}</div>
            <p>${invoice.customerContact}</p>
          </div>
          <div>
            <h3>Invoice Details</h3>
            <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> ${this.formatDate(invoice.invoiceDate)}</p>
            ${dueDateHTML}
            <p><strong>Status:</strong> <span class="status">${invoice.status.toUpperCase()}</span></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <table class="totals">
          <tr>
            <td colspan="3" style="text-align: right; font-weight: bold;">Subtotal:</td>
            <td style="text-align: right;">${this.formatCurrency(invoice.subtotal)}</td>
          </tr>
          ${taxHTML}
          <tr class="total">
            <td colspan="3" style="text-align: right;">Total:</td>
            <td style="text-align: right;">${this.formatCurrency(invoice.total)}</td>
          </tr>
        </table>

        ${paymentInfoHTML}
        ${paymentTermsHTML}
        ${notesHTML}
      </body>
      </html>
    `;
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}