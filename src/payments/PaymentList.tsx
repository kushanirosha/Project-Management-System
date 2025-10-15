import React from "react";
import { Upload, Download } from "lucide-react";
import { Payment } from "../types/index";
import { getStatusColor, getStatusIcon } from "./helpers";

interface Props {
  payments: Payment[];
  isAdmin: boolean;
  setShowUploadReceipt: React.Dispatch<React.SetStateAction<string | null>>;
}

const PaymentList: React.FC<Props> = ({ payments, isAdmin, setShowUploadReceipt }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-[#3c405b]">Payments</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {payments.length === 0 ? (
          <div className="p-8 text-center">No payments yet</div>
        ) : (
          payments.map((p) => {
            const paymentPaidAmount = p.receipts.reduce((sum, r) => sum + r.amountPaid, 0);
            return (
              <div key={p._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(p.status)}
                    <div className="ml-3">
                      <p className="font-medium text-[#3c405b]">${p.amount}</p>
                      <p className="text-sm text-gray-600">Due: {new Date(p.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quotation */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quotation</p>
                    {p.quotationUrl ? (
                      <a href={p.quotationUrl} target="_blank" className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                        <Download className="h-4 w-4 mr-1" /> View Quotation
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">Not uploaded</p>
                    )}
                  </div>

                  {/* Receipts */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receipts</p>
                    {p.receipts && p.receipts.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {p.receipts.map((r, i) => (
                          <div key={i} className="flex items-center justify-between text-sm text-gray-700 border-b border-gray-200 py-1">
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4 text-blue-600" />
                              <a href={r.receiptUrl} target="_blank" className="hover:text-blue-800">
                                ${r.amountPaid} - {new Date(r.paidAt).toLocaleDateString()}
                              </a>
                            </div>
                            <span className="text-xs text-gray-500">
                              {r.amountPaid < p.amount ? "Partial" : "Full"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No receipts uploaded yet</p>
                    )}
                    {!isAdmin && p.status !== "paid" && (
                      <button
                        onClick={() => setShowUploadReceipt(p._id)}
                        className="flex items-center mt-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Upload className="h-4 w-4 mr-1" /> Upload Receipt
                      </button>
                    )}
                  </div>

                  {/* Paid Info */}
                  <div>
                    <p className="text-sm text-gray-500">Paid: ${paymentPaidAmount} / ${p.amount}</p>
                    <p className="text-sm text-gray-500">Remaining: ${p.amount - paymentPaidAmount}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PaymentList;
