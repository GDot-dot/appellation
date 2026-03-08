/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, RotateCcw, User, Users, Info, HelpCircle, ArrowRight, Languages, Grid, Network } from 'lucide-react';
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


// Helper components and constants remain outside

// 定義家族地圖的節點與座標 (x: 0-100, y: 0-100)
const TREE_NODES = [
  // 祖輩 (y: 10)
  { id: '祖父', label: '祖父', x: 15, y: 10, path: ['父', '父'], searchTerm: '祖父' },
  { id: '祖母', label: '祖母', x: 25, y: 10, path: ['父', '母'], searchTerm: '祖母' },
  { id: '外祖父', label: '外公', x: 75, y: 10, path: ['母', '父'], searchTerm: '外公' },
  { id: '外祖母', label: '外媽', x: 85, y: 10, path: ['母', '母'], searchTerm: '外婆' },
  
  // 父輩 (y: 35)
  { id: '伯父', label: '伯伯', x: 5, y: 35, path: ['父', '兄'], searchTerm: '伯伯' },
  { id: '叔叔', label: '叔叔', x: 13, y: 35, path: ['父', '弟'], searchTerm: '叔叔' },
  { id: '姑媽', label: '姑媽', x: 21, y: 35, path: ['父', '姐'], searchTerm: '姑媽' },
  { id: '姑姐', label: '姑姐', x: 29, y: 35, path: ['父', '妹'], searchTerm: '姑姑' },
  { id: '父', label: '爸爸', x: 38, y: 35, path: ['父'], searchTerm: '爸爸' },
  { id: '母', label: '媽媽', x: 62, y: 35, path: ['母'], searchTerm: '媽媽' },
  { id: '大舅', label: '大舅', x: 71, y: 35, path: ['母', '兄'], searchTerm: '大舅' },
  { id: '小舅', label: '小舅', x: 79, y: 35, path: ['母', '弟'], searchTerm: '小舅' },
  { id: '姨媽', label: '姨媽', x: 87, y: 35, path: ['母', '姐'], searchTerm: '姨媽' },
  { id: '阿姨', label: '阿姨', x: 95, y: 35, path: ['母', '妹'], searchTerm: '阿姨' },

  // 自己輩 (y: 60)
  { id: '堂親', label: '堂親', x: 9, y: 60, path: ['父', '兄', '子'], altPath: ['父', '弟', '子'], extraPaths: [['父', '兄', '女'], ['父', '弟', '女']], searchTerm: '堂哥' },
  { id: '表親1', label: '表親(姑)', x: 25, y: 60, path: ['父', '姐', '子'], altPath: ['父', '妹', '子'], extraPaths: [['父', '姐', '女'], ['父', '妹', '女']], searchTerm: '表哥' },
  { id: '哥哥', label: '哥哥', x: 33, y: 60, path: ['兄'], searchTerm: '哥哥' },
  { id: '姐姐', label: '姐姐', x: 39, y: 60, path: ['姐'], searchTerm: '姐姐' },
  { id: '夫', label: '夫', x: 45, y: 60, path: ['夫'], searchTerm: '老公' },
  { id: '我', label: '我', x: 50, y: 60, path: [], searchTerm: '' },
  { id: '妻', label: '妻', x: 55, y: 60, path: ['妻'], searchTerm: '老婆' },
  { id: '弟弟', label: '弟弟', x: 61, y: 60, path: ['弟'], searchTerm: '弟弟' },
  { id: '妹妹', label: '妹妹', x: 67, y: 60, path: ['妹'], searchTerm: '妹妹' },
  { id: '表親2', label: '表親(舅)', x: 75, y: 60, path: ['母', '兄', '子'], altPath: ['母', '弟', '子'], extraPaths: [['母', '兄', '女'], ['母', '弟', '女']], searchTerm: '表哥' },
  { id: '表親3', label: '表親(姨)', x: 91, y: 60, path: ['母', '姐', '子'], altPath: ['母', '妹', '子'], extraPaths: [['母', '姐', '女'], ['母', '妹', '女']], searchTerm: '表哥' },

  // 子輩 (y: 85)
  { id: '姪子', label: '姪子/女', x: 35, y: 85, path: ['兄', '子'], altPath: ['弟', '子'], extraPaths: [['兄', '女'], ['弟', '女']], searchTerm: '姪子' },
  { id: '子', label: '兒子', x: 45, y: 85, path: ['子'], searchTerm: '兒子' },
  { id: '女', label: '女兒', x: 55, y: 85, path: ['女'], searchTerm: '女兒' },
  { id: '外甥', label: '外甥/女', x: 65, y: 85, path: ['姐', '子'], altPath: ['妹', '子'], extraPaths: [['姐', '女'], ['妹', '女']], searchTerm: '外甥' },
];

