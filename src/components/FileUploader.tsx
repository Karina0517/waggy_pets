import React from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface FileUploaderProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  currentCount?: number;
  maxCount?: number;
  loading?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileChange,
  accept = "image/*",
  multiple = true,
  disabled = false,
  label,
  currentCount = 0,
  maxCount,
  loading = false
}) => {
  return (
    <div>
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label} {maxCount && `(${currentCount}/${maxCount})`}
        </label>
      )}
      <div className="relative">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onFileChange}
          disabled={disabled || loading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        {loading && (
          <div className="mt-2 flex items-center text-sm text-blue-600">
            <CloudArrowUpIcon className="w-2 h-2 mr-2 animate-pulse" />
            Subiendo imágenes...
          </div>
        )}
      </div>
    </div>
  );
};