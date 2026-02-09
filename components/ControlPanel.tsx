
import React, { useState } from 'react';
import { FlowerConfig, PetalShape, LeafShape } from '../types';
import { Flower as FlowerIcon, Sun, Moon, Sparkles, Plus, Trash2, Wind, MousePointer2, Shuffle, Dices } from 'lucide-react';
import { generateAIFlower } from '../services/geminiService';

interface ControlPanelProps {
  timeOfDay: number;
  setTimeOfDay: (t: number) => void;
  onPlant: () => void;
  onClear: () => void;
  onConfigChange: (config: Omit<FlowerConfig, 'id' | 'position'>) => void;
  currentConfig: Omit<FlowerConfig, 'id' | 'position'>;
  isRandomMode: boolean;
  setIsRandomMode: (v: boolean) => void;
  onShuffle: () => void;
}

const petalShapeLabels: Record<PetalShape, string> = {
  [PetalShape.ROUND]: '圆润',
  [PetalShape.POINTY]: '尖尖',
  [PetalShape.HEART]: '爱心',
  [PetalShape.SLENDER]: '纤细',
};

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  timeOfDay, setTimeOfDay, onPlant, onClear, onConfigChange, 
  currentConfig, isRandomMode, setIsRandomMode, onShuffle 
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const handleAIDream = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    const aiParams = await generateAIFlower(aiPrompt);
    onConfigChange({ ...currentConfig, ...aiParams });
    setIsAiLoading(false);
    setIsRandomMode(false); 
  };

  const updateConfig = (updates: Partial<Omit<FlowerConfig, 'id' | 'position'>>) => {
    onConfigChange({ ...currentConfig, ...updates });
  };

  return (
    <div className="absolute top-4 left-4 w-72 max-h-[92vh] overflow-y-auto bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border-2 border-white/30 flex flex-col gap-5 scrollbar-hide select-none ring-2 ring-pink-500/10">
      <header className="flex items-center justify-between border-b-2 border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg">
            <FlowerIcon className="text-white" size={18} />
          </div>
          <h1 className="text-base font-black tracking-tighter text-white italic">
            造物工坊
          </h1>
        </div>
        <button 
          onClick={onShuffle}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white active:scale-90 border border-white/20"
          title="随机打乱"
        >
          <Shuffle size={16} />
        </button>
      </header>

      {/* 模式选择 - 尺寸回归正常 */}
      <section className="bg-slate-950 p-1 rounded-xl flex border border-white/10">
        <button 
          onClick={() => setIsRandomMode(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all ${isRandomMode ? 'bg-purple-600 text-white shadow-lg border border-white/20' : 'text-white/40 hover:text-white'}`}
        >
          <Dices size={14} /> 随机
        </button>
        <button 
          onClick={() => setIsRandomMode(false)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all ${!isRandomMode ? 'bg-emerald-600 text-white shadow-lg border border-white/20' : 'text-white/40 hover:text-white'}`}
        >
          <MousePointer2 size={14} /> 设计
        </button>
      </section>

      {/* 状态提示 */}
      <div className={`px-3 py-2 rounded-xl flex items-center gap-2 border-2 transition-all duration-500 ${isRandomMode ? 'bg-purple-600/20 border-purple-400/50' : 'bg-emerald-600/20 border-emerald-400/50'}`}>
        {isRandomMode ? <Sparkles size={16} className="text-purple-300 animate-pulse" /> : <MousePointer2 size={16} className="text-emerald-300" />}
        <span className="text-[10px] font-black tracking-widest uppercase text-white">
          {isRandomMode ? "随机盲盒模式" : "设计师模式"}
        </span>
      </div>

      {/* 昼夜调节 */}
      <section className="bg-slate-800/50 p-3 rounded-xl border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-black flex items-center gap-2 text-white/90">
            {timeOfDay > 6 && timeOfDay < 18 ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-blue-200" />}
            场景时间: <span className="text-sm text-pink-400 font-mono">{Math.floor(timeOfDay).toString().padStart(2, '0')}:00</span>
          </label>
        </div>
        <input 
          type="range" min="0" max="24" step="0.5" 
          value={timeOfDay} 
          onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
          className="w-full accent-pink-500 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer"
        />
      </section>

      {/* AI 灵感 */}
      <section className="bg-indigo-900/40 p-3 rounded-2xl border border-indigo-400/30">
        <label className="text-[10px] uppercase font-black mb-2 block text-indigo-200 tracking-wider">✨ AI 梦幻造物</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="描述你想见到的花..." 
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-white transition-all text-white placeholder:text-white/30"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAIDream()}
          />
          <button 
            onClick={handleAIDream}
            disabled={isAiLoading}
            className="p-1.5 bg-white text-indigo-900 hover:bg-pink-100 rounded-lg transition-all active:scale-90"
          >
            {isAiLoading ? <Wind className="animate-spin" size={16} /> : <Sparkles size={16} />}
          </button>
        </div>
      </section>

      {/* 设计参数 - 重点缩小区域 */}
      <section className={`space-y-4 transition-all duration-500 ${isRandomMode ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
        <div className="flex justify-between items-center px-1">
          <label className="text-[11px] uppercase font-black tracking-widest text-emerald-400">培育参数面板</label>
        </div>
        
        <div className="space-y-4 bg-slate-800/80 p-4 rounded-2xl border border-white/10">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-white/60 font-black uppercase">花瓣造型</span>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(PetalShape).map(shape => (
                <button 
                  key={shape}
                  onClick={() => updateConfig({ petalShape: shape })}
                  className={`text-[10px] font-black py-2 rounded-lg border transition-all ${currentConfig.petalShape === shape ? 'bg-emerald-500 border-white text-white' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                >
                  {petalShapeLabels[shape]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/50 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/50 font-black uppercase mb-1 block text-center">花瓣色</span>
              <input 
                type="color" 
                value={currentConfig.petalColor}
                onChange={(e) => updateConfig({ petalColor: e.target.value })}
                className="w-full h-8 rounded-md bg-transparent cursor-pointer border-none"
              />
            </div>
            <div className="bg-slate-900/50 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-white/50 font-black uppercase mb-1 block text-center">核心色</span>
              <input 
                type="color" 
                value={currentConfig.centerColor}
                onChange={(e) => updateConfig({ centerColor: e.target.value })}
                className="w-full h-8 rounded-md bg-transparent cursor-pointer border-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Slider label="稠密度" min={3} max={64} value={currentConfig.petalCount} onChange={v => updateConfig({ petalCount: v })} />
            <Slider label="植株高度" min={1} max={15} step={0.1} value={currentConfig.stemHeight} suffix="M" onChange={v => updateConfig({ stemHeight: v })} />
            <Slider label="叶片密度" min={0} max={10} value={currentConfig.leafCount} onChange={v => updateConfig({ leafCount: v })} />
          </div>
        </div>
      </section>

      {/* 底部按钮 */}
      <footer className="flex gap-2 pt-3 border-t border-white/10 sticky bottom-0 bg-slate-900 pb-1">
        <button 
          onClick={onPlant}
          className="flex-[3] bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 py-3 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-pink-500/20"
        >
          <Plus size={18} /> 播种生命
        </button>
        <button 
          onClick={onClear}
          className="flex-1 p-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/50 rounded-xl transition-all flex items-center justify-center"
        >
          <Trash2 size={18} />
        </button>
      </footer>
    </div>
  );
};

const Slider = ({ label, min, max, step = 1, value, suffix = "", onChange }: { label: string, min: number, max: number, step?: number, value: number, suffix?: string, onChange: (v: number) => void }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] text-white/80 font-black tracking-widest">
      <span>{label}</span>
      <span className="text-pink-400 font-mono">{value}{suffix}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-pink-500 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer"
    />
  </div>
);

export default ControlPanel;
