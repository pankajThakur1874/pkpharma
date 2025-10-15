
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 my-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Previous
      </button>

      <span className="text-sm text-gray-700">
        Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to next page"
      >
        Next
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

export default Pagination;
