import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Heart, Calendar, Clock, MapPin, Crown, Shield, Scroll, Trophy, User } from 'lucide-react';

const MemberModal = ({ member, isOpen, onClose, darkMode, colors }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  const handleSpouseImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  if (!member) return null;

  // Check if this is a family unit node
  const isFamilyUnit = member.nodeType === 'family-unit';
  const spouses = member.spouses || [];
  const spouse1 = spouses[0] || {};
  const spouse2 = spouses[1] || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: `${currentColors.background}99` }}
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-4xl mx-4 border-2 backdrop-blur-sm max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: currentColors.card,
          borderColor: currentColors.border,
          color: currentColors.text
        }}
      >
        <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2" style={{ borderColor: currentColors.primary }} />
        <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2" style={{ borderColor: currentColors.primary }} />
        <div className="absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2" style={{ borderColor: currentColors.primary }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2" style={{ borderColor: currentColors.primary }} />

        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 sm:p-2 transition-all duration-300 z-10"
          style={{
            backgroundColor: currentColors.card,
            border: `2px solid ${currentColors.primary}`,
            color: currentColors.text
          }}
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="p-4 sm:p-6 lg:p-8">
          {isFamilyUnit ? (
            // Family Unit Layout (Couple View) - IMPROVED RESPONSIVENESS
            <div className="text-center mb-6 sm:mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 font-['Expletus_Sans']"
                style={{ color: currentColors.text }}
              >
                Family Union
              </motion.h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
                {/* Spouse 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center flex-1 max-w-[200px] sm:max-w-none"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-2 relative mx-auto mb-3 sm:mb-4"
                    style={{
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.primary
                    }}
                  >
                    {spouse1.profileImage && (
                      <img
                        src={spouse1.profileImage}
                        alt={spouse1.name}
                        className="w-full h-full object-cover"
                        onError={handleSpouseImageError}
                      />
                    )}
                    <div 
                      className={`w-full h-full flex items-center justify-center border ${
                        spouse1.profileImage ? 'hidden' : 'flex'
                      }`}
                      style={{
                        backgroundColor: currentColors.secondary,
                        borderColor: currentColors.border
                      }}
                    >
                      <User size={32} className="sm:w-12 sm:h-12 lg:w-16 lg:h-16" style={{ color: currentColors.card }} />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold font-['Expletus_Sans'] mb-1 sm:mb-2 break-words">
                    {spouse1.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-['Sedan'] mb-2" style={{ color: currentColors.textLight }}>
                    {spouse1.role || 'Family Member'}
                  </p>
                  {spouse1.birthDate && (
                    <p className="text-xs font-['Sedan']" style={{ color: currentColors.textLight }}>
                      Born: {formatDate(spouse1.birthDate)}
                    </p>
                  )}
                  {spouse1.bio && spouse1.bio !== 'Family Member' && (
                    <p className="text-xs mt-2 font-['Sedan']" style={{ color: currentColors.textLight }}>
                      {spouse1.bio}
                    </p>
                  )}
                </motion.div>

                {/* Heart Icon - Now responsive and shows on mobile */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="my-2 sm:my-0"
                >
                  <Heart 
                    size={32} 
                    className="sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                    style={{ color: currentColors.accent, fill: currentColors.accent }}
                  />
                </motion.div>

                {/* Spouse 2 */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center flex-1 max-w-[200px] sm:max-w-none"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-2 relative mx-auto mb-3 sm:mb-4"
                    style={{
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.primary
                    }}
                  >
                    {spouse2.profileImage && (
                      <img
                        src={spouse2.profileImage}
                        alt={spouse2.name}
                        className="w-full h-full object-cover"
                        onError={handleSpouseImageError}
                      />
                    )}
                    <div 
                      className={`w-full h-full flex items-center justify-center border ${
                        spouse2.profileImage ? 'hidden' : 'flex'
                      }`}
                      style={{
                        backgroundColor: currentColors.secondary,
                        borderColor: currentColors.border
                      }}
                    >
                      <User size={32} className="sm:w-12 sm:h-12 lg:w-16 lg:h-16" style={{ color: currentColors.card }} />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold font-['Expletus_Sans'] mb-1 sm:mb-2 break-words">
                    {spouse2.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-['Sedan'] mb-2" style={{ color: currentColors.textLight }}>
                    {spouse2.role || 'Family Member'}
                  </p>
                  {spouse2.birthDate && (
                    <p className="text-xs font-['Sedan']" style={{ color: currentColors.textLight }}>
                      Born: {formatDate(spouse2.birthDate)}
                    </p>
                  )}
                  {spouse2.bio && spouse2.bio !== 'Family Member' && (
                    <p className="text-xs mt-2 font-['Sedan']" style={{ color: currentColors.textLight }}>
                      {spouse2.bio}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Family Unit Bio */}
              {member.bio && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 sm:mt-8 p-4 sm:p-6 border-2"
                  style={{
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border
                  }}
                >
                  <p className="leading-relaxed text-sm sm:text-base lg:text-lg font-['Sedan'] text-center">
                    {member.bio}
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            // Individual Member Layout (unchanged but made more responsive)
            <>
              {/* Header with Profile Image */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div 
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-2 relative"
                    style={{
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.primary
                    }}
                  >
                    {member.profileImage && (
                      <img
                        src={member.profileImage}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    )}
                    <div 
                      className={`w-full h-full flex items-center justify-center border ${
                        member.profileImage ? 'hidden' : 'flex'
                      }`}
                      style={{
                        backgroundColor: currentColors.secondary,
                        borderColor: currentColors.border
                      }}
                    >
                      <User size={32} className="sm:w-12 sm:h-12 lg:w-16 lg:h-16" style={{ color: currentColors.card }} />
                    </div>
                  </div>
                  
                  <div 
                    className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 border-2 flex items-center justify-center text-xs sm:text-sm font-bold font-['Expletus_Sans']"
                    style={{
                      backgroundColor: currentColors.primary,
                      borderColor: currentColors.secondary,
                      color: currentColors.card
                    }}
                  >
                    {member.generation || 1}
                  </div>

                  {member.name === 'Augustine Kodero' && (
                    <div 
                      className="absolute -top-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center"
                      style={{ color: currentColors.accent }}
                    >
                      <Crown size={16} className="sm:w-5 sm:h-5" fill="currentColor" />
                    </div>
                  )}
                </motion.div>
                
                <div className="text-center sm:text-left flex-1">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 font-['Expletus_Sans'] break-words"
                    style={{ color: currentColors.text }}
                  >
                    {member.name}
                  </motion.h2>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center sm:justify-start gap-2"
                  >
                    <Heart size={16} className="sm:w-5 sm:h-5" style={{ color: currentColors.accent }} />
                    <span 
                      className="text-base sm:text-lg font-['Sedan']"
                      style={{ color: currentColors.textLight }}
                    >
                      {member.spouse && member.spouse !== '—' ? `Spouse: ${member.spouse}` : 'No spouse'}
                    </span>
                  </motion.div>

                  {/* Additional images gallery */}
                  {member.additionalImages && member.additionalImages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex gap-2 mt-2 sm:mt-3 justify-center sm:justify-start"
                    >
                      {member.additionalImages.slice(0, 3).map((image, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 border"
                          style={{ borderColor: currentColors.border }}
                        >
                          <img
                            src={image}
                            alt={`${member.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {member.additionalImages.length > 3 && (
                        <div 
                          className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 border flex items-center justify-center text-xs"
                          style={{ 
                            borderColor: currentColors.border,
                            backgroundColor: currentColors.background,
                            color: currentColors.text
                          }}
                        >
                          +{member.additionalImages.length - 3}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Vintage Details Grid */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8"
              >
                {/* Birth Date */}
                <div 
                  className="p-3 sm:p-4 border-2 flex items-center gap-3 sm:gap-4"
                  style={{
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border
                  }}
                >
                  <div 
                    className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 flex items-center justify-center border"
                    style={{
                      backgroundColor: currentColors.primary,
                      borderColor: currentColors.secondary
                    }}
                  >
                    <Calendar size={18} className="sm:w-5 sm:h-5" style={{ color: currentColors.card }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1 font-['Expletus_Sans']">Birth Date</h3>
                    <p className="font-['Sedan'] text-xs sm:text-sm" style={{ color: currentColors.textLight }}>
                      {formatDate(member.birthDate)}
                    </p>
                  </div>
                </div>
                
                {/* Status */}
                <div 
                  className="p-3 sm:p-4 border-2 flex items-center gap-3 sm:gap-4"
                  style={{
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border
                  }}
                >
                  <div 
                    className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 flex items-center justify-center border"
                    style={{
                      backgroundColor: member.deathDate ? currentColors.textLight : currentColors.accent,
                      borderColor: currentColors.secondary
                    }}
                  >
                    <Clock size={18} className="sm:w-5 sm:h-5" style={{ color: currentColors.card }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1 font-['Expletus_Sans']">Status</h3>
                    <p className="font-['Sedan'] text-xs sm:text-sm" style={{ color: currentColors.textLight }}>
                      {member.deathDate ? 'Deceased' : 'Living'}
                    </p>
                    {member.deathDate && (
                      <p className="text-xs mt-1 font-['Sedan']" style={{ color: currentColors.textLight }}>
                        {formatDate(member.deathDate)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Biography Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 sm:mb-8"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Scroll size={20} className="sm:w-6 sm:h-6" style={{ color: currentColors.primary }} />
                  <h3 className="font-semibold text-lg sm:text-xl font-['Expletus_Sans']">Family Story</h3>
                </div>
                <div 
                  className="p-4 sm:p-5 lg:p-6 border-2"
                  style={{
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border
                  }}
                >
                  <p 
                    className="leading-relaxed text-sm sm:text-base lg:text-lg font-['Sedan']"
                    style={{ color: currentColors.text }}
                  >
                    {member.bio || `The story of ${member.name.split(' ')[0]}, a cherished member of the Kodero family lineage, whose life and legacy continue to inspire generations.`}
                  </p>
                </div>
              </motion.div>
            </>
          )}

          {/* Footer Decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t text-center"
            style={{ borderColor: currentColors.border }}
          >
            <p className="text-xs sm:text-sm font-['Sedan'] italic" style={{ color: currentColors.textLight }}>
              "Preserving our heritage, honoring our ancestors"
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberModal;