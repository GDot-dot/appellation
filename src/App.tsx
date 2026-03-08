/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, RotateCcw, User, Users, Info, HelpCircle, ArrowRight, Languages } from 'lucide-react';
// @ts-ignore
import relationship from 'relationship.js';

type Gender = 0 | 1; // 1 for male, 0 for female

const RELATION_BUTTONS = [
  { label: '父', value: '父', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700' },
  { label: '母', value: '母', color: 'bg-pink-100 hover:bg-pink-200 text-pink-700' },
  { label: '夫', value: '夫', color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700' },
  { label: '妻', value: '妻', color: 'bg-rose-100 hover:bg-rose-200 text-rose-700' },
  { label: '兄', value: '兄', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700' },
  { label: '姐', value: '姐', color: 'bg-teal-100 hover:bg-teal-200 text-teal-700' },
  { label: '弟', value: '弟', color: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700' },
  { label: '妹', value: '妹', color: 'bg-sky-100 hover:bg-sky-200 text-sky-700' },
  { label: '子', value: '子', color: 'bg-orange-100 hover:bg-orange-200 text-orange-700' },
  { label: '女', value: '女', color: 'bg-amber-100 hover:bg-amber-200 text-amber-700' },
];

// 台語稱呼對照表 (根據《臺灣台語常用詞辭典》)
const TAIGI_MAP: Record<string, { term: string; pinyin: string }> = {
  '曾祖父': { term: '阿祖', pinyin: 'a-tsóo' },
  '曾祖母': { term: '阿祖', pinyin: 'a-tsóo' },
  '爺爺': { term: '阿公', pinyin: 'a-kong' },
  '祖父': { term: '阿公', pinyin: 'a-kong' },
  '奶奶': { term: '阿媽', pinyin: 'a-má' },
  '祖母': { term: '阿媽', pinyin: 'a-má' },
  '外公': { term: '外公', pinyin: 'guā-kong' },
  '外祖父': { term: '外公', pinyin: 'guā-kong' },
  '外婆': { term: '外媽', pinyin: 'guā-má' },
  '外祖母': { term: '外媽', pinyin: 'guā-má' },
  '爸爸': { term: '阿爸', pinyin: 'a-pah' },
  '媽媽': { term: '阿母', pinyin: 'a-bú' },
  '伯父': { term: '阿伯', pinyin: 'a-peh' },
  '伯母': { term: '阿姆', pinyin: 'a-ḿ' },
  '叔叔': { term: '阿叔', pinyin: 'a-tsik' },
  '嬸嬸': { term: '阿嬸', pinyin: 'a-tsím' },
  '姑姑': { term: '阿姑', pinyin: 'a-koo' },
  '姑丈': { term: '姑丈', pinyin: 'koo-tiūnn' },
  '舅舅': { term: '阿舅', pinyin: 'a-kū' },
  '舅媽': { term: '妗仔', pinyin: 'kīm-á' },
  '姨媽': { term: '阿姨', pinyin: 'a-î' },
  '大姨': { term: '阿姨', pinyin: 'a-î' },
  '小姨': { term: '阿姨', pinyin: 'a-î' },
  '姨丈': { term: '姨丈', pinyin: 'î-tiūnn' },
  '哥哥': { term: '阿兄', pinyin: 'a-hiann' },
  '嫂子': { term: '阿嫂', pinyin: 'a-só' },
  '姐姐': { term: '阿姊', pinyin: 'a-tsí' },
  '姊姊': { term: '阿姊', pinyin: 'a-tsí' },
  '姐夫': { term: '姊夫', pinyin: 'tsí-hu' },
  '姊夫': { term: '姊夫', pinyin: 'tsí-hu' },
  '弟弟': { term: '小弟', pinyin: 'sió-tī' },
  '弟妹': { term: '弟婦仔', pinyin: 'tē-hū-á' },
  '弟媳': { term: '弟婦仔', pinyin: 'tē-hū-á' },
  '妹妹': { term: '小妹', pinyin: 'sió-muē' },
  '妹夫': { term: '妹婿', pinyin: 'muē-sài' },
  '妹婿': { term: '妹婿', pinyin: 'muē-sài' },
  '堂哥': { term: '叔伯大兄', pinyin: 'tsik-peh-tuā-hiann' },
  '堂姐': { term: '叔伯大姊', pinyin: 'tsik-peh-tuā-tsí' },
  '堂弟': { term: '叔伯小弟', pinyin: 'tsik-peh-sió-tī' },
  '堂妹': { term: '叔伯小妹', pinyin: 'tsik-peh-sió-muē' },
  '表哥': { term: '表兄', pinyin: 'piáu-hiann' },
  '表姐': { term: '表姊', pinyin: 'piáu-tsí' },
  '表弟': { term: '表弟', pinyin: 'piáu-tī' },
  '表妹': { term: '表妹', pinyin: 'piáu-muē' },
  '兒子': { term: '囝', pinyin: 'kiánn' },
  '媳婦': { term: '新婦', pinyin: 'sin-pū' },
  '女兒': { term: '查某囝', pinyin: 'tsa-bóo-kiánn' },
  '女婿': { term: '囝婿', pinyin: 'kiánn-sài' },
  '姪子': { term: '姪仔', pinyin: 'tit-á' },
  '姪女': { term: '查某孫仔', pinyin: 'tsa-bóo-sun-á' },
  '外甥': { term: '外甥', pinyin: 'guā-sing' },
  '外甥女': { term: '外甥女仔', pinyin: 'guā-sing-lí-á' },
  '孫子': { term: '孫', pinyin: 'sun' },
  '孫女': { term: '查某孫', pinyin: 'tsa-bóo-sun' },
  '外孫': { term: '外孫', pinyin: 'guā-sun' },
  '公公': { term: '大官', pinyin: 'ta-kuann' },
  '婆婆': { term: '大家', pinyin: 'ta-ke' },
  '大伯': { term: '大伯仔', pinyin: 'tuā-peh-á' },
  '小叔': { term: '小叔', pinyin: 'sió-tsik' },
  '大姑': { term: '大姑', pinyin: 'tuā-koo' },
  '小姑': { term: '小姑', pinyin: 'sió-koo' },
  '岳父': { term: '丈人爸', pinyin: 'tiūnn-lâng-pê' },
  '岳母': { term: '丈姆', pinyin: 'tiūnn-ḿ' },
  '大舅': { term: '大舅仔', pinyin: 'tuā-kū-á' },
  '小舅': { term: '舅仔', pinyin: 'kū-á' },
  '大姨子': { term: '姨仔', pinyin: 'î-á' },
  '小姨子': { term: '姨仔', pinyin: 'î-á' },
};

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);
  const [gender, setGender] = useState<Gender>(1); // Default to male speaker
  const [mode, setMode] = useState<'chain' | 'reverse'>('chain'); // chain: A的B, reverse: 稱呼A為什麼
  const [showTaigi, setShowTaigi] = useState<boolean>(true);

  const handleAddRelation = (val: string) => {
    setQuery(prev => prev ? `${prev}的${val}` : val);
  };

  const handleClear = () => {
    setQuery('');
    setResult([]);
  };

  const handleBackspace = () => {
    if (!query) return;
    const parts = query.split('的');
    parts.pop();
    setQuery(parts.join('的'));
  };

  useEffect(() => {
    if (!query) {
      setResult([]);
      return;
    }

    try {
      const options = {
        text: query,
        sex: gender,
        reverse: mode === 'reverse',
        type: mode === 'chain' ? 'default' : 'chain'
      };
      const res = relationship(options);
      if (Array.isArray(res)) {
        setResult(res);
      } else if (res) {
        setResult([res]);
      } else {
        setResult([]);
      }
    } catch (e) {
      setResult(['計算錯誤']);
    }
  }, [query, gender, mode]);

  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);

  const getTaigiInfo = (mandarinTerm: string) => {
    return TAIGI_MAP[mandarinTerm] || null;
  };

  const handleCalculate = () => {
    if (result.length === 0) return;
    
    // 視覺回饋：閃爍效果
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 300);

    // 功能回饋：複製到剪貼簿
    const textToCopy = result.join(' / ');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100"
      >
        {/* Header */}
        <div className="bg-zinc-900 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" />
              親戚稱呼計算器
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowTaigi(!showTaigi)}
                className={`p-2 rounded-full transition-colors ${
                  showTaigi ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'
                }`}
                title="切換台語顯示"
              >
                <Languages className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setGender(gender === 1 ? 0 : 1)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  gender === 1 ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'
                }`}
              >
                <User className="w-3 h-3" />
                {gender === 1 ? '我是男生' : '我是女生'}
              </button>
            </div>
          </div>
          
          {/* Display Area */}
          <div className="min-h-[140px] flex flex-col justify-end items-end text-right">
            <div className="text-zinc-400 text-sm mb-1 overflow-x-auto whitespace-nowrap w-full scrollbar-hide">
              {query || '請輸入關係鏈...'}
            </div>
            <AnimatePresence mode="wait">
              <motion.div 
                key={result.join(',')}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  scale: isCalculating ? 1.1 : 1,
                  color: isCalculating ? '#34d399' : '#34d399' 
                }}
                transition={{ duration: 0.1 }}
                className="w-full"
              >
                <div className="text-4xl font-bold text-emerald-400 break-all mb-2">
                  {result.length > 0 ? result.join(' / ') : '？'}
                </div>
                {showTaigi && result.length > 0 && result[0] !== '計算錯誤' && (
                  <div className="flex flex-col items-end gap-1">
                    {result.map((term, idx) => {
                      const taigi = getTaigiInfo(term);
                      if (!taigi) return null;
                      return (
                        <div key={idx} className="bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                          <span className="text-emerald-300 font-bold text-lg mr-2">{taigi.term}</span>
                          <span className="text-emerald-500/60 text-xs font-mono">{taigi.pinyin}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-zinc-50">
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setMode('chain')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === 'chain' 
                ? 'bg-white shadow-sm ring-1 ring-zinc-200 text-zinc-900' 
                : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              關係找稱呼
            </button>
            <button 
              onClick={() => setMode('reverse')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === 'reverse' 
                ? 'bg-white shadow-sm ring-1 ring-zinc-200 text-zinc-900' 
                : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              稱呼找關係
            </button>
          </div>

          <div className="calculator-grid">
            {/* Top Row Actions */}
            <button 
              onClick={handleClear}
              className="col-span-2 py-4 rounded-2xl bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              AC
            </button>
            <button 
              onClick={handleBackspace}
              className="col-span-2 py-4 rounded-2xl bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Delete className="w-5 h-5" />
              刪除
            </button>

            {/* Relation Buttons */}
            {RELATION_BUTTONS.map((btn) => (
              <button
                key={btn.value}
                onClick={() => handleAddRelation(btn.value)}
                className={`py-6 rounded-2xl text-xl font-bold transition-all active:scale-95 ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}

            {/* Special Buttons */}
            <button 
              className={`col-span-4 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                copied 
                ? 'bg-zinc-900 text-emerald-400 shadow-zinc-200' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
              }`}
              onClick={handleCalculate}
            >
              {copied ? (
                <>已複製稱呼！</>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  計算並複製
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 bg-white border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-zinc-400 text-xs">
            <Info className="w-3 h-3" />
            <span>參考《臺灣台語常用詞辭典》</span>
          </div>
          <a 
            href="https://github.com/mumuy/relationship" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      {/* Example Tips */}
      <div className="mt-8 text-center max-w-md">
        <p className="text-zinc-400 text-sm mb-2">試試看：</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['爸爸的弟弟', '老婆的爸爸', '媽媽的哥哥'].map(ex => (
            <button 
              key={ex}
              onClick={() => setQuery(ex)}
              className="px-3 py-1 bg-white border border-zinc-200 rounded-full text-xs text-zinc-600 hover:border-emerald-400 hover:text-emerald-600 transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
