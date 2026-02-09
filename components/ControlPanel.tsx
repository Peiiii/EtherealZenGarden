
import React, { useState, useEffect } from 'react';
import { FlowerConfig, PetalShape, LeafShape } from '../types';
import { Flower as FlowerIcon, Sun, Moon, Sparkles, Plus, Trash2, Wind, MousePointer2 } from 'lucide-react';
import { generateAIFlower } from '../services/geminiService';

interface ControlPanelProps {
  timeOfDay: number;
  setTimeOfDay: (t: number) => void;
  onPlant: (config: Omit<FlowerConfig, 'id' | 'position'>) => void;
  onClear: () => void;
  onConfigChange: (config: Omit<FlowerConfig, 'id' | 'position'>) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ timeOfDay, setTimeOfDay, onPlant, onClear, onConfigChange }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [currentConfig, setCurrentConfig] = useState<Omit<FlowerConfig, 'id' | 'position'>>({
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

  // Sync state with parent to allow mouse planting with current config
  useEffect(() => {
    onConfigChange(currentConfig);
  }, [currentConfig]);

  const handlePlantClick = () => {
    onPlant(currentConfig);
  };

  const handleAIDream = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    const aiParams = await generateAIFlower(aiPrompt);
    const newConfig = { ...currentConfig, ...aiParams };
    setCurrentConfig(newConfig);
    setIsAiLoading(false);
  };

  return (
    <div className="absolute top-4 left-4 w-80 max-h-[90vh] overflow-y-auto bg-black/70 backdrop-blur-xl text-white p-6 rounded-2xl shadow-2xl border border-white/10 flex flex-col gap-6 scrollbar-hide">
      <header className="flex items-center gap-2 border-b border-white/10 pb-4">
        <FlowerIcon className="text-pink-400" />
        <h1 className="text-xl font-bold tracking-tight">Zen Garden</h1>
      </header>

      {/* Mode Status */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg flex items-center gap-2">
        <MousePointer2 size={14} className="text-emerald-400" />
        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Click anywhere to plant</span>
      </div>

      {/* Day Night System */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium flex items-center gap-2">
            {timeOfDay > 6 && timeOfDay < 18 ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-blue-300" />}
            Time: {Math.floor(timeOfDay).toString().padStart(2, '0')}:00
          </label>
        </div>
        <input 
          type="range" 
          min="0" max="24" step="0.5" 
          value={timeOfDay} 
          onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
          className="w-full accent-pink-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </section>

      {/* AI Inspiration */}
      <section className="bg-white/5 p-4 rounded-xl border border-white/5">
        <label className="text-xs uppercase tracking-widest text-pink-400 font-bold mb-2 block">AI Botanical Dream</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Dream up a flower..." 
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAIDream()}
          />
          <button 
            onClick={handleAIDream}
            disabled={isAiLoading}
            className="p-2 bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors disabled:opacity-50"
          >
            {isAiLoading ? <Wind className="animate-spin" size={18} /> : <Sparkles size={18} />}
          </button>
        </div>
      </section>

      {/* Flower Editor */}
      <section className="space-y-4">
        <label className="text-xs uppercase tracking-widest text-pink-400 font-bold block">Flower Architect</label>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/60">Petal Shape</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PetalShape).map(shape => (
                <button 
                  key={shape}
                  onClick={() => setCurrentConfig({...currentConfig, petalShape: shape})}
                  className={`text-[10px] px-2 py-1.5 rounded border transition-all ${currentConfig.petalShape === shape ? 'bg-pink-600 border-pink-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-white/60 mb-1 block">Petal Color</span>
              <input 
                type="color" 
                value={currentConfig.petalColor}
                onChange={(e) => setCurrentConfig({...currentConfig, petalColor: e.target.value})}
                className="w-full h-8 rounded-lg bg-white/5 cursor-pointer border border-white/10"
              />
            </div>
            <div>
              <span className="text-xs text-white/60 mb-1 block">Center Color</span>
              <input 
                type="color" 
                value={currentConfig.centerColor}
                onChange={(e) => setCurrentConfig({...currentConfig, centerColor: e.target.value})}
                className="w-full h-8 rounded-lg bg-white/5 cursor-pointer border border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Petal Count</span>
              <span className="text-pink-400 font-bold">{currentConfig.petalCount}</span>
            </div>
            <input 
              type="range" min="3" max="48" 
              value={currentConfig.petalCount}
              onChange={(e) => setCurrentConfig({...currentConfig, petalCount: parseInt(e.target.value)})}
              className="w-full accent-pink-500 h-1.5 bg-white/10 rounded-full appearance-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Stem Height</span>
              <span className="text-pink-400 font-bold">{currentConfig.stemHeight}m</span>
            </div>
            <input 
              type="range" min="1" max="15" step="0.1"
              value={currentConfig.stemHeight}
              onChange={(e) => setCurrentConfig({...currentConfig, stemHeight: parseFloat(e.target.value)})}
              className="w-full accent-pink-500 h-1.5 bg-white/10 rounded-full appearance-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Leaf Count</span>
              <span className="text-pink-400 font-bold">{currentConfig.leafCount}</span>
            </div>
            <input 
              type="range" min="0" max="10" 
              value={currentConfig.leafCount}
              onChange={(e) => setCurrentConfig({...currentConfig, leafCount: parseInt(e.target.value)})}
              className="w-full accent-pink-500 h-1.5 bg-white/10 rounded-full appearance-none"
            />
          </div>
        </div>
      </section>

      <footer className="flex gap-2 pt-4 border-t border-white/10 sticky bottom-0 bg-black/0 pb-2">
        <button 
          onClick={handlePlantClick}
          className="flex-1 bg-pink-600 hover:bg-pink-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-pink-900/20"
        >
          <Plus size={18} /> Plant Randomly
        </button>
        <button 
          onClick={onClear}
          className="p-3 bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl transition-all"
          title="Clear Garden"
        >
          <Trash2 size={20} />
        </button>
      </footer>
    </div>
  );
};

export default ControlPanel;
