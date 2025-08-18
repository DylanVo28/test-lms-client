import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end items-center mt-4 gap-4">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 bg-gray-700 text-letter rounded"
        >
          <span>&lt;</span>
        </button>
      )}
      <span className="text-sm text-gray-300">{currentPage}</span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 bg-gray-700 text-letter rounded disabled:opacity-50"
      >
        <span>&gt;</span>
      </button>
    </div>
  );
};

export default Pagination;
