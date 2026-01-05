'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BannerSlider from '@/components/BannerSlider';
import SearchFilter from '@/components/SearchFilter';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/properties';
import { Property } from '@/types/property';

export default function Home() {
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: 0,
  });

  const handleSearch = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((property: Property) => {
      const matchesSearch =
        filters.search === '' ||
        property.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.state.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType = filters.type === 'all' || property.type === filters.type;
      const matchesPrice = property.price >= filters.minPrice && property.price <= filters.maxPrice;
      const matchesBedrooms = filters.bedrooms === 0 || property.bedrooms >= filters.bedrooms;

      return matchesSearch && matchesType && matchesPrice && matchesBedrooms;
    });
  }, [filters]);

  const featuredProperties = useMemo(() => {
    return properties.filter((p: Property) => p.featured);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BannerSlider />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section id="properties" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked selections of the finest properties
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Properties
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our complete collection of properties
            </p>
          </div>
          
          <SearchFilter onSearch={handleSearch} initialFilters={filters} />
          
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredProperties.length}</span> 
              {filteredProperties.length === 1 ? ' property' : ' properties'}
              {filters.search || filters.type !== 'all' || filters.bedrooms > 0 || filters.maxPrice < 10000000 ? ' matching your filters' : ''}
            </p>
          </div>
          
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium mb-2">No properties found</p>
              <p className="text-gray-500">Try adjusting your search filters to see more results.</p>
            </div>
          )}
        </section>

        <section id="about" className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">About Us</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              We are a leading real estate platform dedicated to helping you find your perfect home.
              With thousands of listings across the country, we make it easy to search, compare, and
              discover properties that match your lifestyle and budget.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our team of experienced real estate professionals is here to guide you through every
              step of your property journey, from initial search to closing the deal.
            </p>
          </div>
        </section>

        <section id="contact" className="bg-blue-600 rounded-xl shadow-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-blue-100 text-lg mb-6">
            Get in touch with our team today and let us help you find the perfect property.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </Link>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">RE</span>
                </div>
                <span className="text-xl font-bold">RealEstate</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect property.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/#properties" className="hover:text-white transition-colors">Properties</a></li>
                <li><a href="/#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Buy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sell</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Invest</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@realestate.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Main St, City, State</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RealEstate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
