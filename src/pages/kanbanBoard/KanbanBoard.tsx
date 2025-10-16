import React, { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { Task } from "../../types/index";
import AddTaskModal from "./AddTaskModal";
import TaskDetailModal from "./TaskDetailModal";
import TaskCard from "../../components/TaskCard";
import toast, { Toaster } from "react-hot-toast";
import API_BASE_URL from "../../config/apiConfig";

const KanbanBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [projectStatus, setProjectStatus] = useState<"ongoing" | "finished">("ongoing");
  const { user } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const authorName = storedUser.name || user?.name || "unknown";

  const columns = [
    { id: "to do", title: "To Do", color: "border-gray-200" },
    { id: "in progress", title: "In Progress", color: "border-blue-200" },
    { id: "review", title: "Review", color: "border-orange-200" },
    { id: "done", title: "Finished", color: "border-green-200" },
  ] as const;

  // Fetch tasks and project status
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;

      try {
        const tasksRes = await fetch(`${API_BASE_URL}/api/kanban/${projectId}/tasks`);
        if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
        const tasksData = await tasksRes.json();
        setTasks(tasksData);

        const projectRes = await fetch(`${API_BASE_URL}/api/projects/${projectId}`);
        if (!projectRes.ok) throw new Error("Failed to fetch project");
        const projectData = await projectRes.json();
        setProjectStatus(projectData.status);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchData();
  }, [projectId]);

  const getTasksByStage = (stage: string) => tasks.filter((task) => task.stage === stage);

  // Drag-and-drop logic
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || projectStatus === "finished") return;

    const taskId = result.draggableId;
    const newStage = result.destination.droppableId as Task["stage"];

    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
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

  // Mark project as finished
  const markProjectFinished = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "finished", updatedAt: new Date() }),
      });

      if (res.ok) {
        setProjectStatus("finished");

        // ✅ Show toast notification
        toast.success("Project marked as finished!", {
          position: "top-right",
          duration: 4000,
          style: { background: "#22c55e", color: "#fff" },
        });
      } else {
        toast.error("Failed to update project status", {
          position: "top-right",
          duration: 4000,
        });
      }
    } catch (err) {
      console.error("❌ Error updating project:", err);
      toast.error("Error updating project", { position: "top-right", duration: 4000 });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toast container */}
      <Toaster />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <h3 className="text-lg font-semibold text-[#3c405b]">Project Tasks</h3>

        {/* Buttons (only show if project is ongoing) */}
        {projectStatus === "ongoing" && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center px-4 py-2 bg-[#3c405b] text-white rounded-lg hover:bg-[#2E3453] transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
            <button
              onClick={markProjectFinished}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Finished Project
            </button>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={projectStatus === "ongoing" ? onDragEnd : undefined}>
        <div className="flex-1 grid grid-cols-4 gap-6 min-h-0">
          {columns.map((column) => (
            <Droppable
              droppableId={column.id}
              key={column.id}
              isDropDisabled={projectStatus === "finished"}
            >
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
                      <Draggable
                        key={task._id!}
                        draggableId={task._id!}
                        index={index}
                        isDragDisabled={projectStatus === "finished"}
                      >
                        {(provided) => (
                          <TaskCard
                            task={task}
                            provided={provided}
                            // ✅ Restrict opening modal to view only
                            onSelect={() => setSelectedTask(task)}
                            disableActions={projectStatus === "finished"} // you need to handle inside TaskCard
                          />
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

      {/* Modals */}
      {showAddTask && projectStatus === "ongoing" && (
        <AddTaskModal
          projectId={projectId!}
          newTask={newTask}
          setNewTask={setNewTask}
          onClose={() => setShowAddTask(false)}
          setTasks={setTasks}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          setTasks={setTasks}
          authorName={authorName}
          newComment={newComment}
          setNewComment={setNewComment}
          disableActions={projectStatus === "finished"} // disable comment input & action buttons
        />
      )}
    </div>
  );
};

export default KanbanBoard;
