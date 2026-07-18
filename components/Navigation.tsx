'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { useAccessibilityMode } from '@/hooks/useAccessibilityMode';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAccessibilityMode, toggleAccessibilityMode, isHydrated } = useAccessibilityMode();

  return (
    <nav className="bg-black text-white border-b border-gray-800 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 font-bold text-xl">
            FanCompass
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href={ROUTES.HOME} className="px-3 py-2 rounded-md hover:bg-gray-800 min-h-[44px] flex items-center">Chat</Link>
            <Link href={ROUTES.STAFF_DASHBOARD} className="px-3 py-2 rounded-md hover:bg-gray-800 min-h-[44px] flex items-center">Staff</Link>
            {isHydrated && (
              <button 
                onClick={toggleAccessibilityMode}
                className="px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-400 min-h-[44px]"
                aria-pressed={isAccessibilityMode}
              >
                Access: {isAccessibilityMode ? 'ON' : 'OFF'}
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md hover:bg-gray-800 focus:outline-none"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-25" 
            aria-hidden="true" 
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-gray-900 text-white shadow-xl flex flex-col border-l border-gray-800">
            <div className="flex items-center justify-between px-4 pt-5 pb-2">
              <span className="font-bold text-xl">Menu</span>
              <button
                type="button"
                className="min-h-[44px] min-w-[44px] rounded-md text-gray-400 hover:text-gray-500 flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 px-2 flex flex-col space-y-1">
              <Link href={ROUTES.HOME} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 min-h-[44px]">Chat</Link>
              <Link href={ROUTES.STAFF_DASHBOARD} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 min-h-[44px]">Staff</Link>
              {isHydrated && (
                <button 
                  onClick={toggleAccessibilityMode}
                  className="mt-4 w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-gray-800 text-blue-400 hover:bg-gray-700 min-h-[44px]"
                  aria-pressed={isAccessibilityMode}
                >
                  Accessibility Mode: {isAccessibilityMode ? 'ON' : 'OFF'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
