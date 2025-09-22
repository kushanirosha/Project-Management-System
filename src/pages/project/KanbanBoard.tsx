import React, { useState } from 'react';
import { Plus, Calendar, User, Paperclip, MessageCircle, Check, X } from 'lucide-react';
import { Task, TaskComment } from '../../types';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';

interface KanbanBoardProps {
  projectId: string;
  tasks: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, tasks }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');

  const { updateTask, addTask } = useProject();
  const { user } = useAuth();

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-gray-200' },
    { id: 'in-progress', title: 'In Progress', color: 'border-blue-200' },
    { id: 'review', title: 'Review', color: 'border-orange-200' },
    { id: 'finished', title: 'Finished', color: 'border-green-200' }
  ] as const;

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask(projectId, {
        title: newTask.title,
        description: newTask.description,
        status: 'todo',
        createdBy: user?.id || '',
        comments: []
      });
      setNewTask({ title: '', description: '' });
      setShowAddTask(false);
    }
  };

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    updateTask(projectId, taskId, { status: newStatus });
  };

  const handleAddComment = (taskId: string, type: 'comment' | 'approval' | 'change_request') => {
    if (newComment.trim()) {
      const comment: TaskComment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        author: user?.id || '',
        createdAt: new Date().toISOString(),
        type
      };

      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const updatedComments = [...(task.comments || []), comment];
        updateTask(projectId, taskId, { comments: updatedComments });
        setNewComment('');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#3c405b]">Project Tasks</h3>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center px-4 py-2 bg-[#3c405b] text-white rounded-lg hover:bg-[#2E3453] transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-6 min-h-0">
        {columns.map((column) => (
          <div key={column.id} className={`flex flex-col border-t-4 ${column.color} bg-gray-50 rounded-lg`}>
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-[#2E3453] mb-1">{column.title}</h4>
              <span className="text-sm text-gray-500">
                {getTasksByStatus(column.id).length} tasks
              </span>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <h5 className="font-medium text-[#3c405b] mb-2">{task.title}</h5>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(task.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {task.attachments && task.attachments.length > 0 && (
                        <div className="flex items-center">
                          <Paperclip className="h-3 w-3" />
                          <span className="ml-1">{task.attachments.length}</span>
                        </div>
                      )}
                      {task.comments && task.comments.length > 0 && (
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3" />
                          <span className="ml-1">{task.comments.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#3c405b] mb-4">Add New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2E3453] mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2E3453] mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-[#3c405b] text-white rounded-lg hover:bg-[#2E3453] transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#3c405b]">{selectedTask.title}</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-4">{selectedTask.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <span>Status: <span className="font-medium">{selectedTask.status}</span></span>
                <span>Created: {formatDate(selectedTask.createdAt)}</span>
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {columns.map((column) => (
                  <button
                    key={column.id}
                    onClick={() => handleTaskMove(selectedTask.id, column.id as Task['status'])}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTask.status === column.id
                        ? 'bg-[#3c405b] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Move to {column.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {selectedTask.attachments && selectedTask.attachments.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-[#2E3453] mb-2">Attachments</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTask.attachments.map((attachment, index) => (
                    <img
                      key={index}
                      src={attachment}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="mb-4">
              <h4 className="font-medium text-[#2E3453] mb-2">Comments & Reviews</h4>
              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                {selectedTask.comments?.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-[#3c405b]">
                        {comment.author}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          comment.type === 'approval' ? 'bg-green-100 text-green-800' :
                          comment.type === 'change_request' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {comment.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{comment.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a comment..."
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleAddComment(selectedTask.id, 'comment')}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Comment
                  </button>
                  <button
                    onClick={() => handleAddComment(selectedTask.id, 'change_request')}
                    className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={() => handleAddComment(selectedTask.id, 'approval')}
                    className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;