// 定義節點間的連線
const CONNECTIONS = [
  { from: '祖父', to: '父' }, { from: '祖母', to: '父' },
  { from: '祖父', to: '伯父' }, { from: '祖母', to: '伯父' },
  { from: '祖父', to: '叔叔' }, { from: '祖母', to: '叔叔' },
  { from: '祖父', to: '姑媽' }, { from: '祖母', to: '姑媽' },
  { from: '祖父', to: '姑姐' }, { from: '祖母', to: '姑姐' },
  { from: '外祖父', to: '母' }, { from: '外祖母', to: '母' },
  { from: '外祖父', to: '大舅' }, { from: '外祖母', to: '大舅' },
  { from: '外祖父', to: '小舅' }, { from: '外祖母', to: '小舅' },
  { from: '外祖父', to: '姨媽' }, { from: '外祖母', to: '姨媽' },
  { from: '外祖父', to: '阿姨' }, { from: '外祖母', to: '阿姨' },
  { from: '父', to: '我' }, { from: '母', to: '我' },
  { from: '我', to: '父' }, { from: '我', to: '母' },
  { from: '我', to: '哥哥' }, { from: '我', to: '姐姐' },
  { from: '我', to: '弟弟' }, { from: '我', to: '妹妹' },
  { from: '我', to: '夫' }, { from: '我', to: '妻' },
  { from: '父', to: '伯父' }, { from: '父', to: '叔叔' },
  { from: '父', to: '姑媽' }, { from: '父', to: '姑姐' },
  { from: '母', to: '大舅' }, { from: '母', to: '小舅' },
  { from: '母', to: '姨媽' }, { from: '母', to: '阿姨' },
  { from: '父', to: '哥哥' }, { from: '母', to: '哥哥' },
  { from: '父', to: '姐姐' }, { from: '母', to: '姐姐' },
  { from: '父', to: '弟弟' }, { from: '母', to: '弟弟' },
  { from: '父', to: '妹妹' }, { from: '母', to: '妹妹' },
  { from: '伯父', to: '堂親' }, { from: '叔叔', to: '堂親' },
  { from: '姑媽', to: '表親1' }, { from: '姑姐', to: '表親1' },
  { from: '大舅', to: '表親2' }, { from: '小舅', to: '表親2' },
  { from: '姨媽', to: '表親3' }, { from: '阿姨', to: '表親3' },
  { from: '哥哥', to: '姪子' }, { from: '弟弟', to: '姪子' },
  { from: '姐姐', to: '外甥' }, { from: '妹妹', to: '外甥' },
  { from: '我', to: '子' },
  { from: '我', to: '女' },
];

const normalize = (s: string) => {
  if (!s) return '';
  return s
    .replace(/爸爸/g, '父')
    .replace(/媽媽/g, '母')
    .replace(/哥哥/g, '兄')
    .replace(/姐姐/g, '姐')
    .replace(/姊姊/g, '姐')
    .replace(/弟弟/g, '弟')
    .replace(/妹妹/g, '妹')
    .replace(/兒子/g, '子')
    .replace(/女兒/g, '女')
    .replace(/老婆/g, '妻')
    .replace(/老公/g, '夫');
};

const TreeNode = ({ node, active, target, onClick, isLarge }: { node: any; active: boolean; target: boolean; onClick: () => void; isLarge?: boolean }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.1, zIndex: 10 }}
    whileTap={{ scale: 0.9 }}
    animate={{ 
      scale: target ? 1.2 : 1,
      backgroundColor: target ? '#10b981' : active ? '#3f3f46' : '#18181b',
      borderColor: target ? '#34d399' : active ? '#52525b' : '#27272a',
      boxShadow: target ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none'
    }}
    className={`
      ${isLarge ? 'w-16 h-16 rounded-2xl' : 'w-12 h-12 rounded-xl'}
      border flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
      ${target ? 'text-white' : active ? 'text-zinc-200' : 'text-zinc-600'}
      select-none
    `}
  >
    <span className={`${isLarge ? 'text-[11px]' : 'text-[9px]'} font-bold leading-tight text-center px-1`}>{node.label}</span>
    {target && active && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-1 h-1 rounded-full bg-white mt-1"
      />
    )}
  </motion.div>
);

