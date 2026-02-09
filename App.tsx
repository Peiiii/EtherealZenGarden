
import React, { useState, useEffect, useCallback } from 'react';
import GardenScene from './components/GardenScene';
import ControlPanel from './components/ControlPanel';
import { FlowerConfig, PetalShape, LeafShape } from './types';
import { MousePointer2 } from 'lucide-react';

const getRandomEnumValue = (anEnum: any) => {
  const values = Object.values(anEnum);
  return values[Math.floor(Math.random() * values.length)];
};

const generateRandomFlowerConfig = (): Omit<FlowerConfig, 'id' | 'position'> => ({
  petalColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
  petalCount: Math.floor(Math.random() * 20) + 5,
  petalSize: 0.5 + Math.random() * 1.5,
  petalShape: getRandomEnumValue(PetalShape) as PetalShape,
  stemHeight: 2 + Math.random() * 8,
  stemThickness: 0.05 + Math.random() * 0.15,
  leafCount: Math.floor(Math.random() * 5),
  leafSize: 0.5 + Math.random() * 1,
  leafShape: getRandomEnumValue(LeafShape) as LeafShape,
  centerColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
  density: 1
});

const App: React.FC = () => {
  const [timeOfDay, setTimeOfDay] = useState<number>(12);
  const [flowers, setFlowers] = useState<FlowerConfig[]>([]);
  const [isRandomMode, setIsRandomMode] = useState<boolean>(true);
  const [currentTemplate, setCurrentTemplate] = useState<Omit<FlowerConfig, 'id' | 'position'>>(generateRandomFlowerConfig());

  useEffect(() => {
    const initialFlowers: FlowerConfig[] = Array.from({ length: 4 }).map((_, i) => ({
      ...generateRandomFlowerConfig(),
      id: `init-${i}`,
      position: [(Math.random() - 0.5) * 25, 0, (Math.random() - 0.5) * 25]
    }));
    setFlowers(initialFlowers);
  }, []);

  const handlePlantAtPosition = useCallback((pos: [number, number, number]) => {
    const config = isRandomMode ? generateRandomFlowerConfig() : currentTemplate;
    const newFlower: FlowerConfig = {
      ...config,
      id: Math.random().toString(36).substr(2, 9),
      position: pos
    };
    setFlowers(prev => [...prev, newFlower]);
    if (isRandomMode) {
      setCurrentTemplate(config);
    }
  }, [currentTemplate, isRandomMode]);

  const handlePlantRandomly = () => {
    const pos: [number, number, number] = [
      (Math.random() - 0.5) * 45,
      0,
      (Math.random() - 0.5) * 45
    ];
    handlePlantAtPosition(pos);
  };

  const handleClear = () => {
    if (confirm("✨ 确定要通过这一场神圣的雨水清空花园吗？")) {
      setFlowers([]);
    }
  };

  const shuffleTemplate = () => {
    setCurrentTemplate(generateRandomFlowerConfig());
  };

  return (
    <div className="relative w-screen h-screen bg-black">
      <GardenScene 
        timeOfDay={timeOfDay} 
        flowers={flowers} 
        onGroundClick={handlePlantAtPosition}
      />

      <ControlPanel 
        timeOfDay={timeOfDay} 
        setTimeOfDay={setTimeOfDay} 
        onPlant={handlePlantRandomly}
        onClear={handleClear}
        onConfigChange={setCurrentTemplate}
        currentConfig={currentTemplate}
        isRandomMode={isRandomMode}
        setIsRandomMode={setIsRandomMode}
        onShuffle={shuffleTemplate}
      />

      {/* 顶部右侧标语 - 缩小尺寸 */}
      <div className="absolute top-6 right-6 text-white text-right pointer-events-none drop-shadow-lg">
        <div className="text-xl font-black italic bg-gradient-to-l from-white to-pink-300 bg-clip-text text-transparent">梦幻禅境 V2.0</div>
        <div className="text-[9px] font-black tracking-[0.3em] text-pink-400/80 mt-1 uppercase">
          {isRandomMode ? "● 随机创世 ●" : "● 精密设计 ●"}
        </div>
      </div>

      {/* 底部状态栏 - 缩小尺寸 */}
      <div className="absolute bottom-6 right-6 flex items-center gap-4">
        <div className="bg-slate-900/80 border border-white/20 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRandomMode ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'} animate-pulse`}></div>
            <span className="text-white font-bold text-xs">
              植株: <span className="text-pink-400 font-mono ml-1">{flowers.length}</span>
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] text-white/40 font-black tracking-widest uppercase">环境光效</span>
            <span className="text-[10px] font-black text-emerald-400">
              {timeOfDay > 6 && timeOfDay < 18 ? "黄金日间" : "幽邃夜色"}
            </span>
          </div>
        </div>
      </div>

      {/* 底部交互提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-black/40 border border-white/10 px-4 py-1 rounded-full backdrop-blur-md text-white/50 font-black text-[8px] tracking-[0.3em] uppercase animate-bounce">
          点击草地，播撒种子
        </div>
      </div>
    </div>
  );
};

export default App;
