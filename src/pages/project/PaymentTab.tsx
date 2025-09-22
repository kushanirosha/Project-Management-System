import React, { useState } from 'react';
import { DollarSign, Upload, Check, Clock, AlertCircle, Download } from 'lucide-react';
import { Project, Payment } from '../../types';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';
import { bankDetails } from '../../data/dummyData';

interface PaymentTabProps {
  project: Project;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ project }) => {
  const [showUploadQuotation, setShowUploadQuotation] = useState(false);
  const [showUploadReceipt, setShowUploadReceipt] = useState(false);
  const [quotationData, setQuotationData] = useState({ amount: 0, description: '' });

  const { updatePayment } = useProject();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const totalAmount = project.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = project.payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = totalAmount - paidAmount;

  const handleMarkAsPaid = (paymentId: string) => {
    updatePayment(project.id, paymentId, {
      status: 'paid',
      paidAt: new Date().toISOString()
    });
  };

  const handleUploadQuotation = () => {
    // In a real app, this would upload the file and create a payment
    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      projectId: project.id,
      amount: quotationData.amount,
      status: 'pending',
      quotationUrl: '/dummy-quotation.pdf',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };
    
    // This would be handled by the project context
    console.log('New payment created:', newPayment);
    
    setShowUploadQuotation(false);
    setQuotationData({ amount: 0, description: '' });
  };

  const handleUploadReceipt = (paymentId: string) => {
    updatePayment(project.id, paymentId, {
      receiptUrl: '/dummy-receipt.pdf'
    });
    setShowUploadReceipt(false);
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-[#3c405b]">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">${paidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-orange-600">${remainingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-[#3c405b] mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Bank Name</p>
            <p className="text-[#2E3453] font-medium">{bankDetails.bankName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Account Name</p>
            <p className="text-[#2E3453] font-medium">{bankDetails.accountName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Account Number</p>
            <p className="text-[#2E3453] font-medium">{bankDetails.accountNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Routing Number</p>
            <p className="text-[#2E3453] font-medium">{bankDetails.routingNumber}</p>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#3c405b]">Admin Actions</h3>
            <button
              onClick={() => setShowUploadQuotation(true)}
              className="flex items-center px-4 py-2 bg-[#3c405b] text-white rounded-lg hover:bg-[#2E3453] transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Quotation
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Upload quotations and mark payments as received to keep track of project finances.
          </p>
        </div>
      )}

      {/* Payments List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#3c405b]">Payments</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {project.payments.length === 0 ? (
            <div className="p-8 text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No payments yet</h4>
              <p className="text-gray-500">Payments will appear here once quotations are uploaded.</p>
            </div>
          ) : (
            project.payments.map((payment) => (
              <div key={payment.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(payment.status)}
                    <div className="ml-3">
                      <p className="font-medium text-[#3c405b]">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quotation */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Quotation</p>
                    {payment.quotationUrl ? (
                      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        View Quotation
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">Not uploaded</p>
                    )}
                  </div>

                  {/* Receipt */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Payment Receipt</p>
                    {payment.receiptUrl ? (
                      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        View Receipt
                      </button>
                    ) : !isAdmin && payment.status === 'pending' ? (
                      <button
                        onClick={() => setShowUploadReceipt(true)}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload Receipt
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">Not uploaded</p>
                    )}
                  </div>

                  {/* Admin Action */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Action</p>
                    {isAdmin && payment.status === 'pending' && payment.receiptUrl && (
                      <button
                        onClick={() => handleMarkAsPaid(payment.id)}
                        className="flex items-center text-green-600 hover:text-green-800 text-sm"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark as Paid
                      </button>
                    )}
                    {payment.paidAt && (
                      <p className="text-sm text-gray-500">
                        Paid: {new Date(payment.paidAt).toLocaleDateString()}
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2E3453] mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={quotationData.amount}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2E3453] mb-1">
                  Description
                </label>
                <textarea
                  value={quotationData.description}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter payment description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2E3453] mb-1">
                  Quotation File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload PDF file</p>
                  <input type="file" accept=".pdf" className="hidden" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadQuotation(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadQuotation}
                className="px-4 py-2 bg-[#3c405b] text-white rounded-lg hover:bg-[#2E3453] transition-colors"
              >
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
            <h3 className="text-lg font-semibold text-[#3c405b] mb-4">Upload Payment Receipt</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2E3453] mb-1">
                  Receipt File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload PDF or Image file</p>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadReceipt(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUploadReceipt('payment-1')}
                className="px-4 py-2 bg-[#3c405b] text-white rounded-lg hover:bg-[#2E3453] transition-colors"
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