const FamilyTreeVisualizer = ({ 
  show, 
  query, 
  mode, 
  result, 
  isTreeFullscreen, 
  setIsTreeFullscreen, 
  setQuery, 
  setShowTree 
}: { 
  show: boolean; 
  query: string; 
  mode: string; 
  result: string[]; 
  isTreeFullscreen: boolean; 
  setIsTreeFullscreen: (v: boolean) => void; 
  setQuery: (v: string | ((p: string) => string)) => void; 
  setShowTree: (v: boolean) => void; 
}) => {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  if (!show) return null;

  const nQuery = normalize(query);
  const activeChain = mode === 'chain' 
    ? nQuery 
    : (result.length > 0 && result[0] !== '計算錯誤' ? normalize(result[0]) : '');

  // Pre-calculate active paths for performance
  const activePathsSet = new Set<string>();
  if (activeChain) {
    const parts = activeChain.split('的');
    let current = '';
    parts.forEach((part, i) => {
      current = current ? `${current}的${part}` : part;
      activePathsSet.add(current);
    });
  }

  const getPaths = (node: any) => {
    return [node.path, node.altPath, ...(node.extraPaths || [])].filter(Boolean).map(p => p.join('的'));
  };
  
  const isNodeActive = (node: any) => {
    if (node.id === '我') return true;
    if (!activeChain) return false;

    const nodePaths = getPaths(node);
    // If any of the node's paths are a prefix of the active chain
    return nodePaths.some(p => activePathsSet.has(p));
  };

  const isTargetNode = (node: any) => {
    if (!activeChain) return false;
    const nodePaths = getPaths(node);
    return nodePaths.some(p => activeChain === p);
  };

  const handleNodeClick = (node: any) => {
    if (isDragging) return;
    if (mode === 'chain') {
      const path = node.path.join('的');
      if (path) {
        setQuery(path);
        setShowTree(true);
      } else if (node.id === '我') {
        setQuery('');
      }
    } else {
      if (node.searchTerm) {
        setQuery(node.searchTerm);
        setShowTree(true);
      }
    }
  };

  const isConnectionActive = (fromId: string, toId: string) => {
    const fromNode = TREE_NODES.find(n => n.id === fromId);
    const toNode = TREE_NODES.find(n => n.id === toId);
    if (!fromNode || !toNode) return false;
    return isNodeActive(fromNode) && isNodeActive(toNode);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const resetView = () => {
    setZoom(1);
  };

  return (
    <>
      {/* Placeholder to prevent layout jump when going fullscreen */}
      {isTreeFullscreen && <div className="mt-6 h-[400px] w-full" />}
      
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          ${isTreeFullscreen 
            ? 'fixed inset-0 z-50 bg-zinc-950 p-6 flex flex-col' 
            : 'mt-6 p-4 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-inner relative min-h-[400px]'
          }
          overflow-hidden
        `}
      >
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            家族關係圖譜
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex bg-zinc-800 rounded-lg overflow-hidden mr-2">
              <button 
                onClick={() => handleZoom(0.2)}
                className="p-2 hover:bg-zinc-700 text-zinc-400 transition-colors border-r border-zinc-700"
                title="放大"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
              <button 
                onClick={() => handleZoom(-0.2)}
                className="p-2 hover:bg-zinc-700 text-zinc-400 transition-colors border-r border-zinc-700"
                title="縮小"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              <button 
                onClick={resetView}
                className="p-2 hover:bg-zinc-700 text-zinc-400 transition-colors"
                title="重置視角"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {isTreeFullscreen && (
              <div className="flex items-center gap-4 mr-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-zinc-400">目標</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <span className="text-[10px] text-zinc-400">路徑</span>
                </div>
                <button 
                  onClick={() => setQuery('')}
                  className="px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-400 hover:text-white transition-colors"
                >
                  重置
                </button>
              </div>
            )}
            <button 
              onClick={() => setIsTreeFullscreen(!isTreeFullscreen)}
              className={`p-2 rounded-lg transition-colors ${isTreeFullscreen ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}
              title={isTreeFullscreen ? "關閉全螢幕" : "全螢幕"}
            >
              {isTreeFullscreen ? (
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-bold">關閉圖譜</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className={`relative w-full flex-1 cursor-grab active:cursor-grabbing ${isTreeFullscreen ? 'h-full' : 'h-[350px]'}`}>
          <motion.div 
            drag
            dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
            animate={{ scale: zoom }}
            className="w-full h-full relative origin-center"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {CONNECTIONS.map((conn, idx) => {
                const from = TREE_NODES.find(n => n.id === conn.from)!;
                const to = TREE_NODES.find(n => n.id === conn.to)!;
                const active = isConnectionActive(conn.from, conn.to);
                return (
                  <motion.line
                    key={idx}
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke={active ? '#10b981' : '#3f3f46'}
                    strokeWidth={active ? 2 : 1}
                    strokeOpacity={active ? 1 : 0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })}
            </svg>

            {TREE_NODES.map((node) => (
              <div 
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <TreeNode 
                  node={node} 
                  active={isNodeActive(node)} 
                  target={isTargetNode(node)} 
                  onClick={() => handleNodeClick(node)}
                  isLarge={isTreeFullscreen}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {!isTreeFullscreen && (
          <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between items-center z-10">
            <div className="text-[9px] text-zinc-500 max-w-[60%] truncate">
              {query || '選擇關係開始'}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] text-zinc-400">目標</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <span className="text-[9px] text-zinc-400">路徑</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<string[]>([]);
  const [gender, setGender] = useState<Gender>(1); // Default to male speaker
  const [mode, setMode] = useState<'chain' | 'reverse'>('chain'); // chain: A的B, reverse: 稱呼A為什麼
  const [showTaigi, setShowTaigi] = useState<boolean>(true);
  const [inputMethod, setInputMethod] = useState<'buttons' | 'tree'>('buttons');
  const [showTree, setShowTree] = useState<boolean>(false);
  const [isTreeFullscreen, setIsTreeFullscreen] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleAddRelation = (val: string) => {
    setQuery(prev => prev ? `${prev}的${val}` : val);
    setShowTree(false);
  };

  const handleClear = () => {
    setQuery('');
    setResult([]);
    setShowTree(false);
  };

  const handleBackspace = () => {
    if (!query) return;
    const parts = query.split('的');
    parts.pop();
    setQuery(parts.join('的'));
    setShowTree(false);
  };

  const handleCalculate = () => {
    if (result.length === 0) return;
    setIsCalculating(true);
    setShowTree(true);
    setTimeout(() => setIsCalculating(false), 300);
  };

  const getTaigiInfo = (term: string) => {
    return TAIGI_MAP[term] || null;
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
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-2">
              <button 
                onClick={() => { setMode('chain'); setShowTree(false); }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === 'chain' 
                  ? 'bg-white shadow-sm ring-1 ring-zinc-200 text-zinc-900' 
                  : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                關係找稱呼
              </button>
              <button 
                onClick={() => { setMode('reverse'); setShowTree(false); }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === 'reverse' 
                  ? 'bg-white shadow-sm ring-1 ring-zinc-200 text-zinc-900' 
                  : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                稱呼找關係
              </button>
            </div>

            <div className="flex gap-2 bg-zinc-200/50 p-1 rounded-2xl">
              <button 
                onClick={() => setInputMethod('buttons')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  inputMethod === 'buttons' 
                  ? 'bg-white shadow-sm text-zinc-900' 
                  : 'text-zinc-500'
                }`}
              >
                <Grid className="w-3 h-3" />
                按鈕輸入
              </button>
              <button 
                onClick={() => { setInputMethod('tree'); setShowTree(true); }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  inputMethod === 'tree' 
                  ? 'bg-white shadow-sm text-zinc-900' 
                  : 'text-zinc-500'
                }`}
              >
                <Network className="w-3 h-3" />
                圖譜輸入
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {inputMethod === 'buttons' ? (
              <motion.div 
                key="buttons"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="calculator-grid"
              >
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
                  className="col-span-4 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200"
                  onClick={handleCalculate}
                >
                  <ArrowRight className="w-5 h-5" />
                  計算關係圖
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="tree"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <FamilyTreeVisualizer 
                  show={true}
                  query={query}
                  mode={mode}
                  result={result}
                  isTreeFullscreen={isTreeFullscreen}
                  setIsTreeFullscreen={setIsTreeFullscreen}
                  setQuery={setQuery}
                  setShowTree={setShowTree}
                />
                <button 
                  onClick={handleClear}
                  className="w-full mt-4 py-3 rounded-2xl bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置查詢
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {inputMethod === 'buttons' && (
            <FamilyTreeVisualizer 
              show={showTree}
              query={query}
              mode={mode}
              result={result}
              isTreeFullscreen={isTreeFullscreen}
              setIsTreeFullscreen={setIsTreeFullscreen}
              setQuery={setQuery}
              setShowTree={setShowTree}
            />
          )}
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
