'use client';

import { useEffect, useState } from 'react';

interface Distro {
  id: string;
  name: string;
  description: string;
  image?: string;
  website?: string;
  attributes: Record<string, any>;
}

interface FilterAttribute {
  id: string;
  name: string;
  type: 'select' | 'multi-select' | 'range' | 'boolean' | 'text';
  options?: string[];
  min?: number;
  max?: number;
}

export default function DistroFilter() {
  const [distros, setDistros] = useState<Distro[]>([]);
  const [attributes, setAttributes] = useState<FilterAttribute[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filteredDistros, setFilteredDistros] = useState<Distro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, distros]);

  const fetchData = async () => {
    try {
      const [distrosRes, attributesRes] = await Promise.all([
        fetch('/api/distros'),
        fetch('/api/distros/attributes'),
      ]);

      if (!distrosRes.ok || !attributesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const distrosData = await distrosRes.json();
      const attributesData = await attributesRes.json();

      setDistros(distrosData);
      setAttributes(attributesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = distros;

    attributes.forEach((attr) => {
      const filterValue = filters[attr.id];

      if (!filterValue) return;

      results = results.filter((distro) => {
        const distroValue = distro.attributes[attr.id];

        switch (attr.type) {
          case 'select':
            return distroValue === filterValue;

          case 'multi-select':
            if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
            if (!Array.isArray(distroValue)) return false;
            return filterValue.some((f) => distroValue.includes(f));

          case 'range':
            const [min, max] = filterValue;
            return distroValue >= min && distroValue <= max;

          case 'boolean':
            return distroValue === filterValue;

          case 'text':
            return String(distroValue)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());

          default:
            return true;
        }
      });
    });

    setFilteredDistros(results);
  };

  const handleFilterChange = (attrId: string, value: any) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        delete updated[attrId];
      } else {
        updated[attrId] = value;
      }
      return updated;
    });
  };

  const handleMultiSelectChange = (attrId: string, option: string) => {
    setFilters((prev) => {
      const current = prev[attrId] || [];
      const updated = current.includes(option)
        ? current.filter((o: string) => o !== option)
        : [...current, option];
      return { ...prev, [attrId]: updated };
    });
  };

  const resetFilters = () => {
    setFilters({});
  };

  if (loading) {
    return <div className="text-center py-12">Loading distros...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
      {/* Filter Panel */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-6">
            {attributes.map((attr) => (
              <div key={attr.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {attr.name}
                </label>

                {/* Select */}
                {attr.type === 'select' && (
                  <select
                    value={filters[attr.id] || ''}
                    onChange={(e) => handleFilterChange(attr.id, e.target.value || null)}
                    className="w-full rounded-md border-gray-300 border px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="">All</option>
                    {attr.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {/* Multi-select */}
                {attr.type === 'multi-select' && (
                  <div className="space-y-2">
                    {attr.options?.map((opt) => (
                      <label key={opt} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(filters[attr.id] || []).includes(opt)}
                          onChange={() => handleMultiSelectChange(attr.id, opt)}
                          className="rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Range */}
                {attr.type === 'range' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={attr.min}
                        max={attr.max}
                        value={(filters[attr.id]?.[0] ?? attr.min) || ''}
                        onChange={(e) => {
                          const min = parseInt(e.target.value) || attr.min;
                          const max = (filters[attr.id]?.[1] ?? attr.max) || attr.max;
                          handleFilterChange(attr.id, [min, max]);
                        }}
                        placeholder="Min"
                        className="w-1/2 rounded-md border-gray-300 border px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        min={attr.min}
                        max={attr.max}
                        value={(filters[attr.id]?.[1] ?? attr.max) || ''}
                        onChange={(e) => {
                          const min = (filters[attr.id]?.[0] ?? attr.min) || attr.min;
                          const max = parseInt(e.target.value) || attr.max;
                          handleFilterChange(attr.id, [min, max]);
                        }}
                        placeholder="Max"
                        className="w-1/2 rounded-md border-gray-300 border px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Boolean */}
                {attr.type === 'boolean' && (
                  <div className="space-y-2">
                    {[true, false].map((value) => (
                      <label key={String(value)} className="flex items-center">
                        <input
                          type="radio"
                          name={attr.id}
                          checked={filters[attr.id] === value}
                          onChange={() => handleFilterChange(attr.id, value)}
                          className="rounded-full border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {value ? 'Yes' : 'No'}
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={attr.id}
                        checked={!(attr.id in filters)}
                        onChange={() => handleFilterChange(attr.id, null)}
                        className="rounded-full border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Any</span>
                    </label>
                  </div>
                )}

                {/* Text */}
                {attr.type === 'text' && (
                  <input
                    type="text"
                    value={filters[attr.id] || ''}
                    onChange={(e) => handleFilterChange(attr.id, e.target.value || null)}
                    placeholder="Search..."
                    className="w-full rounded-md border-gray-300 border px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="md:col-span-3">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Linux Distributions {filteredDistros.length > 0 && `(${filteredDistros.length})`}
            </h2>
          </div>

          {filteredDistros.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                No distributions match your filters. Try adjusting them!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredDistros.map((distro) => (
                <div
                  key={distro.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex gap-6">
                    {distro.image && (
                      <img
                        src={distro.image}
                        alt={distro.name}
                        className="h-32 w-32 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {distro.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{distro.description}</p>

                      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                        {attributes.map((attr) => {
                          const value = distro.attributes[attr.id];
                          if (!value) return null;

                          return (
                            <div key={attr.id}>
                              <span className="font-medium text-gray-700">{attr.name}:</span>{' '}
                              <span className="text-gray-600">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {distro.website && (
                        <a
                          href={distro.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
