import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { motion } from 'framer-motion';
import { Download, RotateCcw, User, Heart, Crown, ZoomIn, ZoomOut } from 'lucide-react';
import { toPng } from 'html-to-image';

const FamilyTree = ({ data, onMemberSelect, searchTerm, darkMode, colors }) => {
  const treeContainerRef = useRef();
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.8); // Increased default zoom
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  const [isDragging, setIsDragging] = useState(false);
  const [containerHeight, setContainerHeight] = useState(1000);

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

  // Responsive scaling logic
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });

      const calculatedHeight = Math.max(1000, height * 0.95);
      setContainerHeight(calculatedHeight);

      const translateX = width / 2;
      const translateY = calculatedHeight / 4;

      setTranslate({ x: translateX, y: translateY });

      // Adjust initial scale for devices
      let newScale;
      if (width < 640) newScale = 0.4;
      else if (width < 768) newScale = 0.5;
      else if (width < 1024) newScale = 0.7;
      else newScale = 0.8;

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
        memberMap.set(member.id, { ...member, children: [] });
      });

      members.forEach(member => {
        if (member.children?.length) {
          member.children.forEach(childId => {
            const child = memberMap.get(childId);
            if (child) memberMap.get(member.id).children.push(child);
          });
        }
      });

      const allChildIds = new Set();
      members.forEach(member => {
        member.children?.forEach(childId => allChildIds.add(childId));
      });

      const rootNodes = members.filter(member => !allChildIds.has(member.id));

      return {
        name: "Kodero Family Legacy",
        generation: 0,
        nodeType: 'root',
        children: rootNodes.map(r => memberMap.get(r.id)).filter(Boolean)
      };
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
          pixelRatio: 2
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
    setTranslate({ x: translateX, y: translateY });
    setScale(0.8);
    setZoomLevel(0.8);
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
      const newScale = Math.max(prev - 0.1, 0.2);
      setZoomLevel(newScale);
      return newScale;
    });
  }, []);

  const effectiveFontScale = Math.max(0.8, zoomLevel * 1.1);

  const getGenerationColor = useCallback((generation) => {
    const base = darkMode ? currentColors.accent : currentColors.primary;
    return { dark: base, light: currentColors.secondary };
  }, [currentColors, darkMode]);

  const customPathFunc = (linkDatum) => {
    const { source, target } = linkDatum;
    const midY = source.y + (target.y - source.y) / 2;
    return `M${source.x},${source.y} V${midY} H${target.x} V${target.y}`;
  };

  const renderCustomNodeElement = useCallback(({ nodeDatum }) => {
    const generation = nodeDatum.generation || 1;
    const genColors = getGenerationColor(generation);
    const fontSize = (16 * effectiveFontScale).toFixed(1);
    const titleSize = (20 * effectiveFontScale).toFixed(1);

    return (
      <motion.g
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleNodeClick(nodeDatum)}
        className="cursor-pointer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <rect
          x={-120}
          y={-60}
          width={240}
          height={120}
          rx={8}
          fill={currentColors.card}
          stroke={genColors.dark}
          strokeWidth={3}
        />
        <text
          textAnchor="middle"
          y={-10}
          fontSize={titleSize}
          fontFamily="Expletus Sans, serif"
          fontWeight="700"
          fill={currentColors.text}
        >
          {nodeDatum.name}
        </text>
        <text
          textAnchor="middle"
          y={20}
          fontSize={fontSize}
          fontFamily="Sedan, sans-serif"
          fill={currentColors.textLight}
        >
          {`Gen ${generation}`}
        </text>
      </motion.g>
    );
  }, [handleNodeClick, currentColors, getGenerationColor, effectiveFontScale]);

  if (error) return <div className="text-center p-6">{error}</div>;
  if (isLoading) return <div className="text-center p-6">Loading family tree...</div>;

  return (
    <div className="relative">
      {/* Zoom Controls */}
      <div className="absolute top-3 right-4 z-10 flex gap-2 bg-white/80 p-2 rounded-md border">
        <button onClick={zoomOut}><ZoomOut size={16} /></button>
        <span>{Math.round(zoomLevel * 100)}%</span>
        <button onClick={zoomIn}><ZoomIn size={16} /></button>
        <button onClick={resetView}><RotateCcw size={16} /></button>
        <button onClick={exportToImage}><Download size={16} /></button>
      </div>

      <motion.div
        ref={treeContainerRef}
        style={{
          height: `${containerHeight}px`,
          backgroundColor: currentColors.card,
          border: `2px solid ${currentColors.border}`,
          overflow: 'auto',
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          transition: 'transform 0.3s ease'
        }}
      >
        <Tree
          data={treeData}
          orientation="vertical"
          translate={translate}
          scale={scale}
          renderCustomNodeElement={renderCustomNodeElement}
          pathFunc={customPathFunc}
          separation={{ siblings: 3, nonSiblings: 4 }}
          depthFactor={800}
          nodeSize={{ x: 400, y: 400 }}
          styles={{
            links: {
              stroke: currentColors.primary,
              strokeWidth: 3
            }
          }}
          transitionDuration={500}
        />
      </motion.div>
    </div>
  );
};

export default FamilyTree;
