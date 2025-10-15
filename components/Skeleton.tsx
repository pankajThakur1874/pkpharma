
import React from 'react';

export const MedicineCardSkeleton: React.FC<{view: 'grid' | 'list'}> = ({view}) => {
    if (view === 'list') {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex w-full animate-pulse">
                <div className="md:w-1/4 bg-slate-200"></div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-10 bg-slate-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse">
            <div className="w-full h-48 bg-slate-200"></div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 w-6 bg-slate-200 rounded-full"></div>
                </div>
                <div className="w-full mt-4 h-10 bg-slate-200 rounded-md"></div>
            </div>
        </div>
    );
};

export const MedicineDetailSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="bg-slate-200 rounded-lg w-full h-96"></div>
      </div>
      <div>
        <div className="h-10 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-6"></div>
        <div className="h-12 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-3">
          <div className="h-5 bg-slate-200 rounded w-full"></div>
          <div className="h-5 bg-slate-200 rounded w-5/6"></div>
          <div className="h-5 bg-slate-200 rounded w-full"></div>
        </div>
        <div className="mt-8 h-12 bg-slate-200 rounded w-full"></div>
      </div>
    </div>
    <div className="mt-12">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
            <div className="h-5 bg-slate-200 rounded w-full"></div>
            <div className="h-5 bg-slate-200 rounded w-full"></div>
            <div className="h-5 bg-slate-200 rounded w-5/6"></div>
        </div>
    </div>
  </div>
);
