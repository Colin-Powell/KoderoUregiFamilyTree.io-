import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Search, 
  BookOpen,
  Users,
  Shield,
  TreePine,
  Crown,
  Scroll,
  X,
  Menu
} from 'lucide-react';

const Navbar = ({ 
  darkMode, 
  setDarkMode, 
  searchTerm, 
  setSearchTerm, 
  showLegend, 
  setShowLegend,
  colors 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Default colors fallback
  const defaultColors = {
    light: {
      primary: '#64592B',
      secondary: '#9D9167',
      accent: '#743014',
      background: '#E8D4A7',
      card: '#FFFFFF',
      text: '#442D1C',
      textLight: '#64592B',
      border: '#9D9167'
    },
    dark: {
      primary: '#9D9167',
      secondary: '#64592B',
      accent: '#E8D4A7',
      background: '#442D1C',
      card: '#743014',
      text: '#E8D4A7',
      textLight: '#9D9167',
      border: '#64592B'
    }
  };

  const currentColors = colors || (darkMode ? defaultColors.dark : defaultColors.light);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b-2"
      style={{
        backgroundColor: `${currentColors.card}99`,
        borderColor: currentColors.border
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 flex-shrink-0"
          >
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 border-2 flex items-center justify-center relative"
              style={{
                backgroundColor: currentColors.primary,
                borderColor: currentColors.secondary
              }}
            >
              <Crown 
                size={20} 
                className="sm:w-6 sm:h-6"
                style={{ color: currentColors.card }}
                strokeWidth={1.5}
              />
              <Scroll 
                size={10} 
                className="sm:w-3 sm:h-3 absolute -bottom-1 -right-1"
                style={{ color: currentColors.card }}
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col">
              <span 
                className="text-xl sm:text-2xl font-bold font-['Expletus_Sans'] leading-tight"
                style={{ color: currentColors.text }}
              >
                Kodero's Lineage
              </span>
              <span 
                className="text-xs font-medium flex items-center gap-1 font-['Sedan'] hidden sm:flex"
                style={{ color: currentColors.textLight }}
              >
                <TreePine size={10} className="inline" />
                Family Heritage & Legacy
                <Shield size={10} className="inline" />
              </span>
            </div>
          </motion.div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <div 
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                style={{ color: currentColors.primary }}
              >
                <Search size={20} strokeWidth={1.5} />
              </div>
              <input
                type="text"
                placeholder="Search family members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 border-2 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-1 font-['Sedan']"
                style={{
                  backgroundColor: currentColors.background,
                  borderColor: currentColors.border,
                  color: currentColors.text
                }}
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 border flex items-center justify-center text-xs font-bold font-['Expletus_Sans']"
                  style={{
                    backgroundColor: currentColors.primary,
                    borderColor: currentColors.secondary,
                    color: currentColors.card
                  }}
                >
                  <X size={14} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Family Tree Guide Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLegend(!showLegend)}
              className="p-2 lg:p-3 border-2 transition-all duration-300 flex items-center gap-2 font-['Expletus_Sans']"
              style={{
                backgroundColor: showLegend ? currentColors.primary : currentColors.background,
                borderColor: currentColors.border,
                color: showLegend ? currentColors.card : currentColors.text
              }}
              title="Toggle Family Guide"
            >
              <div className="relative">
                <BookOpen size={18} strokeWidth={1.5} />
                <Shield 
                  size={10} 
                  className="absolute -top-1 -right-1"
                  strokeWidth={3}
                />
              </div>
              <span className="text-sm font-medium hidden lg:inline">Guide</span>
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 lg:p-3 border-2 transition-all duration-300 flex items-center gap-2 font-['Expletus_Sans']"
              style={{
                backgroundColor: currentColors.background,
                borderColor: currentColors.border,
                color: currentColors.text
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <>
                  <div className="relative">
                    <Sun size={18} strokeWidth={1.5} />
                    <Scroll 
                      size={8} 
                      className="absolute -bottom-1 -right-1"
                      style={{ color: currentColors.primary }}
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-sm font-medium hidden lg:inline">Light</span>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Moon size={18} strokeWidth={1.5} />
                    <Scroll 
                      size={8} 
                      className="absolute -bottom-1 -right-1"
                      style={{ color: currentColors.primary }}
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-sm font-medium hidden lg:inline">Dark</span>
                </>
              )}
            </motion.button>

            {/* Family Motto - Hidden on smaller screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden xl:flex items-center gap-2 ml-2"
            >
              <div 
                className="w-px h-6 mr-2"
                style={{ backgroundColor: currentColors.border }}
              />
              <Shield 
                size={16} 
                style={{ color: currentColors.primary }}
                strokeWidth={1.5}
              />
              <div 
                className="text-sm italic font-['Sedan']"
                style={{ color: currentColors.textLight }}
              >
                "Strength in Heritage"
              </div>
              <Users 
                size={16} 
                style={{ color: currentColors.primary }}
                strokeWidth={1.5}
              />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Search Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border-2"
              style={{
                backgroundColor: currentColors.background,
                borderColor: currentColors.border,
                color: currentColors.text
              }}
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Search and Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t-2 pb-4"
              style={{ borderColor: currentColors.border }}
            >
              {/* Mobile Search */}
              <div className="pt-4">
                <div className="relative">
                  <div 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: currentColors.primary }}
                  >
                    <Search size={18} strokeWidth={1.5} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search family members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-1 font-['Sedan']"
                    style={{
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.border,
                      color: currentColors.text
                    }}
                  />
                  {searchTerm && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 border flex items-center justify-center text-xs font-bold font-['Expletus_Sans']"
                      style={{
                        backgroundColor: currentColors.primary,
                        borderColor: currentColors.secondary,
                        color: currentColors.card
                      }}
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="flex items-center justify-between space-x-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowLegend(!showLegend);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 p-3 border-2 transition-all duration-300 flex items-center justify-center gap-2 font-['Expletus_Sans']"
                  style={{
                    backgroundColor: showLegend ? currentColors.primary : currentColors.background,
                    borderColor: currentColors.border,
                    color: showLegend ? currentColors.card : currentColors.text
                  }}
                >
                  <BookOpen size={18} strokeWidth={1.5} />
                  <span className="text-sm font-medium">Guide</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setDarkMode(!darkMode);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 p-3 border-2 transition-all duration-300 flex items-center justify-center gap-2 font-['Expletus_Sans']"
                  style={{
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border,
                    color: currentColors.text
                  }}
                >
                  {darkMode ? (
                    <>
                      <Sun size={18} strokeWidth={1.5} />
                      <span className="text-sm font-medium">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon size={18} strokeWidth={1.5} />
                      <span className="text-sm font-medium">Dark</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Mobile Family Motto */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t"
                style={{ borderColor: currentColors.border }}
              >
                <Shield 
                  size={16} 
                  style={{ color: currentColors.primary }}
                  strokeWidth={1.5}
                />
                <div 
                  className="text-sm italic font-['Sedan'] text-center"
                  style={{ color: currentColors.textLight }}
                >
                  "Strength in Heritage"
                </div>
                <Users 
                  size={16} 
                  style={{ color: currentColors.primary }}
                  strokeWidth={1.5}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vintage Border Accent */}
        <div className="relative h-2 overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: currentColors.primary }}
          />
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="flex h-full">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r"
                  style={{ borderColor: currentColors.secondary }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;