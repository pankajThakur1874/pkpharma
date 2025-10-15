import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Medicine } from '../types';
import { Pill, AlertTriangle, CheckCircle, Star } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
  view: 'grid' | 'list';
  /** optional search term to highlight matches in name/generic/brand */
  searchHighlight?: string;
  /** optional quick view callback (e.g. open modal) */
  onQuickView?: (medicine: Medicine) => void;
  /** optional favorite toggle */
  onToggleFavorite?: (medicineId: string) => void;
  /** whether this medicine is marked favorite (for heart icon) */
  isFavorite?: boolean;
}

const baseBadgeClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full inline-flex items-center";

/** defensive helpers */
const safe = (v: any) => (v === null || v === undefined ? '' : String(v));
const currency = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

const AvailabilityBadge: React.FC<{ availability?: Medicine['availability'] | string | number }> = ({ availability }) => {
  // accept either "In Stock"/"Low Stock"/"Out of Stock" or numeric stock
  if (typeof availability === 'number') {
    if (availability > 10) {
      return <span className={`bg-green-100 text-green-800 ${baseBadgeClasses}`}><CheckCircle className="w-3 h-3 mr-1" />In Stock</span>;
    }
    if (availability > 0) {
      return <span className={`bg-yellow-100 text-yellow-800 ${baseBadgeClasses}`}><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</span>;
    }
    return <span className={`bg-red-100 text-red-800 ${baseBadgeClasses}`}><AlertTriangle className="w-3 h-3 mr-1" />Out of Stock</span>;
  }

  const v = (availability || '').toString().toLowerCase();
  if (v.includes('in')) return <span className={`bg-green-100 text-green-800 ${baseBadgeClasses}`}><CheckCircle className="w-3 h-3 mr-1" />In Stock</span>;
  if (v.includes('low') || v.includes('few')) return <span className={`bg-yellow-100 text-yellow-800 ${baseBadgeClasses}`}><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</span>;
  return <span className={`bg-red-100 text-red-800 ${baseBadgeClasses}`}><AlertTriangle className="w-3 h-3 mr-1" />Out of Stock</span>;
};

/** highlight matches in text, returns React elements */
function highlight(text: string, query?: string) {
  if (!query) return text;
  const q = query.trim();
  if (!q) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'ig'));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? <mark key={i} className="bg-yellow-200 rounded-sm px-0.5">{part}</mark> : part
  );
}
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  view,
  searchHighlight,
  onQuickView,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const fallbackImageUrl = useMemo(() => {
    const letter = safe(medicine.name).charAt(0) || 'M';
    return `https://placehold.co/600x600/0D9488/FFFFFF?text=${encodeURIComponent(letter)}`;
  }, [medicine.name]);

  const price = typeof medicine.price === 'number' ? medicine.price : Number(medicine.price || 0);
  const mrp = typeof (medicine as any).mrp === 'number' ? (medicine as any).mrp : undefined;
  const hasDiscount = typeof mrp === 'number' && mrp > price;

  const imageSrc = !imgError && medicine.imageUrl ? medicine.imageUrl : fallbackImageUrl;

  // Accessibility labels
  const detailUrl = `/medicine/${medicine.id}`;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(medicine.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(medicine);
  };

  if (view === 'list') {
    return (
      <article
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row w-full focus-within:ring-2 focus-within:ring-primary"
      >
        <Link to={detailUrl} className="md:w-1/3 flex-shrink-0 group" aria-label={`Open ${medicine.name} details`}>
          <div className="w-full h-44 md:h-full bg-slate-100 overflow-hidden relative">
            <img
              src={imageSrc}
              alt={safe(medicine.name)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            <div className="absolute top-2 left-2">
              <AvailabilityBadge availability={medicine.availability ?? medicine.stock} />
            </div>
          </div>
        </Link>

        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start gap-4">
              <Link to={detailUrl} className="block min-w-0" aria-label={`Open ${medicine.name} details`}>
                <h3 className="text-xl font-bold text-primary-dark hover:underline truncate">
                  {searchHighlight ? highlight(medicine.name, searchHighlight) : medicine.name}
                </h3>
                <p className="text-sm text-subtle truncate">
                  {searchHighlight ? highlight(safe(medicine.genericName), searchHighlight) : medicine.genericName}
                </p>
              </Link>

              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-text">{currency(price)}</div>
                  {hasDiscount && <div className="text-sm line-through text-subtle">{currency(mrp!)}</div>}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handleQuickView} title="Quick view" className="p-2 rounded-md hover:bg-slate-100 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">By <span className="font-semibold">{searchHighlight ? highlight(safe(medicine.brand), searchHighlight) : medicine.brand}</span></p>
            <div className="mt-3 flex gap-2 flex-wrap items-center">
              {medicine.dosage && <span className="text-xs bg-slate-100 px-2 py-1 rounded">{medicine.dosage}</span>}
              {medicine.form && <span className="text-xs bg-slate-100 px-2 py-1 rounded">{medicine.form}</span>}
              {medicine.gst !== undefined && <span className="text-xs bg-slate-50 px-2 py-1 rounded">GST {medicine.gst}%</span>}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // grid view
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <Link to={detailUrl} aria-label={`Open ${medicine.name} details`} className="group">
        <div className="relative">
          <div className="w-full h-44 bg-slate-100 overflow-hidden">
            <img
              src={imageSrc}
              alt={safe(medicine.name)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          </div>

          <div className="absolute top-2 left-2">
            <AvailabilityBadge availability={medicine.availability ?? medicine.stock} />
          </div>

          {medicine.prescription && (
            <div className="absolute top-2 right-2 inline-flex items-center gap-2 bg-orange-50 text-accent px-2 py-1 rounded-full text-xs border border-orange-100">
              <Pill className="w-3 h-3" /> Rx
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <p className="text-sm text-gray-500">{searchHighlight ? highlight(safe(medicine.brand), searchHighlight) : medicine.brand}</p>
            <h3 className="text-lg font-bold text-primary-dark truncate" title={medicine.name}>
              {searchHighlight ? highlight(medicine.name, searchHighlight) : medicine.name}
            </h3>
            <p className="text-sm text-subtle truncate" title={medicine.genericName}>
              {searchHighlight ? highlight(safe(medicine.genericName), searchHighlight) : medicine.genericName}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="text-xl font-bold text-text">{currency(price)}</div>
              {hasDiscount && <div className="text-sm line-through text-subtle">{currency(mrp!)}</div>}
            </div>

            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center text-sm text-slate-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{(medicine.rating ?? 4.5).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default MedicineCard;
