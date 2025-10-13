import React from "react";
import { Task } from "../../types";

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
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    const taskData = {
      projectId,
      title: newTask.title,
      description: newTask.description,
      stage: newTask.stage || "to do",
      createdBy: "unknown",
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
        onClose();
      }
    } catch (err) {
      console.error("❌ Error adding task:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#3c405b] mb-4">Add New Task</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Task Title"
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Task Description"
          />
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
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg">
            Cancel
          </button>
          <button onClick={handleAddTask} className="px-4 py-2 bg-[#3c405b] text-white rounded-lg">
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
