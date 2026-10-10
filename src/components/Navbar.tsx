import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'diagnosis' | 'conservatory' | 'library';
  setActiveTab: (tab: 'diagnosis' | 'conservatory' | 'library') => void;
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onReset: () => void;
  onOpenNotifications: () => void;
  hasUnreadNotifications: boolean;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenLogin,
  onLogout,
  onReset,
  onOpenNotifications,
  hasUnreadNotifications,
  onOpenHelp,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/85 border-b border-primary/10 sticky top-0 z-40 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(20,66,38,0.06)] relative">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1180px] mx-auto h-16">
        {/* Brand Logo Anchor */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setActiveTab('diagnosis');
              setMobileMenuOpen(false);
            }}
            className="text-left font-headline-md text-primary flex items-center gap-2 tracking-tight group cursor-pointer focus:outline-none"
          >
            <span className="w-8 h-8 rounded-lg bg-[#2d5a3c] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">potted_plant</span>
            </span>
            <span className="font-bold text-xl text-[#144226]">Dr. Leafy</span>
          </button>

          {/* Semantic Desktop Navigation Cluster */}
          <nav className="hidden md:flex items-center gap-6 pt-1">
            <button
              onClick={() => setActiveTab('diagnosis')}
              className={`pb-1 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'diagnosis'
                  ? 'text-[#144226] border-b-2 border-[#144226]'
                  : 'text-[#414942] hover:text-[#144226]'
              }`}
            >
              Diagnosis
            </button>
            <button
              onClick={() => setActiveTab('conservatory')}
              className={`pb-1 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'conservatory'
                  ? 'text-[#144226] border-b-2 border-[#144226]'
                  : 'text-[#414942] hover:text-[#144226]'
              }`}
            >
              My Conservatory
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`pb-1 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'library'
                  ? 'text-[#144226] border-b-2 border-[#144226]'
                  : 'text-[#414942] hover:text-[#144226]'
              }`}
            >
              <span>Botanical Library</span>
              <span className="text-[10px] bg-[#EAF4EE] text-[#144226] px-1.5 py-0.2 rounded font-bold border border-[#144226]/10">
                Google Search
              </span>
            </button>
          </nav>
        </div>

        {/* Trailing Action Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Reset Active Case Button */}
          {activeTab === 'diagnosis' && (
            <button
              onClick={onReset}
              className="transition-all duration-200 active:scale-95 hover:bg-[#EDF4F7] text-[#144226] px-3 py-1.5 rounded-lg border border-[#144226]/15 text-xs font-semibold flex items-center gap-1.5 bg-white/90 shadow-sm cursor-pointer"
              title="Reset current patient progress & checklist"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            aria-label="Help and guidance"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#414942] hover:bg-white/80 hover:text-[#144226] transition-colors bg-white/50 border border-[#144226]/10 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#414942] hover:bg-white/80 hover:text-[#144226] transition-colors bg-white/50 border border-[#144226]/10 relative cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {hasUnreadNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D97746] animate-pulse"></span>
            )}
          </button>

          {/* User Profile Avatar / Sign In */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-9 h-9 rounded-full border-2 border-[#144226]/20 overflow-hidden ml-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#144226]/30 cursor-pointer"
                title={`${user.name} (${user.role})`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-lg bg-[#2d5a3c] hover:bg-[#144226] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">account_circle</span>
                <span>Sign In</span>
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && user && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-[#144226]/15 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-[#E8ECE9]">
                  <p className="text-sm font-bold text-[#144226]">{user.name}</p>
                  <p className="text-xs text-[#414942] truncate">{user.email || user.phone}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-[#376847] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#144226]/10">
                    {user.role}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => setActiveTab('conservatory')}
                    className="w-full text-left px-4 py-2 text-xs text-[#414942] hover:bg-[#EDF4F7] hover:text-[#144226] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">potted_plant</span>
                    <span>My Conservatory ({user.activePatientsCount} active)</span>
                  </button>
                  <button
                    onClick={onOpenLogin}
                    className="w-full text-left px-4 py-2 text-xs text-[#414942] hover:bg-[#EDF4F7] hover:text-[#144226] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">switch_account</span>
                    <span>Switch Account</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#414942] hover:bg-white/80 transition-colors bg-white/50 border border-[#144226]/10 cursor-pointer ml-1"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#144226]/10 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setActiveTab('diagnosis');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'diagnosis'
                ? 'bg-[#EAF4EE] text-[#144226] border border-[#144226]/15'
                : 'text-[#414942] hover:bg-[#EDF4F7]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">stethoscope</span>
            <span>Diagnosis & Recovery Room</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('conservatory');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'conservatory'
                ? 'bg-[#EAF4EE] text-[#144226] border border-[#144226]/15'
                : 'text-[#414942] hover:bg-[#EDF4F7]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">potted_plant</span>
            <span>My Conservatory</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('library');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'library'
                ? 'bg-[#EAF4EE] text-[#144226] border border-[#144226]/15'
                : 'text-[#414942] hover:bg-[#EDF4F7]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Botanical Library</span>
            </div>
            <span className="text-[10px] bg-[#EAF4EE] text-[#144226] px-1.5 py-0.5 rounded font-bold border border-[#144226]/10">
              Google Search
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
