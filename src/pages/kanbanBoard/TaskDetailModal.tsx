import React, { useState } from "react";
import { X, Link as LinkIcon, FileText } from "lucide-react";
import { Task, TaskComment } from "../../types/index";

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  authorName: string;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  disableActions?: boolean;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  setTasks,
  authorName,
  newComment,
  setNewComment,
  disableActions = false,
}) => {
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const columns = [
    { id: "to do", title: "To Do" },
    { id: "in progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Finished" },
  ] as const;

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // ✅ True download function (saves to device)
  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      setDownloading((prev) => ({ ...prev, [fileName]: true }));

      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setDownloading((prev) => ({ ...prev, [fileName]: false }));
    }
  };

  const handleMoveTask = async (taskId: string, newStage: Task["stage"]) => {
    if (disableActions) return;
    try {
      const res = await fetch(`http://localhost:5000/api/kanban/tasks/${taskId}`, {
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

  const handleAddComment = async (taskId: string, type: TaskComment["type"]) => {
    if (disableActions) return;
    if (!newComment.trim()) return;

    const comment: TaskComment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      author: authorName,
      createdAt: new Date().toISOString(),
      type,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/kanban/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });

      if (res.ok) {
        const savedComment = await res.json();
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId
              ? { ...t, comments: [...(t.comments || []), savedComment] }
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
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-lg">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#3c405b]">{task.title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">{task.description}</p>

          {/* Move Task */}
          {!disableActions && (
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
          )}

          {/* Resources Section */}
          {task.resources && (
            <div className="mb-6">
              <h4 className="font-medium text-[#2E3453] mb-2">Resources</h4>

              {/* Images */}
              {task.resources.images?.length > 0 && (
                <div className="mb-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Images</h5>
                  <div className="flex flex-wrap gap-4">
                    {task.resources.images.map((img) => {
                      const imageUrl = `http://localhost:5000/uploads/${img}`;
                      const isDownloading = downloading[img];
                      return (
                        <div key={img} className="flex flex-col items-center">
                          <img
                            src={imageUrl}
                            alt={img}
                            className="w-20 h-20 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setZoomImage(imageUrl)}
                          />

                          <button
                            onClick={() => downloadImage(imageUrl, img)}
                            className="mt-1 flex items-center justify-center px-2 py-1 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition text-xs"
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 animate-spin mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v4m0 8v4m8-8h4M4 12H0m16.97-7.03l2.83 2.83M4.22 19.78l2.83-2.83M19.78 19.78l-2.83-2.83M4.22 4.22l2.83 2.83"
                                  />
                                </svg>
                                Downloading...
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0-8l-4 4m4-4l4 4m0-12v6"
                                  />
                                </svg>
                                Download
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Documents */}
              {task.resources.documents?.length > 0 && (
                <div className="mb-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Documents</h5>
                  <ul className="list-disc list-inside">
                    {task.resources.documents.map((doc) => (
                      <li key={doc} className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <a
                          href={`http://localhost:5000/uploads/${doc}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {doc}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              {task.resources.links?.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Links</h5>
                  <ul className="list-disc list-inside">
                    {task.resources.links.map((link) => (
                      <li key={link} className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-gray-500" />
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          <h4 className="font-medium text-[#2E3453] mb-2">Comments</h4>
          <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
            {task.comments?.map((comment) => (
              <div key={comment._id || comment.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-sm text-[#3c405b]">{comment.author}</span>
                  <span className="text-xs text-gray-500">{formatDateTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          {!disableActions && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoom"
            className="max-h-[90%] max-w-[90%] object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default TaskDetailModal;
