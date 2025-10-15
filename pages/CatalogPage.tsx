import React, { useState, useMemo } from 'react';
import { useMedicines } from '../hooks/useMedicines';
import { useDebounce } from '../hooks/useDebounce';
import MedicineCard from '../components/MedicineCard';
import { MedicineCardSkeleton } from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { Search, X, List, LayoutGrid, AlertCircle } from 'lucide-react';
import type { Medicine } from '../types';

const ITEMS_PER_PAGE = 24;

const CatalogPage: React.FC = () => {
  const { medicines, loading, error } = useMedicines();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [manufacturerFilter, setManufacturerFilter] = useState('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { uniqueCategories, uniqueManufacturers } = useMemo(() => {
    const categories = new Set<string>();
    const manufacturers = new Set<string>();
    medicines.forEach(med => {
      if (med.category) categories.add(med.category);
      if (med.manufacturer) manufacturers.add(med.manufacturer);
    });
    return {
      uniqueCategories: Array.from(categories).sort(),
      uniqueManufacturers: Array.from(manufacturers).sort(),
    };
  }, [medicines]);

  const filteredAndSortedMedicines = useMemo(() => {
    let filtered = medicines.filter(med => {
      const searchTermLower = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        med.name.toLowerCase().includes(searchTermLower) ||
        med.genericName.toLowerCase().includes(searchTermLower) ||
        med.brand.toLowerCase().includes(searchTermLower);

      const matchesCategory = categoryFilter === 'all' || med.category === categoryFilter;
      const matchesManufacturer = manufacturerFilter === 'all' || med.manufacturer === manufacturerFilter;
      const matchesPrescription = !prescriptionFilter || med.prescription === true;

      return matchesSearch && matchesCategory && matchesManufacturer && matchesPrescription;
    });

    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'availability': return b.stock - a.stock;
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [medicines, debouncedSearchTerm, categoryFilter, manufacturerFilter, prescriptionFilter, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedMedicines.length / ITEMS_PER_PAGE);
  const paginatedMedicines = filteredAndSortedMedicines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setManufacturerFilter('all');
    setPrescriptionFilter(false);
    setSortOrder('name-asc');
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 sticky top-16 z-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search by Name, Generic, or Brand</label>
            <Search className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Avomine, Promethazine..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary w-full"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
              <option value="all">All Categories</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">Manufacturer</label>
            <select id="manufacturer" value={manufacturerFilter} onChange={e => setManufacturerFilter(e.target.value)} className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
              <option value="all">All Manufacturers</option>
              {uniqueManufacturers.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
                 <div className="flex items-center">
                    <input type="checkbox" id="prescription" checked={prescriptionFilter} onChange={e => setPrescriptionFilter(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <label htmlFor="prescription" className="ml-2 block text-sm text-gray-900">Prescription only</label>
                </div>
                <button onClick={resetFilters} className="flex items-center text-sm text-primary hover:underline">
                    <X className="w-4 h-4 mr-1" />
                    Reset Filters
                </button>
            </div>
            <div>
                <label htmlFor="sort" className="sr-only">Sort by</label>
                <select id="sort" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="availability">Availability</option>
                </select>
            </div>
        </div>
      </div>
        <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-600">
                Showing {paginatedMedicines.length} of {filteredAndSortedMedicines.length} results
            </p>
            <div className="flex items-center space-x-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white'}`} aria-label="Grid View">
                    <LayoutGrid size={20} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white'}`} aria-label="List View">
                    <List size={20} />
                </button>
            </div>
        </div>

      {loading && (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"}>
          {Array.from({ length: 8 }).map((_, i) => <MedicineCardSkeleton key={i} view={viewMode}/>)}
        </div>
      )}

      {error && (
        <div className="text-center py-10 px-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium">Error Loading Data</h3>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && paginatedMedicines.length > 0 && (
        <>
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"}>
                {paginatedMedicines.map(med => (
                    <MedicineCard key={med.id} medicine={med} view={viewMode} />
                ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      {!loading && !error && paginatedMedicines.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No Medicines Found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;