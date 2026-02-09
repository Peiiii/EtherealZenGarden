
import React, { useState, useEffect, useCallback } from 'react';
import GardenScene from './components/GardenScene';
import ControlPanel from './components/ControlPanel';
import { FlowerConfig, PetalShape, LeafShape } from './types';

const App: React.FC = () => {
  const [timeOfDay, setTimeOfDay] = useState<number>(12);
  const [flowers, setFlowers] = useState<FlowerConfig[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Omit<FlowerConfig, 'id' | 'position'>>({
    petalColor: '#ff69b4',
    petalCount: 8,
    petalSize: 1,
    petalShape: PetalShape.ROUND,
    stemHeight: 3,
    stemThickness: 0.1,
    leafCount: 2,
    leafSize: 0.8,
    leafShape: LeafShape.OVAL,
    centerColor: '#ffff00',
    density: 1
  });

  // Initial garden with a few flowers
  useEffect(() => {
    const initialFlowers: FlowerConfig[] = [
      {
        id: 'init-1',
        position: [0, 0, 0],
        petalColor: '#ff99cc',
        petalCount: 16,
        petalSize: 1.5,
        petalShape: PetalShape.ROUND,
        stemHeight: 5,
        stemThickness: 0.2,
        leafCount: 4,
        leafSize: 1.2,
        leafShape: LeafShape.OVAL,
        centerColor: '#ffd700',
        density: 1
      },
      {
        id: 'init-2',
        position: [-10, 0, 5],
        petalColor: '#cc99ff',
        petalCount: 12,
        petalSize: 1.0,
        petalShape: PetalShape.POINTY,
        stemHeight: 4,
        stemThickness: 0.1,
        leafCount: 2,
        leafSize: 0.8,
        leafShape: LeafShape.LONG,
        centerColor: '#ffffff',
        density: 1
      }
    ];
    setFlowers(initialFlowers);
  }, []);

  const handlePlantAtPosition = useCallback((pos: [number, number, number]) => {
    const newFlower: FlowerConfig = {
      ...currentTemplate,
      id: Math.random().toString(36).substr(2, 9),
      position: pos
    };
    setFlowers(prev => [...prev, newFlower]);
  }, [currentTemplate]);

  const handlePlantRandomly = (config: Omit<FlowerConfig, 'id' | 'position'>) => {
    const pos: [number, number, number] = [
      (Math.random() - 0.5) * 40,
      0,
      (Math.random() - 0.5) * 40
    ];
    handlePlantAtPosition(pos);
  };

  const handleClear = () => {
    if (confirm("Clear all flowers from your garden?")) {
      setFlowers([]);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* 3D Scene Background */}
      <GardenScene 
        timeOfDay={timeOfDay} 
        flowers={flowers} 
        onGroundClick={handlePlantAtPosition}
      />

      {/* UI Overlay */}
      <ControlPanel 
        timeOfDay={timeOfDay} 
        setTimeOfDay={setTimeOfDay} 
        onPlant={handlePlantRandomly}
        onClear={handleClear}
        onConfigChange={setCurrentTemplate}
      />

      {/* Floating Information */}
      <div className="absolute top-4 right-4 text-white/40 text-[10px] pointer-events-none text-right uppercase tracking-[0.2em]">
        Ethereal Zen Garden v1.1<br/>
        Click ground to plant • Dynamic Growth<br/>
        Enhanced Day Lighting
      </div>

      <div className="absolute bottom-6 right-8 text-white/60 bg-black/40 px-5 py-3 rounded-2xl backdrop-blur-xl flex items-center gap-6 text-sm border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          Flowers: {flowers.length}
        </div>
        <div className="text-[10px] text-white/30 font-mono">
          FPS: 60 • RENDER: WEBGL2
        </div>
      </div>
    </div>
  );
};

export default App;
