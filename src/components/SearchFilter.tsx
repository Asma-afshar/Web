'use client';

import { useState, useEffect } from 'react';

interface SearchFilterProps {
  onSearch: (filters: {
    search: string;
    type: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
  }) => void;
  initialFilters?: {
    search: string;
    type: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
  };
}

export default function SearchFilter({ onSearch, initialFilters }: SearchFilterProps) {
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [type, setType] = useState(initialFilters?.type || 'all');
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || 10000000);
  const [bedrooms, setBedrooms] = useState(initialFilters?.bedrooms || 0);

  // Trigger search on filter change
  useEffect(() => {
    onSearch({ search, type, minPrice, maxPrice, bedrooms });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type, minPrice, maxPrice, bedrooms]);

  const handleClear = () => {
    setSearch('');
    setType('all');
    setMinPrice(0);
    setMaxPrice(10000000);
    setBedrooms(0);
  };

  const hasActiveFilters = search !== '' || type !== 'all' || minPrice !== 0 || maxPrice !== 10000000 || bedrooms !== 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Location
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="City, State, or Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Any</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
              <option value={5}>5+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={500000}>$500,000</option>
              <option value={750000}>$750,000</option>
              <option value={1000000}>$1,000,000</option>
              <option value={1500000}>$1,500,000</option>
              <option value={2500000}>$2,500,000</option>
              <option value={5000000}>$5,000,000</option>
              <option value={10000000}>$10,000,000+</option>
            </select>
          </div>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Location: {search}
                  <button
                    onClick={() => setSearch('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {type !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Type: {type.charAt(0).toUpperCase() + type.slice(1)}
                  <button
                    onClick={() => setType('all')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {bedrooms > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Bedrooms: {bedrooms}+
                  <button
                    onClick={() => setBedrooms(0)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {maxPrice < 10000000 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Max: ${(maxPrice / 1000000).toFixed(maxPrice >= 1000000 ? 1 : 0)}M
                  <button
                    onClick={() => setMaxPrice(10000000)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={handleClear}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

