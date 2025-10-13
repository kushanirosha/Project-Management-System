import React from "react";
import { Calendar, Paperclip, MessageCircle } from "lucide-react";
import { Task } from "../types/index";

interface TaskCardProps {
  task: Task;
  provided: any;
  onSelect: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, provided, onSelect }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={onSelect}
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
          {task.attachments?.length ? (
            <div className="flex items-center">
              <Paperclip className="h-3 w-3" />
              <span className="ml-1">{task.attachments.length}</span>
            </div>
          ) : null}
          {task.comments?.length ? (
            <div className="flex items-center">
              <MessageCircle className="h-3 w-3" />
              <span className="ml-1">{task.comments.length}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
