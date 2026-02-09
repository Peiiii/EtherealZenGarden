
import React, { useState, useEffect, useCallback } from 'react';
import GardenScene from './components/GardenScene';
import ControlPanel from './components/ControlPanel';
import { FlowerConfig, PetalShape, LeafShape } from './types';

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

  // 初始化花园
  useEffect(() => {
    const initialFlowers: FlowerConfig[] = Array.from({ length: 3 }).map((_, i) => ({
      ...generateRandomFlowerConfig(),
      id: `init-${i}`,
      position: [(Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20]
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
    
    // 随机模式下更新模板，以便用户切换模式后能基于上一朵进行修改
    if (isRandomMode) {
      setCurrentTemplate(config);
    }
  }, [currentTemplate, isRandomMode]);

  const handlePlantRandomly = () => {
    const pos: [number, number, number] = [
      (Math.random() - 0.5) * 40,
      0,
      (Math.random() - 0.5) * 40
    ];
    handlePlantAtPosition(pos);
  };

  const handleClear = () => {
    if (confirm("确定要清空花园中所有的花朵吗？")) {
      setFlowers([]);
    }
  };

  const shuffleTemplate = () => {
    setCurrentTemplate(generateRandomFlowerConfig());
  };

  return (
    <div className="relative w-screen h-screen">
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

      {/* 悬浮信息 */}
      <div className="absolute top-4 right-4 text-white/60 text-[11px] pointer-events-none text-right uppercase tracking-[0.2em] font-bold">
        空灵禅意花园 v1.3<br/>
        {isRandomMode ? "随机种子模式已激活" : "设计师模式已激活"}<br/>
        点击地面即可播种 • 动态生长模拟
      </div>

      {/* 底部状态栏 */}
      <div className="absolute bottom-6 right-8 text-white/90 bg-slate-900/80 px-6 py-4 rounded-3xl backdrop-blur-xl flex items-center gap-8 text-sm border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${isRandomMode ? 'bg-purple-500 animate-pulse' : 'bg-emerald-500 animate-pulse'} shadow-[0_0_12px_rgba(16,185,129,0.8)]`}></span>
          <span className="font-bold">园内植株: <span className="text-pink-400 text-lg">{flowers.length}</span></span>
        </div>
        <div className="text-xs text-white/40 font-mono tracking-widest border-l border-white/10 pl-8">
          环境光效: {timeOfDay > 6 && timeOfDay < 18 ? "日间模式" : "夜间模式"}
        </div>
      </div>
    </div>
  );
};

export default App;
