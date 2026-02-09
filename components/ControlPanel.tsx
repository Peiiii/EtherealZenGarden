
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
    <div className="absolute top-4 left-4 w-72 max-h-[92vh] overflow-y-auto bg-slate-900 text-white p-5 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border-2 border-white/40 flex flex-col gap-5 scrollbar-hide select-none ring-1 ring-white/10">
      <header className="flex items-center justify-between border-b-2 border-white/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg border border-white/30">
            <FlowerIcon className="text-white" size={18} />
          </div>
          <h1 className="text-base font-black tracking-tighter text-white italic drop-shadow-md">
            造物工坊
          </h1>
        </div>
        <button 
          onClick={onShuffle}
          className="p-1.5 bg-white/10 hover:bg-white/30 rounded-full transition-all text-white active:scale-90 border border-white/40 shadow-sm"
          title="随机打乱"
        >
          <Shuffle size={16} />
        </button>
      </header>

      {/* 模式选择 - 强化对比度 */}
      <section className="bg-slate-950 p-1 rounded-xl flex border border-white/20">
        <button 
          onClick={() => setIsRandomMode(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all ${isRandomMode ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-white/50' : 'text-white/50 hover:text-white'}`}
        >
          <Dices size={14} /> 随机
        </button>
        <button 
          onClick={() => setIsRandomMode(false)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all ${!isRandomMode ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-white/50' : 'text-white/50 hover:text-white'}`}
        >
          <MousePointer2 size={14} /> 设计
        </button>
      </section>

      {/* 状态提示 - 增加亮色背景 */}
      <div className={`px-3 py-2 rounded-xl flex items-center gap-2 border-2 shadow-inner transition-all duration-500 ${isRandomMode ? 'bg-purple-900/60 border-purple-400' : 'bg-emerald-900/60 border-emerald-400'}`}>
        {isRandomMode ? <Sparkles size={16} className="text-white animate-pulse" /> : <MousePointer2 size={16} className="text-white" />}
        <span className="text-[10px] font-black tracking-widest uppercase text-white drop-shadow-sm">
          {isRandomMode ? "创世之手：随机培育" : "工匠之心：精密调校"}
        </span>
      </div>

      {/* 昼夜调节 - 强化文字亮度 */}
      <section className="bg-slate-800 p-3 rounded-xl border border-white/20 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-black flex items-center gap-2 text-white">
            {timeOfDay > 6 && timeOfDay < 18 ? <Sun size={14} className="text-yellow-300 fill-yellow-300" /> : <Moon size={14} className="text-blue-300 fill-blue-300" />}
            场景时间: <span className="text-sm text-pink-300 font-mono font-bold">{Math.floor(timeOfDay).toString().padStart(2, '0')}:00</span>
          </label>
        </div>
        <input 
          type="range" min="0" max="24" step="0.5" 
          value={timeOfDay} 
          onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
          className="w-full accent-pink-400 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer border border-white/10 shadow-inner"
        />
      </section>

      {/* AI 灵感 - 提升背景明度 */}
      <section className="bg-indigo-800 p-3 rounded-2xl border border-white/30 shadow-lg">
        <label className="text-[10px] uppercase font-black mb-2 block text-white tracking-wider drop-shadow-sm">✨ AI 梦幻造物</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="描述你的奇幻花朵..." 
            className="flex-1 bg-slate-900 border border-white/40 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-white transition-all text-white placeholder:text-white/40"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAIDream()}
          />
          <button 
            onClick={handleAIDream}
            disabled={isAiLoading}
            className="p-1.5 bg-white text-indigo-900 hover:bg-pink-100 rounded-lg transition-all active:scale-90 shadow-md border border-white/50"
          >
            {isAiLoading ? <Wind className="animate-spin" size={16} /> : <Sparkles size={16} />}
          </button>
        </div>
      </section>

      {/* 设计参数 - 核心：彻底告别黑黢黢 */}
      <section className={`space-y-4 transition-all duration-500 ${isRandomMode ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex justify-between items-center px-1">
          <label className="text-[11px] uppercase font-black tracking-widest text-emerald-300 drop-shadow-sm">高级培育面板</label>
          {!isRandomMode && <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black animate-pulse border border-white/30">激活中</span>}
        </div>
        
        <div className="space-y-4 bg-slate-700 p-4 rounded-2xl border-2 border-white/40 shadow-xl">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-white font-black uppercase tracking-wide">花瓣造型款式</span>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(PetalShape).map(shape => (
                <button 
                  key={shape}
                  onClick={() => updateConfig({ petalShape: shape })}
                  className={`text-[10px] font-black py-2 rounded-lg border-2 transition-all ${currentConfig.petalShape === shape ? 'bg-emerald-400 border-white text-white shadow-md' : 'bg-slate-800 border-white/10 text-white/70 hover:text-white hover:bg-slate-600'}`}
                >
                  {petalShapeLabels[shape]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800 p-2 rounded-xl border-2 border-white/20 shadow-inner">
              <span className="text-[9px] text-white font-black uppercase mb-1 block text-center">花瓣色</span>
              <input 
                type="color" 
                value={currentConfig.petalColor}
                onChange={(e) => updateConfig({ petalColor: e.target.value })}
                className="w-full h-10 rounded-md bg-transparent cursor-pointer border-2 border-white/30"
              />
            </div>
            <div className="bg-slate-800 p-2 rounded-xl border-2 border-white/20 shadow-inner">
              <span className="text-[9px] text-white font-black uppercase mb-1 block text-center">核心色</span>
              <input 
                type="color" 
                value={currentConfig.centerColor}
                onChange={(e) => updateConfig({ centerColor: e.target.value })}
                className="w-full h-10 rounded-md bg-transparent cursor-pointer border-2 border-white/30"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Slider label="稠密度" min={3} max={64} value={currentConfig.petalCount} onChange={v => updateConfig({ petalCount: v })} />
            <Slider label="植株高度" min={1} max={15} step={0.1} value={currentConfig.stemHeight} suffix="M" onChange={v => updateConfig({ stemHeight: v })} />
            <Slider label="叶片密度" min={0} max={10} value={currentConfig.leafCount} onChange={v => updateConfig({ leafCount: v })} />
          </div>
        </div>
      </section>

      {/* 底部按钮 - 高亮粉色渐变 */}
      <footer className="flex gap-2 pt-3 border-t border-white/30 sticky bottom-0 bg-slate-900 pb-1">
        <button 
          onClick={onPlant}
          className="flex-[3] bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-125 py-3.5 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_5px_20px_rgba(236,72,153,0.4)] border border-white/30"
        >
          <Plus size={18} className="drop-shadow-sm" /> 播种生命
        </button>
        <button 
          onClick={onClear}
          className="flex-1 p-3.5 bg-red-600 hover:bg-red-500 text-white border-2 border-white/20 rounded-xl transition-all shadow-lg flex items-center justify-center"
          title="清空花园"
        >
          <Trash2 size={18} />
        </button>
      </footer>
    </div>
  );
};

const Slider = ({ label, min, max, step = 1, value, suffix = "", onChange }: { label: string, min: number, max: number, step?: number, value: number, suffix?: string, onChange: (v: number) => void }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[11px] text-white font-black tracking-widest drop-shadow-sm">
      <span>{label}</span>
      <span className="text-yellow-300 font-mono text-xs">{value}{suffix}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-yellow-400 h-2 bg-slate-900 rounded-full appearance-none cursor-pointer border border-white/20 shadow-inner"
    />
  </div>
);

export default ControlPanel;
