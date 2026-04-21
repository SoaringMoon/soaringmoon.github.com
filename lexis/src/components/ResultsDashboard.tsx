import React from 'react';
import { AnalysisResult } from '../lib/worker';
import { exportToCSV } from '../lib/exportCsv';
import { Download, LayoutGrid, Hash, Link2, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { cn } from '../lib/utils';

interface ResultsDashboardProps {
  results: AnalysisResult;
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  const topWords = results.wordFrequencies.slice(0, 20);
  const topBigrams = results.bigramFrequencies.slice(0, 20);
  
  const lexicalDensity = results.totalWords > 0 
    ? ((results.uniqueWords / results.totalWords) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={<Hash className="w-5 h-5 text-indigo-500" />}
          label="Total Words" 
          value={results.totalWords.toLocaleString()} 
        />
        <StatCard 
          icon={<LayoutGrid className="w-5 h-5 text-emerald-500" />}
          label="Unique Words" 
          value={results.uniqueWords.toLocaleString()} 
        />
        <StatCard 
          icon={<BookOpen className="w-5 h-5 text-amber-500" />}
          label="Lexical Density" 
          value={`${lexicalDensity}%`} 
          subtext="Ratio of unique to total words"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Word Frequency Chart */}
        <div className="bg-[#080808] border border-white/10 p-6 flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Frequency List</h3>
            <button
              onClick={() => exportToCSV(results.wordFrequencies, 'word_frequencies.csv')}
              className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-medium uppercase tracking-widest hover:bg-white/10 transition-colors text-zinc-300 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>
          
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topWords} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="word" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }}
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', color: '#E5E5E5', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={32}>
                  {topWords.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 3 ? '#0891b2' : '#06b6d4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bigram Relationships Table */}
        <div className="bg-[#080808] border border-white/10 p-6 flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Relationship Map
            </h3>
            <button
              onClick={() => exportToCSV(results.bigramFrequencies.map(b => ({ word: b.bigram, count: b.count })), 'bigram_relationships.csv')}
              className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-medium uppercase tracking-widest hover:bg-white/10 transition-colors text-zinc-300 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-[1fr,80px] gap-2 border-b border-white/10 pb-2 mb-2 sticky top-0 bg-[#080808]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Relationship</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 text-right">Count</span>
            </div>
            
            {topBigrams.length > 0 ? (
              topBigrams.map((item, index) => {
                const words = item.bigram.split(' ');
                return (
                  <div key={item.bigram} className="grid grid-cols-[1fr,80px] gap-2 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 -mx-2 transition-colors">
                    <span className="text-zinc-400 text-xs flex items-center gap-2 truncate font-mono">
                      <span>{words[0]}</span>
                      <Link2 className="w-3 h-3 text-cyan-500 opacity-50 shrink-0" />
                      <span>{words[1]}</span>
                    </span>
                    <span className="text-cyan-500 text-xs text-right font-mono">{item.count.toLocaleString()}</span>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-xs font-mono italic">
                [ Not enough data for relationships ]
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, subtext }: { label: string; value: string; icon: React.ReactNode; subtext?: string }) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-lg flex flex-col gap-2 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] italic">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-light text-cyan-400">{value}</span>
      </div>
      {subtext && <span className="text-[10px] text-zinc-500 font-mono mt-1">{subtext}</span>}
    </div>
  );
}
