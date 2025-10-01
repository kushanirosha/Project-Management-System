import React, { useState, useEffect } from "react";
import { DollarSign, Upload, Check, Clock, AlertCircle, Download } from "lucide-react";
import { Project, Payment } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { bankDetails } from "../../data/dummyData";
import { useParams } from "react-router-dom";


interface PaymentTabProps {
  project: Project;
}

const API_URL = "http://localhost:5000/api/payments"; // backend

const PaymentTab: React.FC<PaymentTabProps> = ({ project }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [showUploadQuotation, setShowUploadQuotation] = useState(false);
  const [showUploadReceipt, setShowUploadReceipt] = useState<string | null>(null);

  const [quotationData, setQuotationData] = useState({
    amount: 0,
    description: "",
    file: null as File | null,
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

 // Fetch payments from backend
useEffect(() => {
  if (!projectId) return;
  
  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_URL}?projectId=${projectId}`);
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error("❌ Error fetching payments", err);
    } finally {
      setLoading(false);
    }
  };
  fetchPayments();
}, [projectId]);


  // ---------------- Admin Upload Quotation ----------------
  const handleUploadQuotation = async () => {
    if (!quotationData.file) return alert("Please select a quotation file");

    const formData = new FormData();
    formData.append("projectId", project._id);  // <-- use MongoDB ID
    formData.append("amount", String(quotationData.amount));
    formData.append("description", quotationData.description);
    formData.append("quotation", quotationData.file);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const newPayment = await res.json();
      setPayments((prev) => [...prev, newPayment]);

      setShowUploadQuotation(false);
      setQuotationData({ amount: 0, description: "", file: null });
    } catch (err) {
      console.error("❌ Error uploading quotation", err);
    }
  };

  // ---------------- Client Upload Receipt ----------------
  const handleUploadReceipt = async (paymentId: string) => {
    if (!receiptFile) return alert("Please select a receipt file");

    const formData = new FormData();
    formData.append("receipt", receiptFile);

    try {
      const res = await fetch(`${API_URL}/${paymentId}/receipt`, {
        method: "PUT",
        body: formData,
      });
      const updatedPayment = await res.json();

      setPayments((prev) =>
        prev.map((p) => (p.id === updatedPayment._id ? updatedPayment : p))
      );

      setShowUploadReceipt(null);
      setReceiptFile(null);
    } catch (err) {
      console.error("❌ Error uploading receipt", err);
    }
  };

  // ---------------- Status Helpers ----------------
  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return <Check className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const paymentList = Array.isArray(payments) ? payments : [];
  
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = totalAmount - paidAmount;

  if (loading) return <p>Loading payments...</p>;

  return (
    <div className="h-full overflow-y-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-[#3c405b]">${totalAmount}</p>
            </div>
          </div>
        </div>
        {/* Paid */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">${paidAmount}</p>
            </div>
          </div>
        </div>
        {/* Remaining */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-orange-600">${remainingAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-[#3c405b] mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
          <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
          <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
          <p><strong>Routing Number:</strong> {bankDetails.routingNumber}</p>
        </div>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#3c405b]">Admin Actions</h3>
            <button
              onClick={() => setShowUploadQuotation(true)}
              className="flex items-center px-4 py-2 bg-[#3c405b] text-white rounded-lg hover:bg-[#2E3453]"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Quotation
            </button>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#3c405b]">Payments</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {paymentList.length === 0 ? (
            <div className="p-8 text-center">No payments yet</div>
          ) : (
            payments.map((p) => (
              <div key={p._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(p.status)}
                    <div className="ml-3">
                      <p className="font-medium text-[#3c405b]">${p.amount}</p>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(p.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(p.status)}`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quotation */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quotation</p>
                    {p.quotationUrl ? (
                      <a
                        href={p.quotationUrl}
                        target="_blank"
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        View Quotation
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">Not uploaded</p>
                    )}
                  </div>

                  {/* Receipt */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receipt</p>
                    {p.receiptUrl ? (
                      <a
                        href={p.receiptUrl}
                        target="_blank"
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        View Receipt
                      </a>
                    ) : !isAdmin && p.status === "pending" ? (
                      <button
                        onClick={() => setShowUploadReceipt(p._id)}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload Receipt
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">Not uploaded</p>
                    )}
                  </div>

                  {/* Paid Info */}
                  <div>
                    {p.paidAt && (
                      <p className="text-sm text-gray-500">
                        Paid: {new Date(p.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Quotation Modal */}
      {showUploadQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#3c405b] mb-4">Upload Quotation</h3>
            <input
              type="number"
              placeholder="Amount"
              value={quotationData.amount}
              onChange={(e) =>
                setQuotationData((prev) => ({ ...prev, amount: Number(e.target.value) }))
              }
              className="w-full border p-2 mb-3 rounded"
            />
            <textarea
              placeholder="Description"
              value={quotationData.description}
              onChange={(e) =>
                setQuotationData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setQuotationData((prev) => ({ ...prev, file: e.target.files?.[0] || null }))}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowUploadQuotation(false)}>Cancel</button>
              <button onClick={handleUploadQuotation} className="bg-[#3c405b] text-white px-4 py-2 rounded">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Receipt Modal */}
      {showUploadReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#3c405b] mb-4">Upload Receipt</h3>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowUploadReceipt(null)}>Cancel</button>
              <button
                onClick={() => handleUploadReceipt(showUploadReceipt)}
                className="bg-[#3c405b] text-white px-4 py-2 rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTab;
