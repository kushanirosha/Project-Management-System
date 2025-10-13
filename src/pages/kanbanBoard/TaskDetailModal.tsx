import React from "react";
import { X } from "lucide-react";
import { Task, TaskComment } from "../../types/index";

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  authorName: string;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  setTasks,
  authorName,
  newComment,
  setNewComment,
}) => {
  const columns = [
    { id: "to do", title: "To Do" },
    { id: "in progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Finished" },
  ] as const;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  // ✅ Move task to another stage
  const handleMoveTask = async (taskId: string, newStage: Task["stage"]) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? updatedTask : t))
        );
      } else {
        console.error("❌ Failed to update task stage");
      }
    } catch (err) {
      console.error("❌ Error moving task:", err);
    }
  };

  // ✅ Add a comment
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
            t._id === taskId
              ? { ...t, comments: [...(t.comments || []), comment] }
              : t
          )
        );
        setNewComment("");
      }
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#3c405b]">{task.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">{task.description}</p>

        {/* ✅ Move Task Section */}
        <div className="mb-6">
          <h4 className="font-medium text-[#2E3453] mb-2">Move Task To:</h4>
          <div className="flex flex-wrap gap-2">
            {columns.map((col) => (
              <button
                key={col.id}
                onClick={() => handleMoveTask(task._id!, col.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  task.stage === col.id
                    ? "bg-[#3c405b] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {col.title}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Comments Section */}
        <h4 className="font-medium text-[#2E3453] mb-2">Comments</h4>
        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
          {task.comments?.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm text-[#3c405b]">{comment.author}</span>
                <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600">{comment.content}</p>
            </div>
          ))}
        </div>

        {/* ✅ Add Comment Section */}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Add a comment..."
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => handleAddComment(task._id!, "comment")}
            className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
          >
            Save Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
