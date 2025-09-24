import React from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Users, 
  FileText, 
  Calendar, 
  UserCheck, 
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { dashboardMetrics, candidatePipelineData, dummyCandidates } from '../data/dummyData';

export const Dashboard: React.FC = () => {
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

  const recentCandidates = dummyCandidates.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your HR Management System</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalCandidates}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hired</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.hired}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Assessment Score</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.avgAssessmentScore}%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Time to Hire</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.avgTimeToHire} days</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Pipeline</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {candidatePipelineData.labels.map((label, index) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: candidatePipelineData.datasets[0].backgroundColor?.[index] }}
                  />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">
                    {candidatePipelineData.datasets[0].data[index]}
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: candidatePipelineData.datasets[0].backgroundColor?.[index],
                        width: `${(candidatePipelineData.datasets[0].data[index] / dashboardMetrics.totalCandidates) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Candidates</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {recentCandidates.map((candidate) => {
              const statusInfo = getStatusBadge(candidate.status);
              return (
                <div key={candidate.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-xs text-gray-500">{candidate.position}</p>
                    </div>
                  </div>
                  <Badge variant={statusInfo.variant} size="sm">
                    {statusInfo.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Candidates</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <FileText className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Assessments</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Calendar className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Schedule Interview</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </Card>
    </div>
  );
};