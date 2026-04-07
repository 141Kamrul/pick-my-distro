import DistroFilter from '@/components/DistroFilter';

export const metadata = {
  title: 'Pick Your Linux Distro',
  description: 'Filter and find the perfect Linux distribution for your needs',
};

export default function FrontendPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Pick Your Linux Distro</h1>
          <p className="text-gray-600 mt-2">
            Find the perfect Linux distribution for your needs with our advanced filtering system.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DistroFilter />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            © 2026 Pick Your Linux Distro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
