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
      settings: TemplateStorage.getDefaultTemplates()[0].settings,
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
    if (editingTemplate) {
      const resetTemplate: DocumentTemplate = {
        ...editingTemplate,
        settings: defaultTemplate.settings
      };
      setEditingTemplate(resetTemplate);
    }
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
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Template Manager</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Templates</h3>
            <button
              onClick={createNewTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Create Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  activeTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectTemplate(template)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{template.name}</h4>
                  {template.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editTemplate(template);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    {!template.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate(template.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  {activeTemplate?.id === template.id && (
                    <span className="text-green-600 text-sm font-medium">Active</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}