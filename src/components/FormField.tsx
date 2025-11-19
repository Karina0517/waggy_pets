import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'textarea' | 'select';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | string;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  min,
  max,
  step,
  rows = 4,
  options = [],
  className = ''
}) => {
  const baseInputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className={className}>
      <label className="block mb-2 font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className={baseInputClass}
        />
      ) : type === 'select' ? (
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={baseInputClass}
        >
            <option value="">Seleccionar...</option>
            {options.map((option, optIndex) => (
            <option 
                key={`${option.value}-${optIndex}`} // Key única
                value={option.value}
            >
                {option.label}
            </option>
            ))}
        </select>
        ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className={baseInputClass}
        />
      )}
    </div>
  );
};