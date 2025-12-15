'use client';

import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Upload, Download, Eye, Settings } from 'lucide-react';
import { DocumentTemplate, DocumentTemplateSettings } from '@/types/templates';
import { TemplateStorage } from '@/lib/template-storage';
import { CompanyProfile } from '@/types/profile';
import { ProfileStorage } from '@/lib/profile-storage';

interface TemplateManagerProps {
  onClose: () => void;
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export default function TemplateManager({ onClose, onSelectTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<DocumentTemplate | null>(null);

  useEffect(() => {
    setTemplates(TemplateStorage.getTemplates());
    setActiveTemplate(TemplateStorage.getActiveTemplate());
  }, []);

  const createNewTemplate = () => {
    const newTemplate: DocumentTemplate = {
      id: `template-${Date.now()}`,
      name: 'New Template',
      description: 'Custom template',
      isDefault: false,
      settings: TemplateStorage.getDefaultTemplates()[0].settings, // Use modern settings as base
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingTemplate(newTemplate);
    setIsCreating(true);
  };

  const saveTemplate = () => {
    if (!editingTemplate || !editingTemplate.name) {
      alert('Template name is required');
      return;
    }

    if (isCreating) {
      TemplateStorage.saveCustomTemplate(editingTemplate);
    } else {
      TemplateStorage.saveTemplate(editingTemplate);
    }
    
    setEditingTemplate(null);
    setIsCreating(false);
  };

  const deleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      TemplateStorage.deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  const editTemplate = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setIsCreating(false);
  };

  const selectTemplate = (template: DocumentTemplate) => {
    setActiveTemplate(template);
    TemplateStorage.saveActiveTemplate(template);
    onSelectTemplate(template);
  };

  const updateTemplateSettings = (settings: Partial<DocumentTemplateSettings>) => {
    if (editingTemplate) {
      const updatedTemplate = {
        ...editingTemplate,
        settings: { ...editingTemplate.settings, ...settings }
      };
      setEditingTemplate(updatedTemplate);
    }
  };

  const resetToDefault = () => {
    const defaultTemplate = TemplateStorage.getDefaultTemplates()[0];
    const resetTemplate = {
      ...editingTemplate,
      settings: defaultTemplate.settings
    };
    setEditingTemplate(resetTemplate);
  };

  if (editingTemplate) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {isCreating ? 'Create New Template' : 'Edit Template'}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingTemplate(null);
                  setIsCreating(false);
                  onClose();
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <button
                onClick={saveTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{isCreating ? 'Create' : 'Save'}</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name *
              </label>
              <input
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter template name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editingTemplate.description}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this template"
              />
            </div>

            {/* Template Settings */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Template Settings</h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Settings size={16} />
                  <span>{showSettings ? 'Hide Settings' : 'Show Settings'}</span>
                </button>
                {!isCreating && (
                  <button
                    onClick={resetToDefault}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
            </div>

            {showSettings && (
              <div className="border-t pt-4 space-y-4">
                {/* Layout Settings */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Layout</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Header Layout</label>
                      <select
                        value={editingTemplate.settings.headerLayout}
                        onChange={(e) => updateTemplateSettings({ headerLayout: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="classic">Classic</option>
                        <option value="modern">Modern</option>
                        <option value="minimal">Minimal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Footer Layout</label>
                      <select
                        value={editingTemplate.settings.footerLayout}
                        onChange={(e) => updateTemplateSettings({ footerLayout: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="none">None</option>
                        <option value="simple">Simple</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Logo Position */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Logo Position</h4>
                  <select
                    value={editingTemplate.settings.logoPosition}
                    onChange={(e) => updateTemplateSettings({ logoPosition: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                  </select>
                </div>

                {/* Company Info Position */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Company Info Position</h4>
                  <select
                    value={editingTemplate.settings.companyInfoPosition}
                    onChange={(e) => updateTemplateSettings({ companyInfoPosition: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hidden">Hidden</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

                {/* Colors */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Colors</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <input
                        type="color"
                        value={editingTemplate.settings.primaryColor}
                        onChange={(e) => updateTemplateSettings({ primaryColor: e.target.value })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                      <input
                        type="color"
                        value={editingTemplate.settings.secondaryColor}
                        onChange={(e) => updateTemplateSettings({ secondaryColor: e.target.value })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                      <input
                        type="color"
                        value={editingTemplate.settings.accentColor}
                        onChange={(e) => updateTemplateSettings({ accentColor: e.target.value })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Background */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Background</h4>
                  <input
                    type="color"
                    value={editingTemplate.settings.backgroundColor}
                    onChange={(e) => updateTemplateSettings({ backgroundColor: e.target.value })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Text Color */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Text Color</h4>
                  <input
                    type="color"
                    value={editingTemplate.settings.textColor}
                    onChange={(e) => updateTemplateSettings({ textColor: e.target.value })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Border Color */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Border Color</h4>
                  <input
                    type="color"
                    value={editingTemplate.settings.borderColor}
                    onChange={(e) => updateTemplateSettings({ borderColor: e.target.value })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

                {/* Header Background */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Header Background</h4>
                  <input
                    type="color"
                    value={editingTemplate.settings.headerBackgroundColor}
                    onChange={(e) => updateTemplateSettings({ headerBackgroundColor: e.target.value })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Header Text Color */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Header Text Color</h4>
                  <input
                    type="color"
                    value={editingTemplate.settings.headerTextColor}
                    onChange={(e) => updateTemplateSettings({ headerTextColor: e.target.value })}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Typography</h4>
              <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Header Font</label>
                      <select
                        value={editingTemplate.settings.headerFont}
                        onChange={(e) => updateTemplateSettings({ headerFont: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Inter">Inter</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Body Font</label>
                      <select
                        value={editingTemplate.settings.bodyFont}
                        onChange={(e) => updateTemplateSettings({ bodyFont: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Inter">Inter</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                      <select
                        value={editingTemplate.settings.fontSize}
                        onChange={(e) => updateTemplateSettings({ fontSize: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </div>

            {/* Table Style */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Table Style</h4>
              <select
                value={editingTemplate.settings.tableStyle}
                onChange={(e) => updateTemplateSettings({ tableStyle: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="borders">Borders</option>
                <option value="striped">Striped</option>
                <option value="minimal">Minimal</option>
              </select>
              </div>
            </div>

            {/* Paper Settings */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Paper Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
                      <select
                        value={editingTemplate.settings.paperSize}
                        onChange={(e) => updateTemplateSettings({ paperSize: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                      <select
                        value={editingTemplate.settings.orientation}
                        onChange={(e) => updateTemplateSettings({ orientation: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Margins */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Margins (px)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Top</label>
                      <input
                        type="number"
                        value={editingTemplate.settings.margins.top}
                        onChange={(e) => updateTemplateSettings({ 
                          margins: { ...editingTemplate.settings.margins, top: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Right</label>
                      <input
                        type="number"
                        value={editingTemplate.settings.margins.right}
                        onChange={(e) => updateTemplateSettings({ 
                          margins: { ...editingTemplate.settings.margins, right: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bottom</label>
                      <input
                        type="number"
                        value={editingTemplate.settings.margins.bottom}
                        onChange={(e) => updateTemplateSettings({ 
                          margins: { ...editingTemplate.settings.margins, bottom: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Left</label>
                      <input
                        type="number"
                        value={editingTemplate.settings.margins.left}
                        onChange={(e) => updateTemplateSettings({ 
                          margins: { ...editingTemplate.settings.margins, left: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Settings */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Footer Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingTemplate.settings.showWatermark}
                    onChange={(e) => updateTemplateSettings({ showWatermark: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show Watermark</span>
                </label>
                {editingTemplate.settings.showWatermark && (
                  <input
                    type="text"
                    value={editingTemplate.settings.watermarkText}
                    onChange={(e) => updateTemplateSettings({ watermarkText: e.target.value })}
                    placeholder="Enter watermark text"
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingTemplate.settings.showPageNumbers}
                    onChange={(e) => updateTemplateSettings({ showPageNumbers: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show Page Numbers</span>
                </label>
              </div>
            </div>
          </div>

            {/* Field Visibility */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Field Visibility</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingTemplate.settings.showLogo}
                      onChange={(e) => updateTemplateSettings({ showLogo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Logo</span>
                  </label>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={editingTemplate.settings.showCompanyInfo}
                      onChange={(e) => updateTemplateSettings({ showCompanyInfo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Company Info</span>
                  </label>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={editingTemplate.settings.showCustomerInfo}
                      onChange={(e) => updateTemplateSettings({ showCustomerInfo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Customer Info</span>
                  </label>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={editingTemplate.settings.showPaymentInfo}
                      onChange={(e) => updateTemplateSettings({ showPaymentInfo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Payment Info</span>
                  </label>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={editingTemplate.settings.showTaxId}
                      onChange={(e) => updateTemplateSettings({ showTaxId: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Tax ID</span>
                  </label>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={editingTemplate.settings.showRegistrationNumber}
                      onChange={(e) => updateTemplateSettings({ showRegistrationNumber: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Registration Number</span>
                  </label>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={editingTemplate.settings.showDueDate}
                      onChange={(e) => updateTemplateSettings({ showDueDate: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Due Date</span>
                  </label>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={editingTemplate.settings.showBankInfo}
                      onChange={(e) => updateTemplateSettings({ showBankInfo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Bank Info</span>
                  </label>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={editingTemplate.settings.showTerms}
                      onChange={(e) => updateTemplateSettings({ showTerms: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Terms</span>
                  </label>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      checked={editingTemplate.settings.showNotes}
                      onChange={(e) => updateTemplateSettings({ showNotes: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Notes</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowSettings(false)}
        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Close Settings
      </button>
    )}
  </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Template Manager</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setEditingTemplate(null);
                setIsCreating(false);
                onClose();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <button
              onClick={createNewTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Create Template</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Templates</h3>
              <button
                onClick={() => setActiveTemplate(null)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No templates found</p>
              <p className="text-gray-400 mt-2">Create your first template to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => selectTemplate(template)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:scale-105 ${
                    activeTemplate?.id === template.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editTemplate(template)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}