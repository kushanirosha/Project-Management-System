import React, { useState, useEffect } from "react";
import { Plus, Calendar, Paperclip, MessageCircle, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface TaskComment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  type: "comment" | "approval" | "change_request";
}

interface Task {
  _id?: string;
  projectId: string;
  title: string;
  description: string;
  stage: "to do" | "in progress" | "review" | "done";
  createdBy: string;
  createdAt: string;
  comments: TaskComment[];
  attachments?: string[];
}

interface KanbanBoardProps {
  projectId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const authorName = storedUser.name || user?.name || "unknown";


  const columns = [
    { id: "to do", title: "To Do", color: "border-gray-200" },
    { id: "in progress", title: "In Progress", color: "border-blue-200" },
    { id: "review", title: "Review", color: "border-orange-200" },
    { id: "done", title: "Finished", color: "border-green-200" },
  ] as const;

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}/tasks`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("❌ Error fetching tasks:", err);
      }
    };
    if (projectId) fetchTasks();
  }, [projectId]);

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    const taskData = {
      projectId,
      title: newTask.title,
      description: newTask.description,
      stage: newTask.stage || "to do", // <-- use selected stage
      createdBy: user?.id || "unknown",
    };

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        const savedTask = await res.json();
        setTasks((prev) => [...prev, savedTask]);
        setNewTask({ title: "", description: "" });
        setShowAddTask(false);
      }
    } catch (err) {
      console.error("❌ Error adding task:", err);
    }
  };

  // Move task via button
  const handleTaskMove = async (taskId: string, newStage: Task["stage"]) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));
      }
    } catch (err) {
      console.error("❌ Error updating task:", err);
    }
  };

  // Add comment
  const handleAddComment = async (taskId: string, type: TaskComment["type"]) => {
    if (!newComment.trim()) return;

    const comment: TaskComment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      author: authorName,
      createdAt: new Date().toISOString(),
      type,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, comments: [...(t.comments || []), comment] } : t
          )
        );
        setNewComment("");
      }
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    }
  };

  const getTasksByStage = (stage: string) => tasks.filter((task) => task.stage === stage);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // ---------------- Drag-and-Drop ----------------
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStage = result.destination.droppableId as Task["stage"];

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));
      }
    } catch (err) {
      console.error("❌ Error moving task:", err);
    }
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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 grid grid-cols-4 gap-6 min-h-0">
          {columns.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col border-t-4 ${column.color} bg-gray-50 rounded-lg`}
                >
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="font-semibold text-[#2E3453] mb-1">{column.title}</h4>
                    <span className="text-sm text-gray-500">
                      {getTasksByStage(column.id).length} tasks
                    </span>
                  </div>

                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {getTasksByStage(column.id).map((task, index) => (
                      <Draggable key={task._id!} draggableId={task._id!} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedTask(task)}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <h5 className="font-medium text-[#3c405b] mb-2">{task.title}</h5>
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {task.description}
                              </p>
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#3c405b] mb-4">Add New Task</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Task Title"
              />
              <textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Task Description"
              />
              <select
                value={newTask.stage || "to do"}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    stage: e.target.value as Task["stage"],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="to do">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Finished</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-[#3c405b] text-white rounded-lg"
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
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{selectedTask.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {columns.map((column) => (
                <button
                  key={column.id}
                  onClick={() => handleTaskMove(selectedTask._id!, column.id as Task["stage"])}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTask.stage === column.id
                    ? "bg-[#3c405b] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Move to {column.title}
                </button>
              ))}
            </div>

            <h4 className="font-medium text-[#2E3453] mb-2">Comments</h4>
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {selectedTask.comments?.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm text-[#3c405b]">{comment.author}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Add a comment..."
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleAddComment(selectedTask._id!, "comment")}
                className="px-3 py-1 bg-green-100 text-green-600 rounded-lg"
              >
                Save Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
