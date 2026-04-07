'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Distro {
  id: string;
  name: string;
  description: string;
  image?: string;
  website?: string;
  attributes: Record<string, any>;
}

export default function DistroManagement() {
  const router = useRouter();
  const [distros, setDistros] = useState<Distro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    image: '',
  });

  useEffect(() => {
    fetchDistros();
  }, []);

  const fetchDistros = async () => {
    try {
      const response = await fetch('/api/distros');
      if (!response.ok) throw new Error('Failed to fetch distros');
      const data = await response.json();
      setDistros(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load distros');
      setLoading(false);
    }
  };

  const handleAddDistro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/distros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          attributes: {},
        }),
      });

      if (!response.ok) throw new Error('Failed to create distro');

      const newDistro = await response.json();
      setDistros([...distros, newDistro]);
      setFormData({ name: '', description: '', website: '', image: '' });
      setShowForm(false);
    } catch (err) {
      setError('Failed to add distro');
    }
  };

  const handleDeleteDistro = async (id: string) => {
    if (!confirm('Are you sure you want to delete this distro?')) return;

    try {
      const response = await fetch(`/api/distros?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete distro');

      setDistros(distros.filter(d => d.id !== id));
    } catch (err) {
      setError('Failed to delete distro');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading distros...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Linux Distros</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Distro'}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddDistro} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Add Distro
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {distros.map((distro) => (
          <div key={distro.id} className="bg-white rounded-lg shadow p-6">
            {distro.image && (
              <img
                src={distro.image}
                alt={distro.name}
                className="h-32 w-full object-cover rounded mb-4"
              />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{distro.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{distro.description}</p>
            {distro.website && (
              <a
                href={distro.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm"
              >
                Visit Website →
              </a>
            )}
            <button
              onClick={() => handleDeleteDistro(distro.id)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {distros.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No distros found. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}
