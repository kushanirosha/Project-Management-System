import React from "react";
import { Calendar, User, Folder, Clock } from "lucide-react";

interface StatsProps {
  projects: any[];
  users: any[];
  ongoingCount: number;
  finishedCount: number;
  uncompletedPaymentsCount: number;
}

const StatsCards: React.FC<StatsProps> = ({
  projects,
  users,
  ongoingCount,
  finishedCount,
  uncompletedPaymentsCount,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-8 mt-48">
    {/* Total Projects */}
    <Card icon={<Folder className="h-6 w-6 text-blue-600" />} label="Total Projects" value={projects.length} color="bg-blue-100" />
    <Card icon={<Clock className="h-6 w-6 text-green-600" />} label="Ongoing" value={ongoingCount} color="bg-green-100" />
    <Card icon={<User className="h-6 w-6 text-purple-600" />} label="Clients" value={users.length} color="bg-purple-100" />
    <Card icon={<Calendar className="h-6 w-6 text-orange-600" />} label="Completed Projects" value={finishedCount} color="bg-orange-100" />
    <Card icon={<Clock className="h-6 w-6 text-red-600" />} label="Uncompleted Payments" value={uncompletedPaymentsCount} color="bg-red-100" />
  </div>
);

const Card = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center">
      <div className={`p-2 ${color} rounded-lg`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-[#3c405b]">{value}</p>
      </div>
    </div>
  </div>
);

export default StatsCards;
