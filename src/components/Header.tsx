import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RE</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">RealEstate</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/#properties" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Properties
            </Link>
            <Link href="/#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
            <Link href="/admin/queries" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Admin
            </Link>
          </nav>
          <Link
            href="/list-property"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            List Property
          </Link>
        </div>
      </div>
    </header>
  );
}

