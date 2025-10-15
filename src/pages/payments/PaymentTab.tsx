import React, { useEffect, useState } from "react";
import { Payment } from "../../types/index";
import { useAuth } from "../../contexts/AuthContext";
import { bankDetails } from "../../data/dummyData";
import { useParams } from "react-router-dom";

import PaymentSummary from "./PaymentSummary";
import BankDetails from "./BankDetails";
import AdminActions from "./AdminActions";
import PaymentList from "./PaymentList";
import UploadQuotationModal from "../../components/UploadQuotationModal";
import UploadReceiptModal from "../../components/UploadReceiptModal";

const API_URL = "http://localhost:5000/api/payments";

const PaymentTab: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [showUploadQuotation, setShowUploadQuotation] = useState(false);
  const [showUploadReceipt, setShowUploadReceipt] = useState<string | null>(null);

  const [receiptAmount, setReceiptAmount] = useState<number | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [quotationData, setQuotationData] = useState({
    amount: 0,
    description: "",
    file: null as File | null,
  });

  // ---------------- Fetch payments ----------------
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

  if (loading) return <p>Loading payments...</p>;

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.reduce(
    (sum, p) => sum + p.receipts.reduce((s, r) => s + r.amountPaid, 0),
    0
  );
  const remainingAmount = totalAmount - totalPaid;

  return (
    <div className="h-full overflow-y-auto">
      <PaymentSummary totalAmount={totalAmount} totalPaid={totalPaid} remainingAmount={remainingAmount} />
      <BankDetails bankDetails={bankDetails} />
      {isAdmin && (
        <AdminActions setShowUploadQuotation={setShowUploadQuotation} />
      )}
      <PaymentList
        payments={payments}
        isAdmin={isAdmin}
        setShowUploadReceipt={setShowUploadReceipt}
      />

      {showUploadQuotation && (
        <UploadQuotationModal
          quotationData={quotationData}
          setQuotationData={setQuotationData}
          projectId={projectId!}
          setShowUploadQuotation={setShowUploadQuotation}
          setPayments={setPayments}
        />
      )}

      {showUploadReceipt && (
        <UploadReceiptModal
          showUploadReceipt={showUploadReceipt}
          setShowUploadReceipt={setShowUploadReceipt}
          receiptAmount={receiptAmount}
          setReceiptAmount={setReceiptAmount}
          receiptFile={receiptFile}
          setReceiptFile={setReceiptFile}
          setPayments={setPayments}
        />
      )}
    </div>
  );
};

export default PaymentTab;
