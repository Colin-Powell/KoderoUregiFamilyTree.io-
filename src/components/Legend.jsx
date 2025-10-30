import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Heart, Crown, Shield, TreePine, Scroll, MapPin, Clock, X } from 'lucide-react';

const Legend = ({ darkMode, colors, onClose }) => {
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

  const generations = [
    { number: 1, label: 'Founding Ancestors', icon: Crown, description: 'The original family founders' },
    { number: 2, label: 'Second Generation', icon: Users, description: 'Children of the founders' },
    { number: 3, label: 'Third Generation', icon: Heart, description: 'Grandchildren and their families' },
    { number: 4, label: 'Fourth Generation', icon: TreePine, description: 'Great-grandchildren lineage' },
    { number: 5, label: 'Fifth Generation', icon: Shield, description: 'Current youngest generation' },
  ];

  const symbols = [
    { 
      label: 'Has Children', 
      description: 'Family continues through generations',
      icon: Users,
      color: currentColors.primary
    },
    { 
      label: 'Married/Spouse', 
      description: 'Family unions and partnerships',
      icon: Heart,
      color: currentColors.accent
    },
    { 
      label: 'Family Connection', 
      description: 'Bloodlines and relationships',
      icon: TreePine,
      color: currentColors.secondary
    },
    { 
      label: 'Deceased Member', 
      description: 'Honored ancestors',
      icon: Clock,
      color: currentColors.textLight
    },
    { 
      label: 'Family Patriarch', 
      description: 'Head of the family',
      icon: Crown,
      color: currentColors.primary
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Legend Container */}
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        className="fixed lg:absolute top-0 lg:top-4 left-0 lg:left-4 h-screen lg:h-auto w-full lg:w-96 border-2 backdrop-blur-sm z-50 lg:z-40 overflow-y-auto"
        style={{
          backgroundColor: currentColors.card,
          borderColor: currentColors.border,
          color: currentColors.text
        }}
      >
        {/* Close Button - Mobile Only */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 border-2 z-10"
          style={{
            backgroundColor: currentColors.card,
            borderColor: currentColors.primary,
            color: currentColors.text
          }}
        >
          <X size={20} />
        </button>

        <div className="p-4 lg:p-6">
          {/* Header with Vintage Styling */}
          <div className="flex items-center justify-between mb-4 lg:mb-6 pb-4 border-b" style={{ borderColor: currentColors.border }}>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 lg:w-10 lg:h-10 border flex items-center justify-center"
                style={{
                  backgroundColor: currentColors.background,
                  borderColor: currentColors.primary
                }}
              >
                <BookOpen 
                  size={16} 
                  className="lg:w-5 lg:h-5"
                  style={{ color: currentColors.primary }}
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold font-['Expletus_Sans']" style={{ color: currentColors.text }}>
                  Family Tree Guide
                </h3>
                <p className="text-xs font-['Sedan'] hidden lg:block" style={{ color: currentColors.textLight }}>
                  Understanding Our Heritage
                </p>
              </div>
            </div>
          </div>

          {/* Generations Section */}
          <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
            <div className="flex items-center space-x-2 mb-2 lg:mb-3">
              <Crown size={14} className="lg:w-4 lg:h-4" style={{ color: currentColors.primary }} strokeWidth={1.5} />
              <h4 className="text-xs lg:text-sm uppercase tracking-wider font-['Expletus_Sans'] font-bold" style={{ color: currentColors.primary }}>
                Family Generations
              </h4>
            </div>
            <div className="grid grid-cols-1 gap-2 lg:gap-3">
              {generations.map((gen) => {
                const IconComponent = gen.icon;
                return (
                  <motion.div 
                    key={gen.number} 
                    className="flex items-center space-x-3 lg:space-x-4 p-2 lg:p-3 border transition-all duration-300"
                    style={{
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.border
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <div 
                      className="w-8 h-8 lg:w-10 lg:h-10 border-2 flex items-center justify-center text-xs font-bold relative flex-shrink-0"
                      style={{
                        backgroundColor: currentColors.primary,
                        borderColor: currentColors.secondary,
                        color: currentColors.card
                      }}
                    >
                      <span className="font-['Expletus_Sans'] text-xs">G{gen.number}</span>
                      <div 
                        className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 border flex items-center justify-center"
                        style={{
                          backgroundColor: currentColors.card,
                          borderColor: currentColors.primary
                        }}
                      >
                        <IconComponent size={8} className="lg:w-2.5 lg:h-2.5" style={{ color: currentColors.primary }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium font-['Expletus_Sans'] block truncate" style={{ color: currentColors.text }}>
                        {gen.label}
                      </span>
                      <span className="text-xs font-['Sedan'] block mt-1 line-clamp-2" style={{ color: currentColors.textLight }}>
                        {gen.description}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Symbols & Meanings */}
          <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
            <div className="flex items-center space-x-2 mb-2 lg:mb-3">
              <Shield size={14} className="lg:w-4 lg:h-4" style={{ color: currentColors.primary }} strokeWidth={1.5} />
              <h4 className="text-xs lg:text-sm uppercase tracking-wider font-['Expletus_Sans'] font-bold" style={{ color: currentColors.primary }}>
                Symbols & Meanings
              </h4>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {symbols.map((symbol, index) => {
                const IconComponent = symbol.icon;
                return (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 border"
                    style={{
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.border
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div 
                      className="w-6 h-6 lg:w-8 lg:h-8 border flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: symbol.color,
                        borderColor: currentColors.border
                      }}
                    >
                      <IconComponent size={12} className="lg:w-3.5 lg:h-3.5" style={{ color: currentColors.card }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium font-['Expletus_Sans'] block truncate" style={{ color: currentColors.text }}>
                        {symbol.label}
                      </span>
                      <span className="text-xs font-['Sedan'] block mt-1 line-clamp-2" style={{ color: currentColors.textLight }}>
                        {symbol.description}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Family Traditions */}
          <div 
            className="space-y-2 lg:space-y-3 p-3 lg:p-4 border mb-4 lg:mb-0"
            style={{
              backgroundColor: currentColors.background,
              borderColor: currentColors.border
            }}
          >
            <div className="flex items-center space-x-2">
              <Scroll size={14} className="lg:w-4 lg:h-4" style={{ color: currentColors.primary }} strokeWidth={1.5} />
              <h4 className="text-xs lg:text-sm uppercase tracking-wider font-['Expletus_Sans'] font-bold" style={{ color: currentColors.primary }}>
                Family Traditions
              </h4>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-['Sedan'] italic leading-relaxed" style={{ color: currentColors.text }}>
                "Each generation builds upon the legacy of the last, creating an enduring family tapestry woven with love, tradition, and shared memories."
              </p>
              <div className="flex items-center justify-between text-xs font-['Sedan']" style={{ color: currentColors.textLight }}>
                <span className="text-xs">← Older</span>
                <span className="text-xs">Newer →</span>
              </div>
            </div>
          </div>

          {/* Close Button for Mobile - Bottom */}
          <div className="lg:hidden mt-4 pt-4 border-t" style={{ borderColor: currentColors.border }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3 border-2 font-['Expletus_Sans'] font-medium"
              style={{
                backgroundColor: currentColors.primary,
                borderColor: currentColors.primary,
                color: currentColors.card
              }}
            >
              Close Guide
            </motion.button>
          </div>
        </div>

        {/* Vintage Bottom Border - Desktop Only */}
        <div 
          className="absolute bottom-0 left-6 right-6 h-1 hidden lg:block"
          style={{ backgroundColor: currentColors.primary }}
        />

        {/* Vintage Corner Decorations - Desktop Only */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 hidden lg:block" style={{ borderColor: currentColors.primary }} />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 hidden lg:block" style={{ borderColor: currentColors.primary }} />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 hidden lg:block" style={{ borderColor: currentColors.primary }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 hidden lg:block" style={{ borderColor: currentColors.primary }} />
      </motion.div>
    </>
  );
};

export default Legend;