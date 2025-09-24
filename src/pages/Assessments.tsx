import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { 
  FileText, 
  Eye, 
  Edit3, 
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { dummyAssessments } from '../data/dummyData';
import { Assessment } from '../types';

export const Assessments: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [scoringMode, setScoringMode] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { variant: 'warning' as const, label: 'Pending' },
      'submitted': { variant: 'info' as const, label: 'Submitted' },
      'scored': { variant: 'success' as const, label: 'Scored' }
    };
    return statusMap[status as keyof typeof statusMap] || { variant: 'default' as const, label: status };
  };

  const handleScoreUpdate = (criteriaId: string, score: number) => {
    if (!selectedAssessment) return;
    
    const updatedCriteria = selectedAssessment.criteria.map(criterion =>
      criterion.id === criteriaId ? { ...criterion, score } : criterion
    );
    
    const totalScore = updatedCriteria.reduce((sum, criterion) => sum + (criterion.score || 0), 0);
    
    setSelectedAssessment({
      ...selectedAssessment,
      criteria: updatedCriteria,
      totalScore,
      status: 'scored'
    });
  };

  const handleSaveScores = () => {
    setScoringMode(false);
    // In a real app, this would save to the backend
    alert('Assessment scores saved successfully!');
  };

  if (selectedAssessment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedAssessment(null);
                setScoringMode(false);
              }}
            >
              ← Back to Assessments
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedAssessment.candidateName}</h1>
              <p className="text-gray-600">{selectedAssessment.position} Assessment</p>
            </div>
          </div>
          {!scoringMode && selectedAssessment.status === 'submitted' && (
            <Button onClick={() => setScoringMode(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Score Assessment
            </Button>
          )}
          {scoringMode && (
            <Button onClick={handleSaveScores}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Scores
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Candidate</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAssessment.candidateName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAssessment.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAssessment.submittedDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadge(selectedAssessment.status).variant}>
                      {getStatusBadge(selectedAssessment.status).label}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment Criteria & Scoring</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                {selectedAssessment.criteria.map((criterion) => (
                  <div key={criterion.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{criterion.name}</h4>
                        <p className="text-sm text-gray-600">{criterion.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Max: {criterion.maxScore}</span>
                      </div>
                    </div>
                    
                    {scoringMode ? (
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          min="0"
                          max={criterion.maxScore}
                          value={criterion.score || ''}
                          onChange={(e) => handleScoreUpdate(criterion.id, parseInt(e.target.value) || 0)}
                          className="w-24"
                          placeholder="Score"
                        />
                        <span className="text-sm text-gray-500">/ {criterion.maxScore}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${((criterion.score || 0) / criterion.maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-semibold text-gray-900">
                          {criterion.score !== undefined ? `${criterion.score} / ${criterion.maxScore}` : 'Not scored'}
                        </div>
                        {criterion.score !== undefined && (
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(criterion.score / criterion.maxScore) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {selectedAssessment.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <p className="text-gray-700">{selectedAssessment.notes}</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Score</CardTitle>
              </CardHeader>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {selectedAssessment.totalScore || 0}
                </div>
                <div className="text-lg text-gray-500">
                  / {selectedAssessment.maxScore}
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${((selectedAssessment.totalScore || 0) / selectedAssessment.maxScore) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round(((selectedAssessment.totalScore || 0) / selectedAssessment.maxScore) * 100)}%
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment Files</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Code Submission</p>
                    <p className="text-xs text-gray-500">solution.js</p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Documentation</p>
                    <p className="text-xs text-gray-500">README.md</p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-600 mt-2">Review and score candidate assessments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {dummyAssessments.filter(a => a.status === 'submitted').length}
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
                {dummyAssessments.filter(a => a.status === 'scored').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  dummyAssessments
                    .filter(a => a.totalScore)
                    .reduce((sum, a) => sum + (a.totalScore || 0), 0) /
                  dummyAssessments.filter(a => a.totalScore).length || 0
                )}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assessments List */}
      <Card padding={false}>
        <CardHeader>
          <CardTitle>Assessment Submissions</CardTitle>
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
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dummyAssessments.map((assessment) => {
                const statusInfo = getStatusBadge(assessment.status);
                return (
                  <tr key={assessment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {assessment.candidateName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {assessment.position}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {assessment.submittedDate}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusInfo.variant} size="sm">
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {assessment.totalScore !== undefined 
                        ? `${assessment.totalScore}/${assessment.maxScore}`
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
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