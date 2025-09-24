import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { 
  UserCheck, 
  User, 
  FileText, 
  CheckCircle,
  Clock,
  Upload
} from 'lucide-react';
import { dummyCandidates } from '../data/dummyData';

export const Onboarding: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState({
    fullName: '',
    personalEmail: '',
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    bankAccount: '',
    routingNumber: '',
    taxId: ''
  });

  const hiredCandidates = dummyCandidates.filter(c => c.status === 'hired');
  const currentCandidate = selectedCandidate ? hiredCandidates.find(c => c.id === selectedCandidate) : null;

  const onboardingSteps = [
    { id: 'personal', label: 'Personal Information', completed: true },
    { id: 'documents', label: 'Document Upload', completed: true },
    { id: 'banking', label: 'Banking Details', completed: false },
    { id: 'benefits', label: 'Benefits Selection', completed: false },
    { id: 'equipment', label: 'Equipment Assignment', completed: false },
    { id: 'training', label: 'Training Modules', completed: false }
  ];

  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const progressPercentage = Math.round((completedSteps / onboardingSteps.length) * 100);

  const handleUpdateOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Onboarding information updated successfully!');
  };

  if (selectedCandidate && currentCandidate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedCandidate(null)}
          >
            ← Back to Onboarding
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentCandidate.name}</h1>
            <p className="text-gray-600">Onboarding Progress</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Progress</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-500">{progressPercentage}% Complete</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <div className="space-y-3 mt-6">
                  {onboardingSteps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                        <span className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.label}
                        </span>
                      </div>
                      <Badge variant={step.completed ? 'success' : 'warning'} size="sm">
                        {step.completed ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <form onSubmit={handleUpdateOnboarding} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={onboardingData.fullName || currentCandidate.name}
                    onChange={(e) => setOnboardingData({ ...onboardingData, fullName: e.target.value })}
                    placeholder="Enter full legal name"
                  />
                  <Input
                    label="Personal Email"
                    type="email"
                    value={onboardingData.personalEmail}
                    onChange={(e) => setOnboardingData({ ...onboardingData, personalEmail: e.target.value })}
                    placeholder="personal@email.com"
                  />
                  <Input
                    label="Phone Number"
                    value={onboardingData.phoneNumber || currentCandidate.phone}
                    onChange={(e) => setOnboardingData({ ...onboardingData, phoneNumber: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                  <Input
                    label="Emergency Contact"
                    value={onboardingData.emergencyContact}
                    onChange={(e) => setOnboardingData({ ...onboardingData, emergencyContact: e.target.value })}
                    placeholder="Emergency contact name & phone"
                  />
                </div>
                <Input
                  label="Home Address"
                  value={onboardingData.address}
                  onChange={(e) => setOnboardingData({ ...onboardingData, address: e.target.value })}
                  placeholder="Full address for payroll"
                />
                <Button type="submit">
                  Update Information
                </Button>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Banking Information</CardTitle>
              </CardHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Bank Account Number"
                    value={onboardingData.bankAccount}
                    onChange={(e) => setOnboardingData({ ...onboardingData, bankAccount: e.target.value })}
                    placeholder="Account number"
                  />
                  <Input
                    label="Routing Number"
                    value={onboardingData.routingNumber}
                    onChange={(e) => setOnboardingData({ ...onboardingData, routingNumber: e.target.value })}
                    placeholder="9-digit routing number"
                  />
                </div>
                <Input
                  label="Tax ID / SSN"
                  value={onboardingData.taxId}
                  onChange={(e) => setOnboardingData({ ...onboardingData, taxId: e.target.value })}
                  placeholder="XXX-XX-XXXX"
                />
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Uploads</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900">Upload Documents</p>
                    <p className="text-sm text-gray-500">Drag and drop files or click to browse</p>
                  </div>
                  <Button className="mt-4" variant="outline">
                    Choose Files
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">I-9 Form</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">W-4 Tax Form</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Details</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <p className="mt-1 text-sm text-gray-900">EMP-{currentCandidate.id.toUpperCase()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{currentCandidate.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1 text-sm text-gray-900">2024-02-01</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="mt-1 text-sm text-gray-900">Engineering</p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Offer Letter
                </Button>
                <Button className="w-full" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Create IT Account
                </Button>
                <Button className="w-full" variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Onboarding
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Onboarding</h1>
          <p className="text-gray-600 mt-2">Manage new employee onboarding process</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Hires</p>
              <p className="text-2xl font-bold text-gray-900">{hiredCandidates.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {hiredCandidates.filter(c => (c.onboardingProgress || 0) < 100).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {hiredCandidates.filter(c => (c.onboardingProgress || 0) === 100).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Onboarding List */}
      <Card>
        <CardHeader>
          <CardTitle>New Employees</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {hiredCandidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{candidate.name}</h4>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-200 rounded-full h-2 w-32">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${candidate.onboardingProgress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">
                        {candidate.onboardingProgress || 0}% complete
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    (candidate.onboardingProgress || 0) === 100
                      ? 'success'
                      : (candidate.onboardingProgress || 0) > 0
                      ? 'warning'
                      : 'info'
                  }
                  size="sm"
                >
                  {(candidate.onboardingProgress || 0) === 100
                    ? 'Complete'
                    : (candidate.onboardingProgress || 0) > 0
                    ? 'In Progress'
                    : 'Not Started'
                  }
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCandidate(candidate.id)}
                >
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};