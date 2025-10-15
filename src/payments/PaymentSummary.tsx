import React from "react";
import { DollarSign, Check, Clock } from "lucide-react";

interface Props {
  totalAmount: number;
  totalPaid: number;
  remainingAmount: number;
}

const PaymentSummary: React.FC<Props> = ({ totalAmount, totalPaid, remainingAmount }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className="p-2 bg-blue-100 rounded-lg"><DollarSign className="h-6 w-6 text-blue-600" /></div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-[#3c405b]">${totalAmount}</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className="p-2 bg-green-100 rounded-lg"><Check className="h-6 w-6 text-green-600" /></div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Paid Amount</p>
          <p className="text-2xl font-bold text-green-600">${totalPaid}</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className="p-2 bg-orange-100 rounded-lg"><Clock className="h-6 w-6 text-orange-600" /></div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Remaining</p>
          <p className="text-2xl font-bold text-orange-600">${remainingAmount}</p>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentSummary;
