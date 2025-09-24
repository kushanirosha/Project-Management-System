import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { 
  Mail, 
  Plus, 
  Edit3, 
  Eye,
  Copy,
  Trash2
} from 'lucide-react';
import { dummyEmailTemplates } from '../data/dummyData';
import { EmailTemplate } from '../types';

export const EmailTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate | null>(null);

  const getTypeColor = (type: string) => {
    const typeMap = {
      'assessment_invite': 'bg-blue-100 text-blue-800',
      'interview_invite': 'bg-purple-100 text-purple-800',
      'offer_letter': 'bg-green-100 text-green-800',
      'rejection': 'bg-red-100 text-red-800',
      'welcome': 'bg-yellow-100 text-yellow-800'
    };
    return typeMap[type as keyof typeof typeMap] || 'bg-gray-100 text-gray-800';
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditedTemplate({ ...template });
    setIsEditing(true);
  };

  const handleSaveTemplate = () => {
    if (editedTemplate) {
      // In a real app, this would save to the backend
      alert('Template saved successfully!');
      setIsEditing(false);
      setEditedTemplate(null);
    }
  };

  const handleCreateNew = () => {
    setEditedTemplate({
      id: Date.now().toString(),
      name: '',
      subject: '',
      content: '',
      type: 'assessment_invite',
      variables: [],
      lastModified: new Date().toISOString().split('T')[0]
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const previewTemplate = (template: EmailTemplate) => {
    const sampleData = {
      '{{first_name}}': 'John',
      '{{position}}': 'Software Engineer',
      '{{company}}': 'Tech Corp',
      '{{hr_name}}': 'Sarah Johnson',
      '{{interview_date}}': 'January 25, 2024',
      '{{interview_time}}': '2:00 PM',
      '{{assessment_link}}': 'https://assessment.example.com/abc123',
      '{{deadline}}': 'January 30, 2024'
    };

    let previewContent = template.content;
    Object.entries(sampleData).forEach(([variable, value]) => {
      previewContent = previewContent.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });

    return previewContent;
  };

  if (isEditing && editedTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setIsCreating(false);
                setEditedTemplate(null);
              }}
            >
              ← Back to Templates
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isCreating ? 'Create Template' : 'Edit Template'}
            </h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Editor</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="Template Name"
                value={editedTemplate.name}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
                placeholder="Enter template name"
              />
              
              <Input
                label="Email Subject"
                value={editedTemplate.subject}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, subject: e.target.value })}
                placeholder="Enter email subject"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Content
                </label>
                <textarea
                  value={editedTemplate.content}
                  onChange={(e) => setEditedTemplate({ ...editedTemplate, content: e.target.value })}
                  rows={12}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Variables
                </label>
                <div className="flex flex-wrap gap-2">
                  {['{{first_name}}', '{{position}}', '{{company}}', '{{hr_name}}', '{{interview_date}}', '{{assessment_link}}'].map((variable) => (
                    <button
                      key={variable}
                      onClick={() => {
                        setEditedTemplate({
                          ...editedTemplate,
                          content: editedTemplate.content + ' ' + variable
                        });
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      {variable}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject:</label>
                <p className="text-sm text-gray-900 font-medium">
                  {editedTemplate.subject.replace('{{position}}', 'Software Engineer').replace('{{company}}', 'Tech Corp')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content:</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {previewTemplate(editedTemplate)}
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedTemplate(null)}
            >
              ← Back to Templates
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedTemplate.name}</h1>
              <p className="text-gray-600">Email Template</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleEditTemplate(selectedTemplate)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTemplate.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedTemplate.type)}`}>
                    {selectedTemplate.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTemplate.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Modified</label>
                <p className="mt-1 text-sm text-gray-500">{selectedTemplate.lastModified}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Variables</label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedTemplate.variables.map((variable) => (
                    <span key={variable} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {selectedTemplate.content}
              </pre>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preview with Sample Data</CardTitle>
          </CardHeader>
          <div className="bg-white border rounded-lg p-6">
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Subject: {selectedTemplate.subject.replace('{{position}}', 'Software Engineer').replace('{{company}}', 'Tech Corp')}
              </h3>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {previewTemplate(selectedTemplate)}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-2">Manage and customize email templates for candidates</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Template Types Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['assessment_invite', 'interview_invite', 'offer_letter', 'rejection', 'welcome'].map((type) => (
          <Card key={type} className="text-center">
            <div className="p-4">
              <Mail className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900 capitalize">
                {type.replace('_', ' ')}
              </p>
              <p className="text-xl font-bold text-blue-600">
                {dummyEmailTemplates.filter(t => t.type === type).length}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyEmailTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getTypeColor(template.type)}`}>
                  {template.type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Subject:</p>
              <p className="text-sm text-gray-600 truncate">{template.subject}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {template.content.substring(0, 120)}...
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Modified: {template.lastModified}
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedTemplate(template)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};