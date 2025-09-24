import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Checkbox } from '../components/ui/Checkbox';
import { 
  Search, 
  Filter, 
  Mail, 
  Calendar, 
  Eye,
  Download,
  Users
} from 'lucide-react';
import { dummyCandidates } from '../data/dummyData';
import { Candidate } from '../types';

interface CandidatesProps {
  onViewCandidate: (candidateId: string) => void;
}

export const Candidates: React.FC<CandidatesProps> = ({ onViewCandidate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'applied', label: 'Applied' },
    { value: 'assessment_pending', label: 'Assessment Pending' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const positionOptions = [
    { value: '', label: 'All Positions' },
    { value: 'Software Engineer', label: 'Software Engineer' },
    { value: 'UX Designer', label: 'UX Designer' },
    { value: 'Product Manager', label: 'Product Manager' },
    { value: 'Data Scientist', label: 'Data Scientist' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer' }
  ];

  const filteredCandidates = dummyCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || candidate.status === statusFilter;
    const matchesPosition = !positionFilter || candidate.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'applied': { variant: 'info' as const, label: 'Applied' },
      'assessment_pending': { variant: 'warning' as const, label: 'Assessment Pending' },
      'assessment_completed': { variant: 'info' as const, label: 'Assessment Completed' },
      'shortlisted': { variant: 'success' as const, label: 'Shortlisted' },
      'interview_scheduled': { variant: 'warning' as const, label: 'Interview Scheduled' },
      'interview_completed': { variant: 'info' as const, label: 'Interview Completed' },
      'offer_extended': { variant: 'warning' as const, label: 'Offer Extended' },
      'hired': { variant: 'success' as const, label: 'Hired' },
      'rejected': { variant: 'danger' as const, label: 'Rejected' }
    };
    return statusMap[status as keyof typeof statusMap] || { variant: 'default' as const, label: status };
  };

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  if (currentCandidate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentCandidate(null)}
          >
            ← Back to Candidates
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{currentCandidate.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Information</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{currentCandidate.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{currentCandidate.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{currentCandidate.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{currentCandidate.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadge(currentCandidate.status).variant}>
                      {getStatusBadge(currentCandidate.status).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                  <p className="mt-1 text-sm text-gray-900">{currentCandidate.appliedDate}</p>
                </div>
              </div>
              {currentCandidate.notes && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="mt-1 text-sm text-gray-900">{currentCandidate.notes}</p>
                </div>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <div className="flow-root">
                <ul className="-mb-8">
                  {currentCandidate.timeline.map((event, index) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {index !== currentCandidate.timeline.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                        )}
                        <div className="relative flex space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">
                                {event.description}
                                {event.user && (
                                  <span className="font-medium text-gray-900"> by {event.user}</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{event.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <Button className="w-full" variant="primary">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </Card>

            {currentCandidate.assessmentScore && (
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Score</CardTitle>
                </CardHeader>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {currentCandidate.assessmentScore}/100
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Overall Score</p>
                </div>
              </Card>
            )}

            {currentCandidate.onboardingProgress !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Progress</CardTitle>
                </CardHeader>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{currentCandidate.onboardingProgress}%</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${currentCandidate.onboardingProgress}%` }}
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-2">Manage and track all job candidates</p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
          <Select
            options={positionOptions}
            value={positionFilter}
            onChange={setPositionFilter}
            placeholder="Filter by position"
          />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedCandidates.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedCandidates.length} candidate(s) selected
            </span>
            <div className="flex space-x-2">
              <Button size="sm" variant="primary">
                <Mail className="w-4 h-4 mr-1" />
                Send Assessment
              </Button>
              <Button size="sm" variant="outline">
                <Calendar className="w-4 h-4 mr-1" />
                Schedule Interview
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Candidates Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Checkbox
                    checked={selectedCandidates.length === filteredCandidates.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => {
                const statusInfo = getStatusBadge(candidate.status);
                return (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {candidate.name}
                        </div>
                        <div className="text-sm text-gray-500">{candidate.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {candidate.position}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusInfo.variant} size="sm">
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                      {candidate.source.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {candidate.appliedDate}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentCandidate(candidate)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};