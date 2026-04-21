import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Loader2, BarChart2 } from 'lucide-react';
import { AnalysisResult } from '../lib/worker';

interface AnalyzerInterfaceProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export function AnalyzerInterface({ onAnalyze, isAnalyzing }: AnalyzerInterfaceProps) {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const clearInput = () => {
    setText('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-[#080808] p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          Input Buffer
        </h2>
        {text.length > 0 && (
          <span className="text-[10px] font-mono text-zinc-500 italic">
            UTF-8 | {text.length.toLocaleString()} characters Loaded
          </span>
        )}
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          className="w-full h-64 p-6 bg-[#0A0A0A] border border-white/5 font-mono text-sm text-zinc-400 italic outline-none focus:border-cyan-500/50 transition-colors leading-relaxed resize-none"
        />
        
        {fileName && (
          <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm text-zinc-300 text-xs font-mono px-3 py-1.5 border border-white/10 flex items-center gap-2">
            <span className="max-w-[150px] truncate">{fileName}</span>
            <button onClick={clearInput} className="text-zinc-500 hover:text-white font-bold ml-1">
              &times;
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div>
          <input
            type="file"
            accept=".txt,.csv,.md"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-medium uppercase tracking-widest hover:bg-white/10 transition-colors text-zinc-300 flex items-center gap-2 disabled:opacity-50"
            disabled={isAnalyzing}
          >
            <UploadCloud className="w-4 h-4" />
            Upload File
          </button>
        </div>

        <button
          onClick={() => onAnalyze(text)}
          disabled={text.trim().length === 0 || isAnalyzing}
          className="px-6 py-2.5 bg-cyan-600/90 text-white text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:bg-cyan-500 disabled:shadow-none disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              ANALYZING...
            </>
          ) : (
            <>
              <BarChart2 className="w-4 h-4" />
              START NEW ANALYSIS
            </>
          )}
        </button>
      </div>
    </div>
  );
}
