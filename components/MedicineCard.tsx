
import React from 'react';
import { Link } from 'react-router-dom';
import type { Medicine } from '../types';
import { Pill, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { useEnquiry } from '../hooks/useEnquiry';

interface MedicineCardProps {
  medicine: Medicine;
  view: 'grid' | 'list';
}

const AvailabilityBadge: React.FC<{ availability: Medicine['availability'] }> = ({ availability }) => {
    const baseClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full inline-flex items-center";
    if (availability === "In Stock") {
        return <span className={`bg-green-100 text-green-800 ${baseClasses}`}><CheckCircle className="w-3 h-3 mr-1"/>In Stock</span>;
    }
    if (availability === "Low Stock") {
        return <span className={`bg-yellow-100 text-yellow-800 ${baseClasses}`}><AlertTriangle className="w-3 h-3 mr-1"/>Low Stock</span>;
    }
    return <span className={`bg-red-100 text-red-800 ${baseClasses}`}><AlertTriangle className="w-3 h-3 mr-1"/>Out of Stock</span>;
};

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, view }) => {
    const { addToEnquiry, isInEnquiry } = useEnquiry();
    const isAdded = isInEnquiry(medicine.id);

  const fallbackImageUrl = `https://placehold.co/400x400/0D9488/FFFFFF?text=${medicine.name.charAt(0)}`;

  if (view === 'list') {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row w-full">
            <div className="md:w-1/4 flex-shrink-0">
                <Link to={`/medicine/${medicine.id}`}>
                    <img
                        src={medicine.imageUrl || fallbackImageUrl}
                        alt={`Image of ${medicine.name}`}
                        className="w-full h-48 md:h-full object-cover"
                    />
                </Link>
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <div className="flex justify-between items-start">
                        <Link to={`/medicine/${medicine.id}`} className="block">
                            <h3 className="text-xl font-bold text-primary-dark hover:underline">{medicine.name}</h3>
                            <p className="text-sm text-subtle">{medicine.genericName}</p>
                        </Link>
                        <AvailabilityBadge availability={medicine.availability} />
                    </div>
                     <p className="text-sm text-gray-600 mt-2">By <span className="font-semibold">{medicine.brand}</span></p>
                </div>
                <div className="flex justify-between items-end mt-4">
                    <p className="text-2xl font-bold text-text">${medicine.price.toFixed(2)}</p>
                    <button
                        onClick={() => addToEnquiry(medicine)}
                        disabled={isAdded}
                        className="flex items-center px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-md transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                        aria-label={isAdded ? `Added ${medicine.name} to enquiry` : `Add ${medicine.name} to enquiry`}
                    >
                       {isAdded ? <CheckCircle size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
                       {isAdded ? 'Added' : 'Add to Enquiry'}
                    </button>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <Link to={`/medicine/${medicine.id}`} aria-label={`View details for ${medicine.name}`}>
        <div className="relative">
          <img
            src={medicine.imageUrl || fallbackImageUrl}
            alt={`Image of ${medicine.name}`}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <AvailabilityBadge availability={medicine.availability} />
          </div>
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-sm text-gray-500">{medicine.brand}</p>
          <Link to={`/medicine/${medicine.id}`} aria-label={`View details for ${medicine.name}`}>
            <h3 className="text-lg font-bold text-primary-dark truncate hover:underline" title={medicine.name}>{medicine.name}</h3>
          </Link>
          <p className="text-sm text-subtle truncate" title={medicine.genericName}>{medicine.genericName}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold text-text">${medicine.price.toFixed(2)}</p>
          {/* FIX: The 'title' prop is not valid on the lucide-react icon component. Wrapped the Pill icon in a span to correctly apply the 'title' attribute for the tooltip. */}
          {medicine.prescription && <span title="Prescription required"><Pill size={20} className="text-accent" /></span>}
        </div>
         <button
            onClick={() => addToEnquiry(medicine)}
            disabled={isAdded}
            className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-md transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            aria-label={isAdded ? `Added ${medicine.name} to enquiry` : `Add ${medicine.name} to enquiry`}
        >
            {isAdded ? <CheckCircle size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
            {isAdded ? 'Added' : 'Add to Enquiry'}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
