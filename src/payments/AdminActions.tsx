import React from "react";
import { Upload } from "lucide-react";

interface Props {
  setShowUploadQuotation: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminActions: React.FC<Props> = ({ setShowUploadQuotation }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8 flex justify-between items-center">
    <h3 className="text-lg font-semibold text-[#3c405b]">Admin Actions</h3>
    <button
      onClick={() => setShowUploadQuotation(true)}
      className="flex items-center px-4 py-2 bg-[#3c405b] text-white rounded-lg hover:bg-[#2E3453]"
    >
      <Upload className="h-4 w-4 mr-2" /> Upload Quotation
    </button>
  </div>
);

export default AdminActions;
