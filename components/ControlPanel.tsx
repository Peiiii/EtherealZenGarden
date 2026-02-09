
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
  [PetalShape.POINTY]: '尖锐',
  [PetalShape.HEART]: '心形',
  [PetalShape.SLENDER]: '细长',
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
    <div className="absolute top-4 left-4 w-80 max-h-[95vh] overflow-y-auto bg-slate-900/95 backdrop-blur-2xl text-white p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col gap-6 scrollbar-hide select-none">
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <FlowerIcon className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">禅意花园</h1>
        </div>
        <button 
          onClick={onShuffle}
          className="p-2 hover:bg-white/20 rounded-full transition-all text-white/70 hover:text-white hover:scale-110 active:scale-90"
          title="随机打乱参数"
        >
          <Shuffle size={20} />
        </button>
      </header>

      {/* 模式切换器 */}
      <section className="bg-white/10 p-1.5 rounded-2xl flex border border-white/10 shadow-inner">
        <button 
          onClick={() => setIsRandomMode(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${isRandomMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg text-white' : 'text-white/60 hover:text-white/90 hover:bg-white/5'}`}
        >
          <Dices size={16} /> 随机模式
        </button>
        <button 
          onClick={() => setIsRandomMode(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${!isRandomMode ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg text-white' : 'text-white/60 hover:text-white/90 hover:bg-white/5'}`}
        >
          <MousePointer2 size={16} /> 设计模式
        </button>
      </section>

      {/* 模式提示 */}
      <div className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-sm ${isRandomMode ? 'bg-purple-500/20 border border-purple-500/40' : 'bg-emerald-500/20 border border-emerald-500/40'}`}>
        {isRandomMode ? (
          <>
            <Sparkles size={18} className="text-purple-300 animate-pulse" />
            <span className="text-xs font-bold text-purple-100 tracking-wide">每一次点击都是一场奇遇</span>
          </>
        ) : (
          <>
            <MousePointer2 size={18} className="text-emerald-300" />
            <span className="text-xs font-bold text-emerald-100 tracking-wide">通过面板精确培育你的花朵</span>
          </>
        )}
      </div>

      {/* 昼夜系统 */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold flex items-center gap-2 text-white/90">
            {timeOfDay > 6 && timeOfDay < 18 ? <Sun size={18} className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" /> : <Moon size={18} className="text-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.5)]" />}
            时间: <span className="text-pink-300 font-mono text-base">{Math.floor(timeOfDay).toString().padStart(2, '0')}:00</span>
          </label>
        </div>
        <input 
          type="range" min="0" max="24" step="0.5" 
          value={timeOfDay} 
          onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
          className="w-full accent-pink-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
        />
      </section>

      {/* AI 灵感 */}
      <section className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 p-5 rounded-2xl border border-white/10 shadow-lg">
        <label className="text-[11px] uppercase tracking-widest text-indigo-300 font-black mb-3 block">AI 植物造梦</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="例如：来自火星的幽灵兰花..." 
            className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all placeholder:text-white/30 text-white"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAIDream()}
          />
          <button 
            onClick={handleAIDream}
            disabled={isAiLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/40 active:scale-90"
          >
            {isAiLoading ? <Wind className="animate-spin text-white" size={20} /> : <Sparkles className="text-white" size={20} />}
          </button>
        </div>
      </section>

      {/* 编辑器 */}
      <section className={`space-y-5 transition-all duration-500 ${isRandomMode ? 'opacity-30 grayscale pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <label className="text-[11px] uppercase tracking-widest text-emerald-400 font-black">花卉实验室</label>
          {!isRandomMode && <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 rounded text-emerald-400 font-bold">实时预览</span>}
        </div>
        
        <div className="space-y-5">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs text-white/50 font-bold uppercase">花瓣形状</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PetalShape).map(shape => (
                <button 
                  key={shape}
                  onClick={() => updateConfig({ petalShape: shape })}
                  className={`text-xs font-bold px-2 py-2.5 rounded-xl border-2 transition-all ${currentConfig.petalShape === shape ? 'bg-emerald-600 border-emerald-400 text-white shadow-md' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:border-white/10 hover:text-white/80'}`}
                >
                  {petalShapeLabels[shape]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-inner">
              <span className="text-[10px] text-white/50 font-black uppercase mb-2 block">花瓣主色</span>
              <input 
                type="color" 
                value={currentConfig.petalColor}
                onChange={(e) => updateConfig({ petalColor: e.target.value })}
                className="w-full h-12 rounded-xl bg-black/40 cursor-pointer border-none shadow-sm"
              />
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-inner">
              <span className="text-[10px] text-white/50 font-black uppercase mb-2 block">花芯色彩</span>
              <input 
                type="color" 
                value={currentConfig.centerColor}
                onChange={(e) => updateConfig({ centerColor: e.target.value })}
                className="w-full h-12 rounded-xl bg-black/40 cursor-pointer border-none shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4 px-1">
            <Slider label="花瓣数量" min={3} max={64} value={currentConfig.petalCount} onChange={v => updateConfig({ petalCount: v })} />
            <Slider label="枝干高度" min={1} max={15} step={0.1} value={currentConfig.stemHeight} suffix="米" onChange={v => updateConfig({ stemHeight: v })} />
            <Slider label="叶片密度" min={0} max={10} value={currentConfig.leafCount} onChange={v => updateConfig({ leafCount: v })} />
          </div>
        </div>
      </section>

      <footer className="flex gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-slate-900/50 backdrop-blur-md pb-2">
        <button 
          onClick={onPlant}
          className="flex-[3] bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-purple-900/40 group"
        >
          <Plus size={22} className="group-hover:rotate-90 transition-transform" /> 
          即刻播种
        </button>
        <button 
          onClick={onClear}
          className="flex-1 p-4 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 rounded-2xl transition-all active:scale-90 flex items-center justify-center"
          title="清空花园"
        >
          <Trash2 size={24} />
        </button>
      </footer>
    </div>
  );
};

const Slider = ({ label, min, max, step = 1, value, suffix = "", onChange }: { label: string, min: number, max: number, step?: number, value: number, suffix?: string, onChange: (v: number) => void }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs text-white/80 font-bold tracking-wide">
      <span>{label}</span>
      <span className="text-pink-400 font-mono text-sm">{value}{suffix}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-pink-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
    />
  </div>
);

export default ControlPanel;
