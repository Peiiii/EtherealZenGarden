
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
    <div className="absolute top-4 left-4 w-80 max-h-[92vh] overflow-y-auto bg-slate-900 text-white p-5 rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.9)] border-4 border-white/20 flex flex-col gap-6 scrollbar-hide select-none ring-2 ring-white/5">
      <header className="flex items-center justify-between border-b-2 border-white/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.6)] border-2 border-white/40">
            <FlowerIcon className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-black tracking-widest text-white uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            造物工坊
          </h1>
        </div>
        <button 
          onClick={onShuffle}
          className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all text-white active:scale-90 border-2 border-white/40 shadow-lg"
        >
          <Shuffle size={18} />
        </button>
      </header>

      {/* 模式切换 - 高亮对比 */}
      <section className="bg-black/60 p-1.5 rounded-2xl flex border-2 border-white/20 shadow-inner">
        <button 
          onClick={() => setIsRandomMode(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${isRandomMode ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] border-2 border-white' : 'text-white/40 hover:text-white'}`}
        >
          <Dices size={16} /> 随机
        </button>
        <button 
          onClick={() => setIsRandomMode(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${!isRandomMode ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] border-2 border-white' : 'text-white/40 hover:text-white'}`}
        >
          <MousePointer2 size={16} /> 设计
        </button>
      </section>

      {/* 状态指示器 - 鲜艳明亮 */}
      <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 border-2 shadow-2xl transition-all duration-500 ${isRandomMode ? 'bg-purple-600 border-white' : 'bg-emerald-600 border-white'}`}>
        {isRandomMode ? <Sparkles size={20} className="text-white animate-pulse" /> : <MousePointer2 size={20} className="text-white" />}
        <span className="text-[11px] font-black tracking-widest uppercase text-white drop-shadow-md">
          {isRandomMode ? "随机创世：充满惊喜" : "精密设计：定义完美"}
        </span>
      </div>

      {/* 昼夜系统 */}
      <section className="bg-white/10 p-4 rounded-2xl border-2 border-white/20 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-black flex items-center gap-3 text-white">
            {timeOfDay > 6 && timeOfDay < 18 ? <Sun size={20} className="text-yellow-400 fill-yellow-400" /> : <Moon size={20} className="text-blue-300 fill-blue-300" />}
            场景时间: <span className="text-base text-pink-400 font-mono font-black drop-shadow-sm">{Math.floor(timeOfDay).toString().padStart(2, '0')}:00</span>
          </label>
        </div>
        <input 
          type="range" min="0" max="24" step="0.5" 
          value={timeOfDay} 
          onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
          className="w-full accent-pink-500 h-3 bg-black/40 rounded-full appearance-none cursor-pointer border border-white/20"
        />
      </section>

      {/* AI 功能区 */}
      <section className="bg-indigo-600 p-4 rounded-2xl border-2 border-white shadow-xl">
        <label className="text-[10px] uppercase font-black mb-2 block text-white tracking-widest drop-shadow-md">✨ AI 灵感激发</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="描述一朵花..." 
            className="flex-1 bg-white text-slate-900 border-2 border-slate-900 rounded-lg px-3 py-2 text-xs font-black focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all placeholder:text-slate-400"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAIDream()}
          />
          <button 
            onClick={handleAIDream}
            disabled={isAiLoading}
            className="p-2 bg-white text-indigo-900 hover:bg-pink-100 rounded-lg transition-all border-2 border-slate-900 shadow-lg"
          >
            {isAiLoading ? <Wind className="animate-spin" size={20} /> : <Sparkles size={20} />}
          </button>
        </div>
      </section>

      {/* 设计面板 - 核心修复点：告别黑黢黢 */}
      <section className={`space-y-5 transition-all duration-500 ${isRandomMode ? 'opacity-60 grayscale-[0.3]' : 'opacity-100'}`}>
        <div className="flex justify-between items-center px-1">
          <label className="text-[13px] uppercase font-black tracking-[0.2em] text-pink-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">高级培育面板</label>
          {!isRandomMode && <span className="text-[9px] bg-white text-emerald-600 px-2 py-0.5 rounded-full font-black border-2 border-emerald-500 animate-pulse shadow-md">EDITING</span>}
        </div>
        
        <div className="space-y-6 bg-white/10 p-5 rounded-[2rem] border-4 border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* 花瓣造型 */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] text-white font-black uppercase tracking-wider">花瓣造型款式</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PetalShape).map(shape => (
                <button 
                  key={shape}
                  onClick={() => updateConfig({ petalShape: shape })}
                  className={`text-[11px] font-black py-3 rounded-xl border-2 transition-all shadow-md ${currentConfig.petalShape === shape ? 'bg-emerald-500 border-white text-white shadow-[0_0_15px_rgba(52,211,153,0.8)]' : 'bg-white/10 border-white/30 text-white/90 hover:bg-white/30'}`}
                >
                  {petalShapeLabels[shape]}
                </button>
              ))}
            </div>
          </div>

          {/* 颜色选择器 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 p-3 rounded-2xl border-2 border-white/30 shadow-inner">
              <span className="text-[10px] text-white font-black uppercase mb-2 block text-center tracking-tighter">花瓣主色</span>
              <input 
                type="color" 
                value={currentConfig.petalColor}
                onChange={(e) => updateConfig({ petalColor: e.target.value })}
                className="w-full h-12 rounded-lg bg-transparent cursor-pointer border-2 border-white/50 shadow-lg"
              />
            </div>
            <div className="bg-black/40 p-3 rounded-2xl border-2 border-white/30 shadow-inner">
              <span className="text-[10px] text-white font-black uppercase mb-2 block text-center tracking-tighter">核心色调</span>
              <input 
                type="color" 
                value={currentConfig.centerColor}
                onChange={(e) => updateConfig({ centerColor: e.target.value })}
                className="w-full h-12 rounded-lg bg-transparent cursor-pointer border-2 border-white/50 shadow-lg"
              />
            </div>
          </div>

          {/* 滑块区域 */}
          <div className="space-y-5">
            <Slider label="稠密度" min={3} max={64} value={currentConfig.petalCount} onChange={v => updateConfig({ petalCount: v })} />
            <Slider label="植株高度" min={1} max={15} step={0.1} value={currentConfig.stemHeight} suffix="M" onChange={v => updateConfig({ stemHeight: v })} />
            <Slider label="叶片密度" min={0} max={10} value={currentConfig.leafCount} onChange={v => updateConfig({ leafCount: v })} />
          </div>
        </div>
      </section>

      {/* 播种按钮 */}
      <footer className="flex gap-2 pt-4 border-t-2 border-white/30 sticky bottom-0 bg-slate-900 pb-2">
        <button 
          onClick={onPlant}
          className="flex-[3] bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-125 py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_30px_rgba(236,72,153,0.5)] border-2 border-white"
        >
          <Plus size={20} className="drop-shadow-md" /> 播种生命
        </button>
        <button 
          onClick={onClear}
          className="flex-1 p-4 bg-red-600 hover:bg-red-500 text-white border-2 border-white rounded-2xl transition-all shadow-xl flex items-center justify-center"
          title="清空花园"
        >
          <Trash2 size={20} />
        </button>
      </footer>
    </div>
  );
};

const Slider = ({ label, min, max, step = 1, value, suffix = "", onChange }: { label: string, min: number, max: number, step?: number, value: number, suffix?: string, onChange: (v: number) => void }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[11px] text-white font-black tracking-widest">
      <span className="drop-shadow-md">{label}</span>
      {/* 修复：使用 toFixed(1) 解决长浮点数显示问题 */}
      <span className="text-yellow-400 font-mono text-sm bg-black/40 px-2 py-0.5 rounded border border-white/20 shadow-sm">
        {typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}{suffix}
      </span>
    </div>
    <div className="relative flex items-center h-4">
      <input 
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-yellow-400 h-2.5 bg-black/60 rounded-full appearance-none cursor-pointer border border-white/30 shadow-inner"
      />
    </div>
  </div>
);

export default ControlPanel;
