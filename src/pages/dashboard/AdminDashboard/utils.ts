export const API_URL = "http://localhost:5000/api";
export const STAGES = ["to do", "in progress", "review", "done"];

export const formatDeadline = (deadline: string) => {
  const date = new Date(deadline);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `${diffDays} days left`;
};

export const getCategoryColor = (category: "web" | "graphic") =>
  category === "web"
    ? "bg-blue-100 text-blue-800"
    : "bg-purple-100 text-purple-800";

export const getDeadlineColor = (deadline: string) => {
  const date = new Date(deadline);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "text-red-600";
  if (diffDays <= 2) return "text-orange-600";
  return "text-green-600";
};

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "partial":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-red-100 text-red-800";
  }
};
