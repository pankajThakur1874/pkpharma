import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMedicines } from '../hooks/useMedicines';
import { MedicineDetailSkeleton } from '../components/Skeleton';
import {
  ArrowLeft,
  Pill,
  Info,
  Activity,
  AlertTriangle,
  Share2,
  Copy,
  Tag,
  Star,
} from 'lucide-react';

type Medicine = {
  id: string;
  name: string;
  genericName?: string;
  brand?: string;
  category?: string;
  manufacturer?: string;
  form?: string;
  dosage?: string;
  imageUrl?: string | null;
  price: number;
  mrp?: number;
  gst?: number;
  stock?: number;
  prescription?: boolean;
  description?: string;
  uses?: string[] | string;
  sideEffects?: string[] | string;
  contraindications?: string[] | string;
  rating?: number;
  // raw removed / ignored
};

const fallbackImage = (name = 'Medicine') =>
  `https://placehold.co/1200x1200/0D9488/FFFFFF?text=${encodeURIComponent(name.charAt(0) || 'M')}`;

const currency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { medicines, loading } = useMedicines();
  const [activeTab, setActiveTab] = useState<'description' | 'uses' | 'sideEffects' | 'contraindications'>('description');
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [copying, setCopying] = useState(false);

  const medicine: Medicine | undefined = medicines.find((m: Medicine) => m.id === id);

  const images = useMemo(() => {
    if (!medicine) return [];
    const list: string[] = [];
    if (medicine.imageUrl) list.push(medicine.imageUrl);
    if (list.length === 0) list.push(fallbackImage(medicine.name));
    return list;
  }, [medicine]);

  if (loading) return <MedicineDetailSkeleton />;

  if (!medicine) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Medicine not found</h2>
        <Link to="/medicines" className="text-primary hover:underline">
          &larr; Back to Catalog
        </Link>
      </div>
    );
  }

  const inStock = (medicine.stock ?? 0) > 0;
  const hasPrescription = !!medicine.prescription;
  const effectivePrice = medicine.price;
  const hasDiscount = !!medicine.mrp && medicine.mrp > medicine.price;

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      setCopying(true);
      await navigator.clipboard.writeText(url);
      setTimeout(() => setCopying(false), 700);
      // subtle feedback — replace with toast in future if desired
      alert('Link copied to clipboard');
    } catch {
      setCopying(false);
      alert('Copy failed — please copy manually');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: medicine.name,
      text: `Check out ${medicine.name} on People Kind Pharma`,
      url: window.location.href,
    };
    if ((navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
      } catch {
        // user canceled or share unsupported — fallback silently
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Link to="/medicines" className="inline-flex items-center mb-6 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Gallery */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg overflow-hidden shadow-lg bg-white">
            <div className="relative w-full aspect-square bg-slate-50">
              <img
                src={images[selectedImage]}
                alt={`${medicine.name} image ${selectedImage + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fallbackImage(medicine.name);
                }}
              />
              {/* rating pill */}
              <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 text-slate-900 px-3 py-1 rounded-full text-sm shadow">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{(medicine.rating ?? 4.6).toFixed(1)}</span>
              </div>

              {/* prescription badge */}
              {hasPrescription && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-2 bg-orange-50 text-accent px-3 py-1 rounded-full text-sm border border-orange-100">
                  <Pill className="w-4 h-4" />
                  Prescription Required
                </div>
              )}
            </div>

            {/* thumbnails */}
            <div className="p-3 flex items-center gap-3 overflow-x-auto">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    idx === selectedImage ? 'border-primary' : 'border-transparent'
                  } focus:outline-none`}
                  aria-current={idx === selectedImage}
                >
                  <img src={src} alt={`${medicine.name} thumb ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* small product meta */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
            <p className="text-sm text-subtle uppercase font-semibold">{medicine.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-text mb-1">{medicine.name}</h1>
            <p className="text-sm text-subtle">{medicine.genericName}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {medicine.dosage && (
                <span className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full text-sm border border-slate-100">
                  <Tag className="w-4 h-4" /> {medicine.dosage}
                </span>
              )}
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${inStock ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {inStock ? `${medicine.stock} in stock` : 'Out of stock'}
              </span>
              <span className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full text-sm border border-slate-100">
                {medicine.form ?? 'Form unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold mb-1">{medicine.name}</h2>
                <p className="text-sm text-subtle mb-3">{medicine.genericName} • {medicine.manufacturer}</p>

                <div className="flex items-baseline gap-3">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-extrabold text-primary">{currency(effectivePrice)}</span>
                    {hasDiscount && (
                      <span className="text-sm line-through text-subtle">{currency(medicine.mrp!)}</span>
                    )}
                  </div>

                  <div className="ml-3 text-sm text-subtle">
                    {medicine.gst ? <span>GST: {medicine.gst}%</span> : <span className="text-subtle">GST info not available</span>}
                  </div>
                </div>
              </div>

              {/* action row (mobile) */}
              <div className="md:hidden flex items-center gap-3">
                <button
                  onClick={handleShare}
                  title="Share"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 text-sm"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button
                  onClick={handleCopyLink}
                  title="Copy link"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 text-sm"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              </div>
            </div>

            <div className="mt-6 text-sm text-subtle">
              <strong>Category:</strong> {medicine.category ?? '—'} • <strong>Form:</strong> {medicine.form ?? '—'}
            </div>
          </div>

          {/* Tabs + content */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100">
            <div className="border-b px-4">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <TabButton id="description" label="Description" Icon={Info} active={activeTab === 'description'} onClick={() => setActiveTab('description')} />
                <TabButton id="uses" label="Uses" Icon={Activity} active={activeTab === 'uses'} onClick={() => setActiveTab('uses')} />
                <TabButton id="sideEffects" label="Side Effects" Icon={AlertTriangle} active={activeTab === 'sideEffects'} onClick={() => setActiveTab('sideEffects')} />
                <TabButton id="contraindications" label="Contraindications" Icon={AlertTriangle} active={activeTab === 'contraindications'} onClick={() => setActiveTab('contraindications')} />
                <div className="ml-auto flex gap-2">
                  <button onClick={handleShare} className="inline-flex items-center gap-2 py-3 px-2 text-sm border-l border-transparent hover:text-gray-700">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <button onClick={handleCopyLink} className="inline-flex items-center gap-2 py-3 px-2 text-sm">
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
              </nav>
            </div>

            <div className="p-6 space-y-4 min-h-[160px]">
              {activeTab === 'description' && (
                <div>
                  <p className="text-sm leading-relaxed text-slate-700">{medicine.description ?? 'No description available.'}</p>
                </div>
              )}

              {activeTab === 'uses' && (
                <div>
                  {Array.isArray(medicine.uses) ? (
                    <ul className="list-disc list-inside space-y-2">
                      {medicine.uses.map((u: string, i: number) => <li key={i}>{u}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm">{medicine.uses ?? 'No data.'}</p>
                  )}
                </div>
              )}

              {activeTab === 'sideEffects' && (
                <div>
                  {Array.isArray(medicine.sideEffects) ? (
                    <ul className="list-disc list-inside space-y-2">
                      {medicine.sideEffects.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm">{medicine.sideEffects ?? 'No data.'}</p>
                  )}
                </div>
              )}

              {activeTab === 'contraindications' && (
                <div>
                  {Array.isArray(medicine.contraindications) ? (
                    <ul className="list-disc list-inside space-y-2">
                      {medicine.contraindications.map((c: string, i: number) => <li key={i}>{c}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm">{medicine.contraindications ?? 'No data.'}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick CTA band */}
          <section className="bg-white mt-6 rounded-lg p-4 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Need help choosing a medicine?</h3>
                <p className="text-sm text-subtle">Talk to our pharmacist for free guidance on interactions and dosing.</p>
              </div>

              <div className="flex gap-3">
                <Link to="/contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white font-medium shadow">
                  Contact Pharmacist
                </Link>
                <Link to="/medicines" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 text-slate-700">
                  Browse Medicines
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;

/* ---------- Helper mini-components ---------- */

function TabButton({ id, label, Icon, active, onClick }: { id: string; label: string; Icon: React.ElementType; active: boolean; onClick: () => void; }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-1 border-b-2 inline-flex items-center gap-2 text-sm ${active ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
      role="tab"
      aria-selected={active}
      id={`tab-${id}`}
      aria-controls={`panel-${id}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
