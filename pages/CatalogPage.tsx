import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMedicines } from '../hooks/useMedicines';
import { useDebounce } from '../hooks/useDebounce';
import MedicineCard from '../components/MedicineCard';
import { MedicineCardSkeleton } from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { Search, X, List, LayoutGrid, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 24;

const safeString = (v: any) => (v ? String(v) : '');

const CatalogPage: React.FC = () => {
  const { medicines = [], loading, error, refetch } = useMedicines();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [manufacturerFilter, setManufacturerFilter] = useState('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Nice-to-have toggle: "Load more" vs classic pagination
  const [useLoadMore, setUseLoadMore] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // keyboard shortcut "/" to focus search (but not when typing into inputs)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && (document.activeElement?.tagName ?? '').toLowerCase() !== 'input') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // derive unique categories / manufacturers defensively
  const { uniqueCategories, uniqueManufacturers } = useMemo(() => {
    const categories = new Set<string>();
    const manufacturers = new Set<string>();
    for (const med of medicines) {
      const c = safeString(med.category).trim();
      const m = safeString(med.manufacturer).trim();
      if (c) categories.add(c);
      if (m) manufacturers.add(m);
    }
    return {
      uniqueCategories: Array.from(categories).sort((a, b) => a.localeCompare(b)),
      uniqueManufacturers: Array.from(manufacturers).sort((a, b) => a.localeCompare(b)),
    };
  }, [medicines]);

  // filter + sort
  const filteredAndSortedMedicines = useMemo(() => {
    const searchLower = debouncedSearchTerm.trim().toLowerCase();
    const filtered = medicines.filter((med) => {
      // guard for missing fields
      const name = safeString(med.name).toLowerCase();
      const generic = safeString(med.genericName).toLowerCase();
      const brand = safeString(med.brand).toLowerCase();

      const matchesSearch =
        !searchLower ||
        name.includes(searchLower) ||
        generic.includes(searchLower) ||
        brand.includes(searchLower);

      const matchesCategory = categoryFilter === 'all' || safeString(med.category) === categoryFilter;
      const matchesManufacturer = manufacturerFilter === 'all' || safeString(med.manufacturer) === manufacturerFilter;
      const matchesPrescription = !prescriptionFilter || med.prescription === true;

      return matchesSearch && matchesCategory && matchesManufacturer && matchesPrescription;
    });

    const sorted = filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc': return (a.price ?? 0) - (b.price ?? 0);
        case 'price-desc': return (b.price ?? 0) - (a.price ?? 0);
        case 'availability': return (b.stock ?? 0) - (a.stock ?? 0);
        case 'name-desc': return safeString(b.name).localeCompare(safeString(a.name));
        default: return safeString(a.name).localeCompare(safeString(b.name));
      }
    });

    return sorted;
  }, [medicines, debouncedSearchTerm, categoryFilter, manufacturerFilter, prescriptionFilter, sortOrder]);

  // pagination / load more handling
  useEffect(() => {
    // whenever filters/search/change, reset to first page or reset itemsToShow
    setCurrentPage(1);
    setItemsToShow(ITEMS_PER_PAGE);
  }, [debouncedSearchTerm, categoryFilter, manufacturerFilter, prescriptionFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedMedicines.length / ITEMS_PER_PAGE));
  const paginatedMedicines = useMemo(() => {
    if (useLoadMore) {
      return filteredAndSortedMedicines.slice(0, itemsToShow);
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedMedicines.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedMedicines, currentPage, useLoadMore, itemsToShow]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    setItemsToShow((s) => s + ITEMS_PER_PAGE);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setManufacturerFilter('all');
    setPrescriptionFilter(false);
    setSortOrder('name-asc');
    setCurrentPage(1);
    setItemsToShow(ITEMS_PER_PAGE);
  };

  // removable filter chips
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (searchTerm.trim()) chips.push({ key: 'q', label: `Search: "${searchTerm.trim()}"`, onRemove: () => setSearchTerm('') });
    if (categoryFilter !== 'all') chips.push({ key: 'category', label: `Category: ${categoryFilter}`, onRemove: () => setCategoryFilter('all') });
    if (manufacturerFilter !== 'all') chips.push({ key: 'manufacturer', label: `Manufacturer: ${manufacturerFilter}`, onRemove: () => setManufacturerFilter('all') });
    if (prescriptionFilter) chips.push({ key: 'prescription', label: 'Prescription only', onRemove: () => setPrescriptionFilter(false) });
    return chips;
  }, [searchTerm, categoryFilter, manufacturerFilter, prescriptionFilter]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Sticky filter bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 sticky top-16 z-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search by name, generic, or brand <span className="text-xs text-slate-400 ml-1"> (press “/” to focus)</span></label>
            <Search className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Paracetamol, Azithromycin..."
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary w-full"
              aria-label="Search medicines"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute right-2 top-9 p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">Manufacturer</label>
            <select
              id="manufacturer"
              value={manufacturerFilter}
              onChange={(e) => setManufacturerFilter(e.target.value)}
              className="w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              aria-label="Filter by manufacturer"
            >
              <option value="all">All Manufacturers</option>
              {uniqueManufacturers.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="prescription"
                checked={prescriptionFilter}
                onChange={(e) => setPrescriptionFilter(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="prescription" className="ml-2 block text-sm text-gray-900">Prescription only</label>
            </div>

            <button onClick={resetFilters} className="flex items-center text-sm text-primary hover:underline" aria-label="Reset filters">
              <X className="w-4 h-4 mr-1" /> Reset
            </button>

            <button
              onClick={() => refetch && refetch()}
              title="Refetch data"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 ml-1"
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              aria-label="Sort medicines"
            >
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="availability">Availability</option>
            </select>

            <div className="flex items-center space-x-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white'}`} aria-label="Grid View">
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white'}`} aria-label="List View">
                <List size={18} />
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useLoadMore} onChange={(e) => { setUseLoadMore(e.target.checked); setItemsToShow(ITEMS_PER_PAGE); }} className="h-4 w-4" />
              <span className="text-slate-600">Load more</span>
            </label>
          </div>
        </div>

        {/* Active filter chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {activeChips.length === 0 ? (
            <div className="text-sm text-slate-500">No active filters — showing everything.</div>
          ) : (
            activeChips.map((chip) => (
              <button
                key={chip.key}
                onClick={chip.onRemove}
                className="inline-flex items-center gap-2 text-sm bg-slate-100 px-3 py-1 rounded-full border border-slate-200"
              >
                <span>{chip.label}</span>
                <X className="w-3 h-3 text-slate-500" />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Result summary + view toggles */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600">
          Showing <strong>{paginatedMedicines.length}</strong> of <strong>{filteredAndSortedMedicines.length}</strong> results
          {debouncedSearchTerm ? <span className="ml-2 text-slate-400">for “{debouncedSearchTerm}”</span> : null}
        </p>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 mr-2">View</span>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white'}`} aria-label="Grid View">
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white'}`} aria-label="List View">
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Loading / Error / Empty / Results */}
      {loading && (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"}>
          {Array.from({ length: Math.min(8, ITEMS_PER_PAGE / 3) }).map((_, i) => <MedicineCardSkeleton key={i} view={viewMode} />)}
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-10 px-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium">Error Loading Data</h3>
          <p className="mt-1 text-sm">{String(error)}</p>
        </div>
      )}

      {!loading && !error && paginatedMedicines.length > 0 && (
        <>
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"}>
            {paginatedMedicines.map((med) => (
              <MedicineCard key={med.id} medicine={med} view={viewMode} searchHighlight={debouncedSearchTerm} />
            ))}
          </div>

          {/* Pagination or Load more */}
          <div className="mt-6 flex items-center justify-center">
            {useLoadMore ? (
              filteredAndSortedMedicines.length > itemsToShow ? (
                <button onClick={handleLoadMore} className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-md">
                  <Loader2 className="w-4 h-4 animate-spin" /> Load more
                </button>
              ) : (
                <div className="text-sm text-slate-500">End of results</div>
              )
            ) : (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        </>
      )}

      {!loading && !error && paginatedMedicines.length === 0 && (
        <div className="text-center py-10">
          <div className="mx-auto w-full max-w-md">
            <img src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1200&auto=format&fit=crop" alt="No results" className="rounded-lg mb-4" />
            <h3 className="text-lg font-medium mb-2">No medicines matched your filters</h3>
            <p className="text-sm text-slate-600 mb-4">Try clearing some filters or search terms, or try broader categories (e.g., "antibiotic").</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={resetFilters} className="px-4 py-2 bg-primary text-white rounded-md">Clear filters</button>
              <button onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setManufacturerFilter('all'); }} className="px-4 py-2 border rounded-md">Start over</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
