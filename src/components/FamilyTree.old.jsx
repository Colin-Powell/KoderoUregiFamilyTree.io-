import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { motion } from 'framer-motion';
import { Download, RotateCcw, User, Heart, Crown, Shield, ZoomIn, ZoomOut } from 'lucide-react';
import { toPng } from 'html-to-image';

const FamilyTree = ({ data, onMemberSelect, searchTerm, darkMode, colors }) => {
  const treeContainerRef = useRef();
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.4);
  const [zoomLevel, setZoomLevel] = useState(0.4);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  const [isDragging, setIsDragging] = useState(false);
  const [containerHeight, setContainerHeight] = useState(800);

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
      primary: '#E8D4A7',
      secondary: '#9D9167',
      accent: '#D4B483',
      background: '#1A1208',
      card: '#2D1F0F',
      text: '#E8D4A7',
      textLight: '#9D9167',
      border: '#64592B'
    }
  };

  const currentColors = colors || (darkMode ? defaultColors.dark : defaultColors.light);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });
      
      // Responsive container height calculation - increased for deeper trees
      const calculatedHeight = Math.max(1000, height * 0.95); // Increased minimum height
      setContainerHeight(calculatedHeight);
      
      const translateX = width / 2;
      const translateY = calculatedHeight / 4; // Start higher to accommodate larger cards
      
      setTranslate({
        x: translateX,
        y: translateY
      });

      // Reduced initial scale to fit larger cards
      let newScale;
      if (width < 640) { // Mobile
        newScale = 0.25;
      } else if (width < 768) { // Small tablet
        newScale = 0.3;
      } else if (width < 1024) { // Tablet
        newScale = 0.35;
      } else { // Desktop
        newScale = 0.4;
      }
      setScale(newScale);
      setZoomLevel(newScale);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  const buildTree = useCallback((members) => {
    if (!members || members.length === 0) return null;

    try {
      const memberMap = new Map();
      
      members.forEach(member => {
        memberMap.set(member.id, {
          ...member,
          children: []
        });
      });

      members.forEach(member => {
        if (member.children && member.children.length > 0) {
          member.children.forEach(childId => {
            const child = memberMap.get(childId);
            if (child) {
              memberMap.get(member.id).children.push(child);
            }
          });
        }
      });

      const allChildIds = new Set();
      members.forEach(member => {
        if (member.children) {
          member.children.forEach(childId => allChildIds.add(childId));
        }
      });

      const rootNodes = members.filter(member => !allChildIds.has(member.id));

      const virtualRoot = {
        name: "Kodero Family Legacy",
        generation: 0,
        nodeType: 'root',
        children: rootNodes.map(root => memberMap.get(root.id)).filter(Boolean)
      };

      return virtualRoot;
    } catch (err) {
      console.error('Error building tree:', err);
      setError('Error building family tree structure');
      return null;
    }
  }, []);

  const treeData = useMemo(() => {
    setError(null);
    return buildTree(data);
  }, [data, buildTree]);

  const handleNodeClick = useCallback((nodeDatum) => {
    if (nodeDatum.nodeType !== 'root') {
      onMemberSelect(nodeDatum);
    }
  }, [onMemberSelect]);

  const exportToImage = useCallback(async () => {
    if (treeContainerRef.current) {
      try {
        const dataUrl = await toPng(treeContainerRef.current, { 
          quality: 0.95,
          backgroundColor: currentColors.background,
          pixelRatio: 2,
          width: treeContainerRef.current.scrollWidth,
          height: treeContainerRef.current.scrollHeight
        });
        
        const link = document.createElement('a');
        link.download = `kodero-family-tree-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error exporting image:', error);
      }
    }
  }, [currentColors]);

  const resetView = useCallback(() => {
    const translateX = windowSize.width / 2;
    const translateY = containerHeight / 4;
    
    let newScale;
    if (windowSize.width < 640) {
      newScale = 0.25;
    } else if (windowSize.width < 768) {
      newScale = 0.3;
    } else if (windowSize.width < 1024) {
      newScale = 0.35;
    } else {
      newScale = 0.4;
    }
    
    setTranslate({
      x: translateX,
      y: translateY
    });
    setScale(newScale);
    setZoomLevel(newScale);
  }, [windowSize, containerHeight]);

  const zoomIn = useCallback(() => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.1, 2);
      setZoomLevel(newScale);
      return newScale;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.1, 0.1);
      setZoomLevel(newScale);
      return newScale;
    });
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getGenerationColor = useCallback((generation) => {
    const generationColors = darkMode ? {
      0: { light: currentColors.accent, dark: currentColors.primary },
      1: { light: currentColors.secondary, dark: currentColors.primary },
      2: { light: currentColors.accent, dark: currentColors.secondary },
      3: { light: currentColors.secondary, dark: currentColors.accent },
      4: { light: currentColors.accent, dark: currentColors.secondary },
      5: { light: currentColors.secondary, dark: currentColors.accent },
      6: { light: currentColors.accent, dark: currentColors.secondary },
      7: { light: currentColors.secondary, dark: currentColors.accent },
    } : {
      0: { light: currentColors.accent, dark: currentColors.primary },
      1: { light: currentColors.secondary, dark: currentColors.primary },
      2: { light: currentColors.accent, dark: currentColors.primary },
      3: { light: currentColors.secondary, dark: currentColors.primary },
      4: { light: currentColors.accent, dark: currentColors.primary },
      5: { light: currentColors.secondary, dark: currentColors.primary },
      6: { light: currentColors.accent, dark: currentColors.primary },
      7: { light: currentColors.secondary, dark: currentColors.primary },
    };
    
    return generationColors[generation] || generationColors[1];
  }, [currentColors, darkMode]);

  const customPathFunc = (linkDatum, orientation) => {
    const { source, target } = linkDatum;
    
    const sourceX = source.x;
    const sourceY = source.y;
    const targetX = target.x;
    const targetY = target.y;
    
    const midY = sourceY + (targetY - sourceY) / 2;
    
    return `M${sourceX},${sourceY} V${midY} H${targetX} V${targetY}`;
  };

  const renderCustomNodeElement = useCallback(({ nodeDatum, toggleNode }) => {
    const generation = nodeDatum.generation || 1;
    const nodeType = nodeDatum.nodeType || 'person';
    const generationColors = getGenerationColor(generation);
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;
    const isRoot = nodeType === 'root';
    const isFamilyUnit = nodeType === 'family-unit';
    const isAugustine = nodeDatum.name === 'Augustine Kodero';
    const isDeceased = nodeDatum.status === 'deceased';

    const isMobile = windowSize.width < 640;
    const isTablet = windowSize.width < 1024;
    
    // MAXIMUM CARD DIMENSIONS - PUSHING THE LIMITS
    const cardWidth = isRoot 
      ? (isMobile ? 280 : isTablet ? 350 : 400) // MAXIMUM SIZE
      : isFamilyUnit 
        ? (isMobile ? 400 : isTablet ? 500 : 600) // MAXIMUM SIZE
        : isAugustine 
          ? (isMobile ? 280 : isTablet ? 350 : 400) // MAXIMUM SIZE
          : (isMobile ? 220 : isTablet ? 280 : 320); // MAXIMUM SIZE

    const cardHeight = isRoot 
      ? (isMobile ? 120 : isTablet ? 150 : 180) // MAXIMUM SIZE
      : isFamilyUnit 
        ? (isMobile ? 120 : isTablet ? 140 : 160) // MAXIMUM SIZE
        : isAugustine 
          ? (isMobile ? 160 : isTablet ? 200 : 240) // MAXIMUM SIZE
          : (isMobile ? 180 : isTablet ? 220 : 260); // MAXIMUM SIZE

    // MAXIMUM FONT SIZES
    const fontSize = isMobile ? '12' : isTablet ? '14' : '16';
    const smallFontSize = isMobile ? '10' : isTablet ? '12' : '13';
    const titleFontSize = isMobile ? '14' : isTablet ? '18' : '20';

    if (isRoot) {
      return (
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <rect
            x={-cardWidth / 2}
            y={-cardHeight / 2}
            width={cardWidth}
            height={cardHeight}
            rx={0}
            fill={generationColors.dark}
            stroke={generationColors.light}
            strokeWidth={isMobile ? 3 : 4}
            className="shadow-2xl"
          />
          
          <rect
            x={-cardWidth / 2 + (isMobile ? 6 : 8)}
            y={-cardHeight / 2 + (isMobile ? 6 : 8)}
            width={cardWidth - (isMobile ? 12 : 16)}
            height={cardHeight - (isMobile ? 12 : 16)}
            rx={0}
            fill="none"
            stroke={generationColors.light}
            strokeWidth={isMobile ? 2 : 3}
            opacity={0.6}
          />

          <text
            fill={generationColors.light}
            x="0"
            y={isMobile ? -15 : -20}
            textAnchor="middle"
            fontSize={titleFontSize}
            fontFamily="Expletus Sans, serif"
            fontWeight="700"
          >
            Kodero Family
          </text>
          <text
            fill={generationColors.light}
            x="0"
            y={isMobile ? 5 : 10}
            textAnchor="middle"
            fontSize={isMobile ? "11" : "14"}
            fontFamily="Sedan, sans-serif"
            fontWeight="500"
          >
            Complete Lineage
          </text>
          <text
            fill={generationColors.light}
            x="0"
            y={isMobile ? 25 : 35}
            textAnchor="middle"
            fontSize={isMobile ? "10" : "12"}
            fontFamily="Sedan, sans-serif"
            fontWeight="400"
          >
            Augustine & Descendants
          </text>
          
          <Crown 
            size={isMobile ? 18 : 22}
            color={generationColors.light}
            x={-cardWidth / 2 + (isMobile ? 12 : 16)} 
            y={-cardHeight / 2 + (isMobile ? 12 : 16)}
          />
        </motion.g>
      );
    }

    if (isFamilyUnit) {
      const spouses = nodeDatum.spouses || [];
      const spouse1 = spouses[0] || {};
      const spouse2 = spouses[1] || {};
      const spouseWidth = isMobile ? 140 : isTablet ? 180 : 200;
      
      return (
        <motion.g
          whileHover={{ scale: 1.05 }}
          onClick={() => handleNodeClick(nodeDatum)}
          className="cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Spouse 1 Card - Left */}
          <g transform={`translate(${-spouseWidth - 20}, 0)`}>
            <rect
              x={-spouseWidth / 2}
              y={-cardHeight / 2}
              width={spouseWidth}
              height={cardHeight}
              rx={0}
              fill={currentColors.card}
              stroke={generationColors.dark}
              strokeWidth={3}
              className="shadow-xl"
            />
            <rect
              x={-spouseWidth / 2 + 4}
              y={-cardHeight / 2 + 4}
              width={spouseWidth - 8}
              height={cardHeight - 8}
              rx={0}
              fill="none"
              stroke={generationColors.dark}
              strokeWidth={2}
              opacity={0.3}
            />
            <text
              fill={currentColors.text}
              x="0"
              y={-15}
              textAnchor="middle"
              fontSize={fontSize}
              fontFamily="Expletus Sans, serif"
              fontWeight="600"
            >
              {spouse1.name && spouse1.name.length > (isMobile ? 10 : 14)
                ? spouse1.name.substring(0, isMobile ? 10 : 14) + '...' 
                : spouse1.name || 'Spouse 1'}
            </text>
            <text
              fill={currentColors.textLight}
              x="0"
              y={5}
              textAnchor="middle"
              fontSize={smallFontSize}
              fontFamily="Sedan, sans-serif"
              fontWeight="400"
            >
              {spouse1.role || 'Parent'}
            </text>
          </g>

          {/* Spouse 2 Card - Right */}
          <g transform={`translate(${spouseWidth + 20}, 0)`}>
            <rect
              x={-spouseWidth / 2}
              y={-cardHeight / 2}
              width={spouseWidth}
              height={cardHeight}
              rx={0}
              fill={currentColors.card}
              stroke={generationColors.dark}
              strokeWidth={3}
              className="shadow-xl"
            />
            <rect
              x={-spouseWidth / 2 + 4}
              y={-cardHeight / 2 + 4}
              width={spouseWidth - 8}
              height={cardHeight - 8}
              rx={0}
              fill="none"
              stroke={generationColors.dark}
              strokeWidth={2}
              opacity={0.3}
            />
            <text
              fill={currentColors.text}
              x="0"
              y={-15}
              textAnchor="middle"
              fontSize={fontSize}
              fontFamily="Expletus Sans, serif"
              fontWeight="600"
            >
              {spouse2.name && spouse2.name.length > (isMobile ? 10 : 14)
                ? spouse2.name.substring(0, isMobile ? 10 : 14) + '...' 
                : spouse2.name || 'Spouse 2'}
            </text>
            <text
              fill={currentColors.textLight}
              x="0"
              y={5}
              textAnchor="middle"
              fontSize={smallFontSize}
              fontFamily="Sedan, sans-serif"
              fontWeight="400"
            >
              {spouse2.role || 'Parent'}
            </text>
          </g>

          {/* Horizontal Connection Line */}
          <line
            x1={-spouseWidth / 2}
            x2={spouseWidth / 2}
            y1={0}
            y2={0}
            stroke={currentColors.primary}
            strokeWidth={3}
          />

          {/* Heart Icon in Center */}
          <Heart 
            size={isMobile ? 16 : 20}
            color={currentColors.accent}
            fill={currentColors.accent}
            x={-8}
            y={-8}
          />

          {/* Vertical line for children connection */}
          {hasChildren && (
            <line
              x1={0}
              x2={0}
              y1={cardHeight / 2}
              y2={cardHeight / 2 + 20}
              stroke={currentColors.primary}
              strokeWidth={3}
            />
          )}
        </motion.g>
      );
    }

    return (
      <motion.g
        whileHover={{ scale: isMobile ? 1.03 : 1.05, y: isMobile ? -2 : -3 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleNodeClick(nodeDatum)}
        className="cursor-pointer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <rect
          x={-cardWidth / 2}
          y={-cardHeight / 2}
          width={cardWidth}
          height={cardHeight}
          rx={0}
          fill={currentColors.card}
          stroke={isAugustine ? currentColors.primary : generationColors.dark}
          strokeWidth={isAugustine ? (isMobile ? 4 : 5) : (isMobile ? 3 : 4)}
          className="shadow-xl"
        />

        <rect
          x={-cardWidth / 2 + (isMobile ? 3 : 4)}
          y={-cardHeight / 2 + (isMobile ? 3 : 4)}
          width={cardWidth - (isMobile ? 6 : 8)}
          height={cardHeight - (isMobile ? 6 : 8)}
          rx={0}
          fill="none"
          stroke={isAugustine ? currentColors.primary : generationColors.dark}
          strokeWidth={2}
          opacity={0.3}
        />

        {/* Avatar Section - MAXIMUM SIZE */}
        <rect
          x={-cardWidth / 2 + (isMobile ? 12 : 16)}
          y={-cardHeight / 2 + (isMobile ? 12 : 16)}
          width={isMobile ? 45 : 60}
          height={isMobile ? 45 : 60}
          rx={0}
          fill={isAugustine ? currentColors.primary : currentColors.secondary}
          stroke={currentColors.card}
          strokeWidth={isMobile ? 2 : 3}
        />
        
        <User 
          size={isMobile ? 18 : 24}
          color="white" 
          x={-cardWidth / 2 + (isMobile ? 22 : 30)}
          y={-cardHeight / 2 + (isMobile ? 22 : 30)}
        />

        {/* Name - MAXIMUM VISIBILITY */}
        <text
          x={-cardWidth / 2 + (isMobile ? 70 : 90)}
          y={-cardHeight / 2 + (isMobile ? 28 : 38)}
          fill={currentColors.text}
          fontSize={fontSize}
          fontFamily="Expletus Sans, serif"
          fontWeight="700"
        >
          {nodeDatum.name && nodeDatum.name.length > (isMobile ? 12 : 16)
            ? nodeDatum.name.substring(0, isMobile ? 12 : 16) + '...' 
            : nodeDatum.name}
        </text>

        {/* Generation Badge - LARGER */}
        <rect
          x={cardWidth / 2 - (isMobile ? 22 : 30)}
          y={-cardHeight / 2 + (isMobile ? 12 : 16)}
          width={isMobile ? 20 : 28}
          height={isMobile ? 20 : 28}
          rx={0}
          fill={isAugustine ? currentColors.primary : generationColors.dark}
          stroke={generationColors.light}
          strokeWidth={isMobile ? 2 : 3}
        />
        <text
          x={cardWidth / 2 - (isMobile ? 12 : 16)}
          y={-cardHeight / 2 + (isMobile ? 24 : 32)}
          textAnchor="middle"
          fill="white"
          fontSize={isMobile ? "10" : "12"}
          fontFamily="Expletus Sans, serif"
          fontWeight="700"
        >
          {generation}
        </text>

        {/* Role/Status */}
        <text
          x={-cardWidth / 2 + (isMobile ? 70 : 90)}
          y={-cardHeight / 2 + (isMobile ? 48 : 65)}
          fill={currentColors.textLight}
          fontSize={smallFontSize}
          fontFamily="Sedan, sans-serif"
          fontWeight="500"
        >
          {isAugustine ? 'Patriarch' : isDeceased ? 'Deceased' : `Gen ${generation}`}
        </text>

        {/* Separator Line */}
        <line
          x1={-cardWidth / 2 + (isMobile ? 12 : 16)}
          x2={cardWidth / 2 - (isMobile ? 12 : 16)}
          y1={-cardHeight / 2 + (isMobile ? 75 : 100)}
          y2={-cardHeight / 2 + (isMobile ? 75 : 100)}
          stroke={currentColors.border}
          strokeWidth={2}
          opacity={0.5}
        />

        {/* Children Count - LARGER */}
        {hasChildren && (
          <>
            <rect
              x={-cardWidth / 2 + (isMobile ? 12 : 16)}
              y={cardHeight / 2 - (isMobile ? 35 : 45)}
              width={isMobile ? 20 : 26}
              height={isMobile ? 20 : 26}
              rx={0}
              fill={currentColors.primary}
            />
            <text
              x={-cardWidth / 2 + (isMobile ? 22 : 29)}
              y={cardHeight / 2 - (isMobile ? 20 : 27)}
              textAnchor="middle"
              fill="white"
              fontSize={isMobile ? "10" : "12"}
              fontFamily="Expletus Sans, serif"
              fontWeight="700"
            >
              {nodeDatum.children.length}
            </text>
            <text
              x={-cardWidth / 2 + (isMobile ? 50 : 65)}
              y={cardHeight / 2 - (isMobile ? 20 : 27)}
              fill={currentColors.textLight}
              fontSize={smallFontSize}
              fontFamily="Sedan, sans-serif"
              fontWeight="500"
            >
              children
            </text>
          </>
        )}

        {/* Crown for Augustine - LARGER */}
        {isAugustine && (
          <Crown 
            size={isMobile ? 14 : 18}
            color={currentColors.primary}
            fill={currentColors.primary}
            x={cardWidth / 2 - (isMobile ? 45 : 60)}
            y={cardHeight / 2 - (isMobile ? 35 : 45)}
          />
        )}

        {/* Bottom Text */}
        <text
          x={0}
          y={cardHeight / 2 - (isMobile ? 8 : 15)}
          textAnchor="middle"
          fill={currentColors.textLight}
          fontSize={smallFontSize}
          fontFamily="Sedan, sans-serif"
          fontWeight="400"
          opacity={0.8}
        >
          {hasChildren ? `${nodeDatum.children.length} children` : isDeceased ? 'Deceased' : 'No children'}
        </text>
      </motion.g>
    );
  }, [handleNodeClick, getGenerationColor, currentColors, windowSize]);

  // Debug: Log tree data to check if 5th generation nodes exist
  useEffect(() => {
    if (treeData) {
      console.log('Tree Data Structure:', treeData);
      // Check for deep nodes
      const checkDeepNodes = (node, depth = 0) => {
        if (depth > 4) {
          console.log(`Deep node found at depth ${depth}:`, node);
        }
        if (node.children) {
          node.children.forEach(child => checkDeepNodes(child, depth + 1));
        }
      };
      checkDeepNodes(treeData);
    }
  }, [treeData]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-4 sm:p-6 border-2 mx-4" style={{ backgroundColor: currentColors.card, borderColor: currentColors.border, color: currentColors.text }}>
          <div className="text-lg font-semibold mb-2 font-['Expletus_Sans']">Error</div>
          <div className="font-['Sedan'] text-sm sm:text-base">{error}</div>
          <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 text-sm sm:text-base font-['Expletus_Sans']" style={{ backgroundColor: currentColors.primary, color: currentColors.background }}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center" style={{ color: currentColors.text }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 sm:w-16 sm:h-16 border-4 rounded-full mx-auto mb-4" style={{ borderColor: `${currentColors.primary} transparent transparent transparent` }} />
          <div className="text-base sm:text-lg font-semibold font-['Expletus_Sans']">Loading Family Tree</div>
          <div className="text-xs sm:text-sm font-['Sedan']">Rendering Kodero lineage...</div>
        </motion.div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-base sm:text-lg font-['Sedan']" style={{ color: currentColors.text }}>
          Building family tree...
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-2 sm:top-4 right-2 sm:right-6 z-10 flex gap-2 sm:gap-3 flex-wrap justify-end">
        {/* Zoom Controls */}
        <div className="flex gap-2 sm:gap-2 bg-white/90 dark:bg-gray-800/90 rounded-lg p-1 border" style={{ borderColor: currentColors.border }}>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={zoomOut}
            disabled={scale <= 0.1}
            className="p-2 sm:p-2 transition-all duration-300 disabled:opacity-50"
            style={{ 
              color: scale <= 0.1 ? currentColors.textLight : currentColors.text 
            }}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} className="sm:w-4 sm:h-4" />
          </motion.button>
          
          {/* Zoom Level Display */}
          <div className="flex items-center px-2 border-l border-r" style={{ borderColor: currentColors.border }}>
            <span 
              className="text-xs font-medium font-['Expletus_Sans']"
              style={{ color: currentColors.text }}
            >
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={zoomIn}
            disabled={scale >= 2}
            className="p-2 sm:p-2 transition-all duration-300 disabled:opacity-50"
            style={{ 
              color: scale >= 2 ? currentColors.textLight : currentColors.text 
            }}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn size={16} className="sm:w-4 sm:h-4" />
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={resetView}
            className="p-2 sm:p-3 border-2 transition-all duration-300 flex items-center gap-1 sm:gap-2 font-['Expletus_Sans'] text-xs sm:text-sm"
            style={{ 
              backgroundColor: currentColors.card, 
              borderColor: currentColors.primary, 
              color: currentColors.text 
            }}
            title="Reset View"
            aria-label="Reset View"
          >
            <RotateCcw size={16} className="sm:w-4 sm:h-4" />
            <span className="font-medium hidden sm:inline">Reset</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={exportToImage}
            className="p-2 sm:p-3 border-2 transition-all duration-300 flex items-center gap-1 sm:gap-2 font-['Expletus_Sans'] text-xs sm:text-sm"
            style={{ 
              backgroundColor: currentColors.primary, 
              borderColor: currentColors.primary, 
              color: currentColors.background 
            }}
            title="Export as PNG"
            aria-label="Export Family Tree"
          >
            <Download size={16} className="sm:w-4 sm:h-4" />
            <span className="font-medium hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </div>

      <motion.div 
        ref={treeContainerRef} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }} 
        className="relative w-full border-2 overflow-auto"
        style={{ 
          height: `${containerHeight}px`,
          backgroundColor: currentColors.card, 
          borderColor: currentColors.border,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Tree
          data={treeData}
          orientation="vertical"
          translate={translate}
          scale={scale}
          renderCustomNodeElement={renderCustomNodeElement}
          separation={{ 
            siblings: windowSize.width < 640 ? 1.5 : windowSize.width < 768 ? 2.0 : 2.5,
            nonSiblings: windowSize.width < 640 ? 2.0 : windowSize.width < 768 ? 2.5 : 3.0
          }}
          pathClassFunc={() => `stroke-2`}
          pathFunc={customPathFunc}
          zoom={0.3}
          draggable
          collapsible={false}
          depthFactor={windowSize.width < 640 ? 400 : windowSize.width < 768 ? 500 : windowSize.width < 1024 ? 600 : 700}
          nodeSize={{ 
            x: windowSize.width < 640 ? 250 : windowSize.width < 768 ? 300 : windowSize.width < 1024 ? 350 : 400,
            y: windowSize.width < 640 ? 220 : windowSize.width < 768 ? 280 : windowSize.width < 1024 ? 320 : 380
          }}
          initialDepth={10}
          enableLegacyTransitions
          transitionDuration={500}
          styles={{ 
            links: { 
              stroke: currentColors.primary, 
              strokeWidth: windowSize.width < 640 ? 2 : windowSize.width < 768 ? 2.5 : 3
            } 
          }}
          shouldCollapseNeighborNodes={false}
        />
      </motion.div>
    </div>
  );
};

export default FamilyTree;
