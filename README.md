# Quotation & Invoice Generator

A comprehensive desktop-style web application built with Next.js 15 and TypeScript for small businesses to create, manage, and export quotations and invoices. Fully offline and ready for Electron packaging.

## Features

### 📝 Quotation Module
- Create new quotations with customer information
- Add multiple items with quantity and unit pricing
- Automatic calculation of subtotal, tax, and total
- Save quotations locally
- Export quotations to PDF
- Preview quotations before saving

### 🧾 Invoice Module
- Convert quotations to invoices with one click
- Auto-generated invoice numbers
- Track invoice status (draft, sent, paid, overdue)
- Set due dates for invoices
- Export invoices to PDF
- Update invoice status as payments are received

### 📁 Document Management
- View all saved quotations and invoices
- Filter by document type (quotations/invoices)
- Search and sort documents
- View detailed document information
- Export any document to PDF
- Delete unwanted documents

### 📊 Reports & Analytics
- Monthly sales summaries
- Total revenue tracking
- Invoice count and value statistics
- Year-over-year comparisons
- Detailed monthly breakdowns
- Export reports to text files

### 🎨 User Interface
- Clean, professional business-friendly design
- Responsive layout optimized for desktop
- Collapsible sidebar navigation
- Intuitive form interfaces
- Real-time calculations
- Status indicators and badges

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + html2canvas
- **Date Handling**: date-fns
- **Storage**: Local Storage (JSON)
- **State Management**: React hooks

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quotation-invoice-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   └── page.tsx              # Main application page
├── components/
│   ├── Layout.tsx            # Main layout with sidebar navigation
│   ├── QuotationForm.tsx     # Quotation creation and editing form
│   ├── InvoiceManager.tsx    # Invoice management interface
│   ├── DocumentList.tsx      # Document viewing and management
│   ├── Reports.tsx           # Sales reports and analytics
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── storage.ts            # Local storage management
│   └── pdf-export.ts         # PDF export utilities
├── types/
│   └── index.ts              # TypeScript type definitions
└── hooks/
    └── use-toast.ts          # Toast notification hook
```

## Data Storage

The application uses browser's Local Storage to persist all data:

- **Quotations**: Stored as JSON with unique IDs
- **Invoices**: Stored as JSON with auto-generated invoice numbers
- **Settings**: Invoice counter and user preferences

All data is stored locally and works completely offline.

## Features

### 🏢 **Company Profile & Branding**
- **Company Information**: Name, address, contact details, tax ID, registration number
- **Logo Upload**: Add company logo to appear on all documents
- **Payment Details**: Bank information, routing numbers, payment terms
- **Professional Branding**: Consistent company branding across all documents
- **Complete Profile**: All company details stored locally for reuse

### 👥 **Customer Management**
- **Customer Database**: Add, edit, and manage customer information
- **Quick Selection**: Dropdown customer selection in quotation form
- **Contact Details**: Store email, phone, address, tax ID, and notes
- **Company Support**: Track customer company relationships
- **Easy Search**: Find customers quickly in the management interface

### 📄 **Enhanced Document Generation**
- **Branded Documents**: Company logo and information on all PDFs
- **Professional Layout**: Clean, business-ready document formatting
- **Complete Information**: Customer details, company info, payment terms
- **Payment Integration**: Bank details and payment terms on invoices
- **Custom Notes**: Add company-specific notes to documents

## Usage Guide

### Creating a Quotation
1. Navigate to the "Quotation" section
2. Fill in customer information (name and contact)
3. Select quotation date
4. Add items by specifying name, quantity, and unit price
5. Set optional tax rate
6. Preview the quotation
7. Save or export to PDF

### Converting to Invoice
1. Go to the "Invoice" section
2. Click "Create Invoice"
3. Select a quotation to convert
4. Review the generated invoice
5. Update status as needed
6. Export to PDF

### Managing Documents
1. Visit the "Documents" section
2. Filter by type if needed
3. View document details
4. Export or delete documents
5. Search for specific documents

### Viewing Reports
1. Navigate to "Reports"
2. Select year for analysis
3. View summary cards with key metrics
4. Click on months for detailed breakdowns
5. Export monthly reports

## Electron Integration

This application is designed to be easily packaged with Electron:

1. Install Electron dependencies:
```bash
npm install --save-dev electron electron-builder
```

2. Create Electron main process file
3. Configure package.json for Electron build
4. Build desktop application for Windows, Mac, or Linux

## Features for Future Development

- [ ] Multiple currency support
- [ ] Company branding customization
- [ ] Email integration for sending documents
- [ ] Advanced reporting with charts
- [ ] Data backup and restore
- [ ] Multi-language support
- [ ] Cloud synchronization option
- [ ] Recurring invoice templates
- [ ] Payment tracking integration
- [ ] Tax calculation for different regions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.