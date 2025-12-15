'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Eye, Settings, Palette } from 'lucide-react';
import { DocumentTemplate, DocumentTemplateSettings } from '@/types/templates';
import { TemplateStorage } from '@/lib/template-storage';

export default function TemplatesView() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<DocumentTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setTemplates(TemplateStorage.getTemplates());
    setActiveTemplate(TemplateStorage.getActiveTemplate());
  };

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
    setShowSettings(true);
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
    
    loadTemplates();
    setEditingTemplate(null);
    setIsCreating(false);
    setShowSettings(false);
  };

  const deleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      TemplateStorage.deleteTemplate(id);
      loadTemplates();
    }
  };

  const editTemplate = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setIsCreating(false);
    setShowSettings(true);
  };

  const selectTemplate = (template: DocumentTemplate) => {
    setActiveTemplate(template);
    TemplateStorage.saveActiveTemplate(template);
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

  const cancelEdit = () => {
    setEditingTemplate(null);
    setIsCreating(false);
    setShowSettings(false);
  };

  if (editingTemplate && showSettings) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isCreating ? 'Create New Template' : 'Edit Template'}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
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

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
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

          {/* Layout Settings */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Layout</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo Position</label>
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

          {/* Colors */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Colors</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <input
                  type="color"
                  value={editingTemplate.settings.textColor}
                  onChange={(e) => updateTemplateSettings({ textColor: e.target.value })}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
                <input
                  type="color"
                  value={editingTemplate.settings.borderColor}
                  onChange={(e) => updateTemplateSettings({ borderColor: e.target.value })}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Typography</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Palette size={32} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Document Templates</h2>
            <p className="text-gray-600">Manage and customize your document templates</p>
          </div>
        </div>
        <button
          onClick={createNewTemplate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Create Template</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <Palette size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No custom templates found</p>
            <p className="text-gray-400 mt-2">Create your first template to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  activeTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => editTemplate(template)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    {!template.isDefault && (
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Template Preview */}
                <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: template.settings.primaryColor }}
                    />
                    <span className="text-xs text-gray-600">Primary</span>
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: template.settings.textColor }}
                    />
                    <span className="text-xs text-gray-600">Text</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Font: {template.settings.headerFont}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {template.isDefault ? 'Default Template' : `Created: ${new Date(template.createdAt).toLocaleDateString()}`}
                  </div>
                  <div className="flex items-center space-x-2">
                    {activeTemplate?.id === template.id && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Active
                      </span>
                    )}
                    <button
                      onClick={() => selectTemplate(template)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      {activeTemplate?.id === template.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}