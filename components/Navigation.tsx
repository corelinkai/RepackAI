'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Sparkles, LayoutDashboard, Home, User, LogIn, LogOut, Package } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center shadow-gold group-hover:shadow-xl transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold text-gray-900">
              Repack<span className="text-gold-500">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive('/')
                  ? 'text-gold-600 bg-gold-50 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-warm-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Get Appraisal</span>
            </Link>

            {session && (
              <Link
                href="/my-appraisals"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive('/my-appraisals')
                    ? 'text-gold-600 bg-gold-50 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-warm-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">My Appraisals</span>
              </Link>
            )}

            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'text-gold-600 bg-gold-50 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-warm-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Business</span>
            </Link>

            {/* Auth Buttons */}
            {status === 'loading' ? (
              <div className="w-20 h-9 bg-gray-100 rounded-xl animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-warm-50 rounded-xl">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center gap-2 gradient-luxury text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-luxury hover-lift"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
