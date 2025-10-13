import React from "react";

interface FinishedProps {
  finishedProjects: any[];
  getCategoryColor: (cat: string) => string;
  getPaymentStatusColor: (status: string) => string;
  getProjectPaymentStatus: (id: string) => string;
  getProjectCompletionDate: (p: any) => string | null;
  onSelectProject: (p: any) => void;
}

const FinishedProjects: React.FC<FinishedProps> = ({
  finishedProjects,
  getCategoryColor,
  getPaymentStatusColor,
  getProjectPaymentStatus,
  getProjectCompletionDate,
  onSelectProject,
}) =>
  finishedProjects.length > 0 && (
    <div>
      <h2 className="text-2xl font-bold text-[#3c405b] mb-6">Recently Completed</h2>
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Project", "Client", "Category", "Completed", "Payment"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {finishedProjects.map((project) => {
              const paymentStatus = getProjectPaymentStatus(project.id);
              const completionDate = getProjectCompletionDate(project);

              return (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3c405b]">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.client?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        project.category
                      )}`}
                    >
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {completionDate
                      ? new Date(completionDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        paymentStatus
                      )}`}
                    >
                      {paymentStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

export default FinishedProjects;
