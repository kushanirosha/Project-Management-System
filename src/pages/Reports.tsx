import React from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Award,
  Download,
  Calendar
} from 'lucide-react';
import { 
  dashboardMetrics, 
  candidatePipelineData, 
  sourceEffectivenessData, 
  assessmentScoreData,
  dummyCandidates,
  dummyAssessments
} from '../data/dummyData';

export const Reports: React.FC = () => {
  const renderBarChart = (data: any, title: string) => {
    const maxValue = Math.max(...data.datasets[0].data);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {data.labels.map((label: string, index: number) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: Array.isArray(data.datasets[0].backgroundColor) 
                    ? data.datasets[0].backgroundColor[index] 
                    : data.datasets[0].backgroundColor 
                  }}
                />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      backgroundColor: Array.isArray(data.datasets[0].backgroundColor) 
                        ? data.datasets[0].backgroundColor[index] 
                        : data.datasets[0].backgroundColor,
                      width: `${(data.datasets[0].data[index] / maxValue) * 100}%`
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-8 text-right">
                  {data.datasets[0].data[index]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const timeToHireData = dummyCandidates
    .filter(c => c.status === 'hired')
    .map(c => {
      const appliedDate = new Date(c.appliedDate);
      const hiredDate = new Date(); // Simulated hire date
      const diffTime = Math.abs(hiredDate.getTime() - appliedDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    });

  const avgTimeToHire = timeToHireData.length > 0 
    ? Math.round(timeToHireData.reduce((a, b) => a + b, 0) / timeToHireData.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive hiring analytics and insights</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.totalCandidates}</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">12%</p>
              <p className="text-xs text-green-600 mt-1">↑ 3% from last month</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Assessment Score</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.avgAssessmentScore}%</p>
              <p className="text-xs text-red-600 mt-1">↓ 2% from last month</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Time to Hire</p>
              <p className="text-2xl font-bold text-gray-900">{avgTimeToHire} days</p>
              <p className="text-xs text-green-600 mt-1">↓ 2 days from last month</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Pipeline */}
        {renderBarChart(candidatePipelineData, 'Candidate Pipeline')}

        {/* Source Effectiveness */}
        {renderBarChart(sourceEffectivenessData, 'Hiring Source Effectiveness')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Score Distribution */}
        {renderBarChart(assessmentScoreData, 'Assessment Score Distribution')}

        {/* Monthly Hiring Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Hiring Trends</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {['January', 'February', 'March', 'April'].map((month, index) => {
              const value = [8, 12, 6, 10][index];
              const maxValue = 15;
              return (
                <div key={month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{month} 2024</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${(value / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Positions</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hired</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Software Engineer</td>
                  <td className="px-6 py-4 text-sm text-gray-500">8</td>
                  <td className="px-6 py-4 text-sm text-gray-500">1</td>
                  <td className="px-6 py-4 text-sm text-green-600">12.5%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Product Manager</td>
                  <td className="px-6 py-4 text-sm text-gray-500">5</td>
                  <td className="px-6 py-4 text-sm text-gray-500">1</td>
                  <td className="px-6 py-4 text-sm text-green-600">20%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">UX Designer</td>
                  <td className="px-6 py-4 text-sm text-gray-500">6</td>
                  <td className="px-6 py-4 text-sm text-gray-500">1</td>
                  <td className="px-6 py-4 text-sm text-green-600">16.7%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Performance</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Technical Interviews</span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">85% Success Rate</span>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">HR Interviews</span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">92% Success Rate</span>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Final Interviews</span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">78% Success Rate</span>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};