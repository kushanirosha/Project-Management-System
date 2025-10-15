import React from "react";

export interface BankInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  country: string;
}

const BankDetails: React.FC<{ bankDetails: BankInfo }> = ({ bankDetails }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
    <h3 className="text-lg font-semibold text-[#3c405b] mb-4">Bank Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
      <p><strong>Account Holder Name:</strong> {bankDetails.accountName}</p>
      <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
      <p><strong>Branch Name:</strong> {bankDetails.routingNumber}</p>
      <p><strong>Country:</strong> {bankDetails.country}</p>
    </div>
  </div>
);

export default BankDetails;
