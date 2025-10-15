import React from "react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { Payment } from "../../types/index";

export const getStatusIcon = (status: Payment["status"]) => {
  switch (status) {
    case "paid": return <Check className="h-5 w-5 text-green-600" />;
    case "partial": return <Clock className="h-5 w-5 text-yellow-600" />;
    case "pending": return <Clock className="h-5 w-5 text-gray-600" />;
    case "overdue": return <AlertCircle className="h-5 w-5 text-red-600" />;
    default: return <Clock className="h-5 w-5 text-gray-600" />;
  }
};

export const getStatusColor = (status: Payment["status"]) => {
  switch (status) {
    case "paid": return "bg-green-100 text-green-800";
    case "partial": return "bg-yellow-100 text-yellow-800";
    case "pending": return "bg-gray-100 text-gray-800";
    case "overdue": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
