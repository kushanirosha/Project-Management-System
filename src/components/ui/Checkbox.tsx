import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = ''
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      {label && (
        <label className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};