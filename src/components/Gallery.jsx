import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart } from 'lucide-react';

const Gallery = ({ darkMode, colors }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample gallery images with organized file naming
  const galleryImages = [
    // Reunions Category - 17 images
    ...Array.from({ length: 17 }, (_, i) => ({
      id: i + 1,
      src: `/images/re${i + 1}.jpg`,
      title: `Family Reunion ${2023 + Math.floor(i / 4)}`,
      description: "Annual family gathering at the ancestral home",
      date: `${["June", "December"][i % 2]} ${15 + (i % 10)}, ${2023 + Math.floor(i / 4)}`,
      category: "Reunions"
    })),

    // Portraits Category - 18 images
    ...Array.from({ length: 20 }, (_, i) => ({
      id: 18 + i + 1,
      src: `/images/p${i + 1}.jpg`,
      title: "Generational Portrait",
      description: "Family member portrait",
      date: "Various dates",
      category: "Portraits"
    })),

    // Travel Category - 18 images
    ...Array.from({ length: 18 }, (_, i) => ({
      id: 36 + i + 1,
      src: `/images/t${i + 1}.jpg`,
      title: `Family Travel ${i + 1}`,
      description: "Family travel and adventure memories",
      date: "Various dates",
      category: "Travel"
    })),

    // Weddings Category - 18 images
    ...Array.from({ length: 3 }, (_, i) => ({
      id: 54 + i + 1,
      src: `/images/w${i + 1}.jpg`,
      title: `Family Wedding ${i + 1}`,
      description: "Beautiful wedding ceremonies and celebrations",
      date: `${["April", "June", "August", "November"][i % 4]} ${2018 + (i % 5)}, ${10 + (i % 20)}`,
      category: "Weddings"
    })),

    // Events Category - 18 images
    ...Array.from({ length: 7 }, (_, i) => ({
      id: 72 + i + 1,
      src: `/images/e${i + 1}.jpg`,
      title: `Family Event ${i + 1}`,
      description: "Special family events and gatherings",
      date: `${["February", "May", "September", "December"][i % 4]} ${2019 + (i % 4)}, ${5 + (i % 25)}`,
      category: "Events"
    })),
  ];

  const categories = ['All', 'Reunions', 'Portraits', 'Travel', 'Weddings', 'Events', 'Holidays'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openImage = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const downloadImage = async (imageUrl, imageTitle) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageTitle.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const shareImage = async (image) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: image.src,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${image.title} - ${image.description}`);
      alert('Image details copied to clipboard!');
    }
  };

  // Get category counts for display
  const getCategoryCounts = () => {
    const counts = {};
    categories.forEach(category => {
      if (category === 'All') {
        counts[category] = galleryImages.length;
      } else {
        counts[category] = galleryImages.filter(img => img.category === category).length;
      }
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div 
          className="w-16 h-1 mx-auto mb-4 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
        <h2 
          className="text-4xl font-bold mb-4"
          style={{ color: colors.text }}
        >
          Family Memories
        </h2>
        <p 
          className="text-lg max-w-2xl mx-auto font-['Sedan']"
          style={{ color: colors.textLight }}
        >
          A visual journey through generations of cherished moments, celebrations, and milestones that define the Kodero family legacy.
        </p>
        <div className="mt-4 text-sm font-['Sedan']" style={{ color: colors.textLight }}>
          {galleryImages.length} precious memories across {categories.length - 1} categories
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-8 px-4"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full border-2 transition-all duration-300 font-['Sedan'] text-sm font-medium ${
              activeCategory === category 
                ? 'text-white' 
                : 'hover:scale-105'
            }`}
            style={{
              borderColor: colors.primary,
              backgroundColor: activeCategory === category ? colors.primary : 'transparent',
              color: activeCategory === category ? colors.background : colors.text,
            }}
          >
            {category} ({categoryCounts[category]})
          </button>
        ))}
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4"
      >
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-xl border-2"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
            onClick={() => openImage(image, index)}
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 
                className="text-white font-bold text-lg mb-1 font-['Expletus_Sans']"
              >
                {image.title}
              </h3>
              <p 
                className="text-gray-200 text-sm font-['Sedan'] mb-2 line-clamp-2"
              >
                {image.description}
              </p>
              <div className="flex justify-between items-center">
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  {image.category}
                </span>
                <span 
                  className="text-xs text-gray-300 font-['Sedan']"
                >
                  {image.date}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(image.src, image.title);
                }}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                title="Download"
              >
                <Download size={16} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  shareImage(image);
                }}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                title="Share"
              >
                <Share2 size={16} className="text-white" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div 
            className="text-6xl mb-4 opacity-50"
            style={{ color: colors.textLight }}
          >
            📷
          </div>
          <h3 
            className="text-xl font-bold mb-2 font-['Expletus_Sans']"
            style={{ color: colors.text }}
          >
            No images found
          </h3>
          <p 
            className="font-['Sedan']"
            style={{ color: colors.textLight }}
          >
            Try selecting a different category to see more family memories.
          </p>
        </motion.div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeImage}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeImage}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                style={{ color: colors.background }}
              >
                <X size={24} />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                style={{ color: colors.background }}
              >
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                style={{ color: colors.background }}
              >
                <ChevronRight size={28} />
              </button>

              {/* Image */}
              <div className="rounded-2xl overflow-hidden bg-white">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                
                {/* Image Info */}
                <div 
                  className="p-6"
                  style={{
                    backgroundColor: colors.card,
                    color: colors.text,
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold font-['Expletus_Sans'] mb-2">
                        {selectedImage.title}
                      </h3>
                      <p className="text-lg font-['Sedan'] opacity-80 mb-2">
                        {selectedImage.description}
                      </p>
                    </div>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium font-['Sedan']"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.background,
                      }}
                    >
                      {selectedImage.category}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-['Sedan'] opacity-70">
                      {selectedImage.date}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => downloadImage(selectedImage.src, selectedImage.title)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-['Sedan']"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.background,
                        }}
                      >
                        <Download size={18} />
                        Download
                      </button>
                      <button
                        onClick={() => shareImage(selectedImage)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors font-['Sedan']"
                        style={{
                          borderColor: colors.primary,
                          color: colors.text,
                        }}
                      >
                        <Share2 size={18} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Counter */}
              <div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full font-['Sedan'] text-sm"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                {currentIndex + 1} / {filteredImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mt-12"
      >
        <p 
          className="text-lg font-['Sedan'] mb-6"
          style={{ color: colors.textLight }}
        >
          Have photos to share with the family?
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl border-2 transition-all duration-300 font-['Sedan'] font-medium"
          style={{
            borderColor: colors.primary,
            backgroundColor: darkMode ? 'rgba(116, 48, 20, 0.3)' : 'rgba(157, 145, 103, 0.2)',
            color: colors.text,
          }}
        >
          Contribute to Family Archive
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Gallery;