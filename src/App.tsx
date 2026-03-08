/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, RotateCcw, User, Users, Info, HelpCircle, ArrowRight } from 'lucide-react';
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

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);
  const [gender, setGender] = useState<Gender>(1); // Default to male speaker
  const [mode, setMode] = useState<'chain' | 'reverse'>('chain'); // chain: A的B, reverse: 稱呼A為什麼

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
        type: 'chain'
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
          
          {/* Display Area */}
          <div className="min-h-[120px] flex flex-col justify-end items-end text-right">
            <div className="text-zinc-400 text-sm mb-1 overflow-x-auto whitespace-nowrap w-full scrollbar-hide">
              {query || '請輸入關係鏈...'}
            </div>
            <AnimatePresence mode="wait">
              <motion.div 
                key={result.join(',')}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl font-bold text-emerald-400 break-all"
              >
                {result.length > 0 ? result.join(' / ') : '？'}
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
              className="col-span-2 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-200"
              onClick={() => {
                // Calculation is reactive, but we can show a "copied" or similar feedback
              }}
            >
              <ArrowRight className="w-5 h-5" />
              計算
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 bg-white border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-zinc-400 text-xs">
            <Info className="w-3 h-3" />
            <span>支援台灣常用親戚稱謂</span>
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
          {['爸爸的弟弟的小孩', '媽媽的姐姐', '老婆的爸爸'].map(ex => (
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
