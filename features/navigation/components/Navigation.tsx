import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

/**
 * Presentational component for the top navigation bar.
 */
export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-400 font-bold' : 'text-gray-300 hover:text-white';
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-white tracking-tight">FanCompass AI</span>
            </div>
            <div className="ml-6 flex items-center space-x-4">
              <Link 
                href={ROUTES.HOME}
                className={`px-3 py-2 rounded-md text-sm min-h-[44px] min-w-[44px] flex items-center ${isActive(ROUTES.HOME)}`}
              >
                Chat
              </Link>
              <Link 
                href={ROUTES.STAFF_DASHBOARD}
                className={`px-3 py-2 rounded-md text-sm min-h-[44px] min-w-[44px] flex items-center ${isActive(ROUTES.STAFF_DASHBOARD)}`}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
