import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus,
  Edit3,
  CheckCircle
} from 'lucide-react';
import { dummyInterviews, dummyCandidates } from '../data/dummyData';
import { Interview } from '../types';

export const Interviews: React.FC = () => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newInterview, setNewInterview] = useState({
    candidateId: '',
    interviewer: '',
    date: '',
    time: '',
    type: 'technical' as const,
    meetingLink: ''
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'scheduled': { variant: 'warning' as const, label: 'Scheduled' },
      'completed': { variant: 'success' as const, label: 'Completed' },
      'cancelled': { variant: 'danger' as const, label: 'Cancelled' }
    };
    return statusMap[status as keyof typeof statusMap] || { variant: 'default' as const, label: status };
  };

  const getTypeColor = (type: string) => {
    const typeMap = {
      'technical': 'bg-blue-100 text-blue-800',
      'hr': 'bg-green-100 text-green-800',
      'behavioral': 'bg-purple-100 text-purple-800',
      'final': 'bg-orange-100 text-orange-800'
    };
    return typeMap[type as keyof typeof typeMap] || 'bg-gray-100 text-gray-800';
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    alert('Interview scheduled successfully!');
    setShowScheduleForm(false);
    setNewInterview({
      candidateId: '',
      interviewer: '',
      date: '',
      time: '',
      type: 'technical',
      meetingLink: ''
    });
  };

  const candidateOptions = dummyCandidates
    .filter(c => ['shortlisted', 'assessment_completed'].includes(c.status))
    .map(c => ({ value: c.id, label: `${c.name} - ${c.position}` }));

  const interviewerOptions = [
    { value: 'Mike Chen', label: 'Mike Chen (Technical Lead)' },
    { value: 'Lisa Park', label: 'Lisa Park (Design Manager)' },
    { value: 'Alex Rodriguez', label: 'Alex Rodriguez (Product Manager)' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson (HR Manager)' }
  ];

  const typeOptions = [
    { value: 'technical', label: 'Technical Interview' },
    { value: 'hr', label: 'HR Interview' },
    { value: 'behavioral', label: 'Behavioral Interview' },
    { value: 'final', label: 'Final Interview' }
  ];

  if (showScheduleForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setShowScheduleForm(false)}
          >
            ← Back to Interviews
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Interview</h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleScheduleInterview} className="space-y-6">
            <Select
              label="Candidate"
              options={candidateOptions}
              value={newInterview.candidateId}
              onChange={(value) => setNewInterview({ ...newInterview, candidateId: value })}
              placeholder="Select candidate"
            />

            <Select
              label="Interviewer"
              options={interviewerOptions}
              value={newInterview.interviewer}
              onChange={(value) => setNewInterview({ ...newInterview, interviewer: value })}
              placeholder="Select interviewer"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date"
                value={newInterview.date}
                onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                required
              />
              <Input
                type="time"
                label="Time"
                value={newInterview.time}
                onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                required
              />
            </div>

            <Select
              label="Interview Type"
              options={typeOptions}
              value={newInterview.type}
              onChange={(value) => setNewInterview({ ...newInterview, type: value as any })}
            />

            <Input
              label="Meeting Link"
              placeholder="https://meet.google.com/..."
              value={newInterview.meetingLink}
              onChange={(e) => setNewInterview({ ...newInterview, meetingLink: e.target.value })}
            />

            <div className="flex space-x-4">
              <Button type="submit">
                <CheckCircle className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowScheduleForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600 mt-2">Schedule and manage candidate interviews</p>
        </div>
        <Button onClick={() => setShowScheduleForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {dummyInterviews.filter(i => i.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {dummyInterviews.filter(i => i.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {dummyInterviews
            .filter(interview => interview.status === 'scheduled')
            .map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{interview.candidateName}</h4>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">
                        {interview.date} at {interview.time}
                      </span>
                      <span className="text-sm text-gray-500">
                        with {interview.interviewer}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(interview.type)}`}>
                        {interview.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {interview.meetingLink && (
                    <Button size="sm" variant="outline">
                      <Video className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* All Interviews */}
      <Card padding={false}>
        <CardHeader>
          <CardTitle>All Interviews</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interviewer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dummyInterviews.map((interview) => {
                const statusInfo = getStatusBadge(interview.status);
                return (
                  <tr key={interview.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {interview.candidateName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {interview.position}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(interview.type)}`}>
                        {interview.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {interview.interviewer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {interview.date} {interview.time}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusInfo.variant} size="sm">
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {interview.meetingLink && interview.status === 'scheduled' && (
                          <Button size="sm" variant="outline">
                            <Video className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
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