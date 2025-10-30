import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FamilyTree from './components/FamilyTree';
import Navbar from './components/Navbar';
import MemberModal from './components/MemberModal';
import Legend from './components/Legend';
import Gallery from './components/Gallery';
import familyData from './data/familyData.json';
import './index.css';

function App() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Color palette from the uploaded image
  const colors = {
    light: {
      primary: '#64592B',       // Olive Harvest (darker)
      secondary: '#9D9167',     // Olive Harvest (lighter)
      accent: '#743014',        // Spiced Wine
      background: '#E8D4A7',    // Golden Batter
      card: '#FFFFFF',
      text: '#442D1C',          // Couhide Cocoa
      textLight: '#64592B',
      border: '#9D9167'
    },
    dark: {
      primary: '#9D9167',       // Olive Harvest (lighter)
      secondary: '#64592B',     // Olive Harvest (darker)
      accent: '#E8D4A7',        // Golden Batter
      background: '#442D1C',    // Couhide Cocoa
      card: '#743014',          // Spiced Wine
      text: '#E8D4A7',          // Golden Batter
      textLight: '#9D9167',
      border: '#64592B'
    }
  };

  const currentColors = darkMode ? colors.dark : colors.light;

  const handleMemberSelect = useCallback((member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return familyData;
    const lowerSearch = searchTerm.toLowerCase();
    return familyData.filter(member => 
      member.name.toLowerCase().includes(lowerSearch) ||
      (member.bio && member.bio.toLowerCase().includes(lowerSearch)) ||
      (member.spouse && member.spouse.toLowerCase().includes(lowerSearch))
    );
  }, [searchTerm]);

  return (
    <div 
      className="min-h-screen transition-colors duration-300 font-['Expletus_Sans']"
      style={{ backgroundColor: currentColors.background }}
    >
      {/* Vintage Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 12 + 3,
              height: Math.random() * 12 + 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: darkMode ? 'rgba(232, 212, 167, 0.2)' : 'rgba(100, 89, 43, 0.2)',
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.2, 0.6, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <Navbar 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showLegend={showLegend}
        setShowLegend={setShowLegend}
        colors={currentColors}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            className="inline-block p-4 rounded-3xl mb-6 border-2"
            style={{
              borderColor: darkMode ? 'rgba(157, 145, 103, 0.3)' : 'rgba(100, 89, 43, 0.3)',
              backgroundColor: darkMode ? 'rgba(116, 48, 20, 0.2)' : 'rgba(232, 212, 167, 0.5)',
            }}
            whileHover={{ scale: 1.02 }}
          >
            <h1 
              className="text-5xl md:text-7xl font-bold mb-4"
              style={{ color: currentColors.text }}
            >
              Kodero's Lineage
            </h1>
          </motion.div>
          <p 
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed font-['Sedan']"
            style={{ color: currentColors.textLight }}
          >
            Explore the rich heritage and enduring connections of the Kodero family through generations of legacy
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl border-2 transition-all duration-300 font-['Sedan'] font-medium"
            style={{
              borderColor: currentColors.primary,
              backgroundColor: darkMode ? 'rgba(116, 48, 20, 0.3)' : 'rgba(157, 145, 103, 0.2)',
              color: currentColors.text,
            }}
            onClick={() => document.getElementById('family-tree').scrollIntoView({ behavior: 'smooth' })}
          >
            Explore the Family Tree
          </motion.button>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-8 shadow-2xl border-2"
          style={{
            borderColor: currentColors.border,
            backgroundColor: currentColors.card,
          }}
        >
          <div className="text-center mb-8">
            <div 
              className="w-16 h-1 mx-auto mb-4 rounded-full"
              style={{ backgroundColor: currentColors.primary }}
            />
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: currentColors.text }}
            >
              About the Kodero Legacy
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p 
                className="leading-relaxed mb-4 text-lg font-['Sedan']"
                style={{ color: currentColors.text }}
              >
                The Kodero lineage traces its ancestral roots to the heart of Migori County, 
                where Patriarch Augustine Kodero established a legacy of excellence, community 
                service, and enduring family values that continues to flourish through generations.
              </p>
              <p 
                className="leading-relaxed text-lg font-['Sedan']"
                style={{ color: currentColors.text }}
              >
                From distinguished educators and innovative technologists to visionary community 
                leaders, each family member carries forward our commitment to making meaningful 
                impacts while preserving our rich cultural heritage and traditions.
              </p>
            </div>
            <div 
              className="p-6 rounded-2xl text-center border"
              style={{
                borderColor: currentColors.border,
                backgroundColor: darkMode ? 'rgba(100, 89, 43, 0.2)' : 'rgba(232, 212, 167, 0.3)',
              }}
            >
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: currentColors.accent }}
              >
                5 Generations
              </div>
              <div 
                className="text-lg font-['Sedan']"
                style={{ color: currentColors.textLight }}
              >
                of Family Heritage
              </div>
              <div 
                className="text-sm mt-4 font-['Sedan'] italic"
                style={{ color: currentColors.textLight }}
              >
                Founded on Tradition • Built on Values • Growing Through Love
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Family Tree Section */}
      <section id="family-tree" className="py-12 px-4 min-h-screen">
        <div className="relative">
          <FamilyTree 
            data={filteredData}
            onMemberSelect={handleMemberSelect}
            searchTerm={searchTerm}
            darkMode={darkMode}
            colors={currentColors}
          />
          
          {/* Legend */}
          <AnimatePresence>
            {showLegend && (
              <Legend 
                darkMode={darkMode} 
                colors={currentColors} 
                onClose={() => setShowLegend(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4">
        <Gallery darkMode={darkMode} colors={currentColors} />
      </section>

      {/* Member Modal */}
      <AnimatePresence>
        {isModalOpen && selectedMember && (
          <MemberModal
            member={selectedMember}
            isOpen={isModalOpen}
            onClose={closeModal}
            darkMode={darkMode}
            colors={currentColors}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer 
        className="py-8 text-center border-t font-['Sedan']"
        style={{
          borderColor: currentColors.border,
          color: currentColors.textLight,
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-2">© {new Date().getFullYear()} Kodero's Lineage • Built with Honor & Tradition</p>
          <p className="text-sm italic">
            "Preserving our past, celebrating our present, building our future"
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;