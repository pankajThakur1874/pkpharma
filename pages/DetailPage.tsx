import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMedicines } from '../hooks/useMedicines';
import { MedicineDetailSkeleton } from '../components/Skeleton';
import { ArrowLeft, Pill, Info, Activity, AlertTriangle, FileJson } from 'lucide-react';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { medicines, loading } = useMedicines();
  const [activeTab, setActiveTab] = useState('description');

  const medicine = medicines.find(m => m.id === id);

  if (loading) {
    return <MedicineDetailSkeleton />;
  }

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

  const fallbackImageUrl = `https://placehold.co/600x600/0D9488/FFFFFF?text=${medicine.name.charAt(0)}`;
  
  const TABS = [
    { id: 'description', label: 'Description', icon: Info, content: medicine.description },
    { id: 'uses', label: 'Uses', icon: Activity, content: medicine.uses },
    { id: 'sideEffects', label: 'Side Effects', icon: AlertTriangle, content: medicine.sideEffects },
    { id: 'contraindications', label: 'Contraindications', icon: AlertTriangle, content: medicine.contraindications },
    { id: 'rawData', label: 'Raw Data', icon: FileJson, content: JSON.stringify(medicine.raw, null, 2) },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Link to="/medicines" className="inline-flex items-center mb-6 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Catalog
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <img
            src={medicine.imageUrl || fallbackImageUrl}
            alt={`Image of ${medicine.name}`}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="lg:col-span-3">
          <p className="text-sm uppercase font-semibold text-subtle">{medicine.brand}</p>
          <h1 className="text-4xl font-bold text-text mb-2">{medicine.name}</h1>
          <p className="text-lg text-subtle mb-4">{medicine.genericName}</p>
          
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-extrabold text-primary">₹{medicine.price.toFixed(2)}</span>
            <span className="ml-2 text-sm text-subtle">per pack</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
            <p><strong>Category:</strong> {medicine.category}</p>
            <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
            <p><strong>Form:</strong> {medicine.form}</p>
            <p><strong>Dosage:</strong> {medicine.dosage || 'N/A'}</p>
          </div>
          
          {medicine.prescription && (
            <div className="flex items-center text-accent bg-orange-50 p-3 rounded-md mb-6">
              <Pill className="w-5 h-5 mr-3"/>
              <span className="font-semibold">A prescription is required for this medicine.</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-12">
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {TABS.map(tab => (
                    (tab.content && (Array.isArray(tab.content) ? tab.content.length > 0 : true)) && (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center`}
                        >
                            <tab.icon className="w-5 h-5 mr-2"/>
                            {tab.label}
                        </button>
                    )
                ))}
            </nav>
        </div>
        <div className="py-6">
            {TABS.map(tab => (
                <div key={tab.id} className={`${activeTab === tab.id ? '' : 'hidden'}`}>
                    {tab.content && (
                        Array.isArray(tab.content) ? (
                            <ul className="list-disc list-inside space-y-2">
                                {tab.content.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        ) : tab.id === 'rawData' ? (
                            <pre className="bg-slate-100 p-4 rounded-md text-sm overflow-x-auto"><code>{tab.content}</code></pre>
                        ) : (
                            <p>{tab.content}</p>
                        )
                    )}
                     {(!tab.content || (Array.isArray(tab.content) && tab.content.length === 0)) && <p>No information available.</p>}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;