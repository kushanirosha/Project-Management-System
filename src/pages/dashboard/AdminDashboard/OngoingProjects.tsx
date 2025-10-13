import React from "react";
import { Calendar, Folder } from "lucide-react";

interface OngoingProps {
    ongoingProjects: any[];
    getProgressOutOf4: (p: any) => any;
    getProjectStage: (id: string) => string;
    getProjectPaymentStatus: (id: string) => string;
    getCategoryColor: (cat: string) => string;
    getDeadlineColor: (deadline: string) => string;
    getPaymentStatusColor: (status: string) => string;
    formatDeadline: (deadline: string) => string;
    onSelectProject: (p: any) => void;
}

const OngoingProjects: React.FC<OngoingProps> = ({
    ongoingProjects,
    getProgressOutOf4,
    getProjectStage,
    getProjectPaymentStatus,
    getCategoryColor,
    getDeadlineColor,
    getPaymentStatusColor,
    formatDeadline,
    onSelectProject,
}) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#3c405b] mb-6">Ongoing Projects</h2>
        {ongoingProjects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center transition-all hover:shadow-md">
                <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Projects</h3>
                <p className="text-gray-500 text-sm">You don’t have any active projects at the moment.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ongoingProjects.map((project) => {
                    const { current, total, percent } = getProgressOutOf4(project);
                    const stage = getProjectStage(project.id);
                    const paymentStatus = getProjectPaymentStatus(project.id);

                    return (
                        <div
                            key={project.id}
                            onClick={() => onSelectProject(project)}
                            className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-blue-500/30 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer p-6 group"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-5">
                                <h3 className="font-semibold text-[#2e335a] text-lg group-hover:text-blue-600 transition-colors">
                                    {project.name}
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(
                                        project.category
                                    )}`}
                                >
                                    {project.category}
                                </span>
                            </div>

                            {/* Client */}
                            <div className="flex items-center text-sm text-gray-700 mb-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold mr-3 shadow-sm">
                                    {project.client?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{project.client?.name}</span>
                            </div>

                            {/* Deadline */}
                            <div className="flex items-center text-sm mb-3">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span className={`${getDeadlineColor(project.deadline)} font-medium`}>
                                    {formatDeadline(project.deadline)}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="pt-3">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Stage: {stage}</span>
                                    <span className="font-semibold text-gray-700">
                                        {current}/{total}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="pt-4 flex items-center justify-between">
                                <p className="font-medium text-gray-600">Payment:</p>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getPaymentStatusColor(
                                        paymentStatus
                                    )}`}
                                >
                                    {paymentStatus}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
);

export default OngoingProjects;
