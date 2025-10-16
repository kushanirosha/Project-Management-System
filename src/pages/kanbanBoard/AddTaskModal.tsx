import React, { useState } from "react";
import { Task } from "../../types";
import API_BASE_URL from "../../config/apiConfig";

interface AddTaskModalProps {
  projectId: string;
  newTask: any;
  setNewTask: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  projectId,
  newTask,
  setNewTask,
  onClose,
  setTasks,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");

  const handleAddLink = () => {
    if (newLink.trim()) {
      setLinks((prev) => [...prev, newLink.trim()]);
      setNewLink("");
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    // ✅ Use FormData for file + text uploads
    const formData = new FormData();
    formData.append("title", newTask.title);
    formData.append("description", newTask.description);
    formData.append("stage", newTask.stage || "to do");
    formData.append("links", JSON.stringify(links));

    images.forEach((file) => formData.append("images", file));
    documents.forEach((file) => formData.append("documents", file));

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/kanban/${projectId}/tasks`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const savedTask = await res.json();
        setTasks((prev) => [...prev, savedTask]);
        setNewTask({ title: "", description: "" });
        setImages([]);
        setDocuments([]);
        setLinks([]);
        onClose();
      } else {
        console.error("❌ Server error:", await res.text());
      }
    } catch (err) {
      console.error("❌ Error adding task:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#3c405b] mb-4">
          Add New Task
        </h3>

        <div className="space-y-4">
          {/* Title */}
          <input
            type="text"
            value={newTask.title}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Task Title"
          />

          {/* Description */}
          <textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Task Description"
          />

          {/* Stage */}
          <select
            value={newTask.stage || "to do"}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, stage: e.target.value as Task["stage"] }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="to do">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Finished</option>
          </select>

          {/* File Uploads */}
          <div>
            <label className="block font-medium mb-1">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Documents</label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => setDocuments(Array.from(e.target.files || []))}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Links */}
          <div>
            <label className="block font-medium mb-1">Add Links</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-1 border p-2 rounded-lg"
                placeholder="https://example.com"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="bg-[#3c405b] text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>

            <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
              {links.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
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
  );
};

export default AddTaskModal;
