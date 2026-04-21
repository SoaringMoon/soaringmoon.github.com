import React, { useState, useEffect, useRef } from 'react';
import { AnalyzerInterface } from './components/AnalyzerInterface';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AnalysisResult } from './lib/worker';
import { Search } from 'lucide-react';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL('./lib/worker.ts', import.meta.url), {
      type: 'module',
    });

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { type, result, error } = e.data;
      if (type === 'SUCCESS') {
        setResults(result);
        setError(null);
      } else {
        setError(error);
        setResults(null);
      }
      setIsAnalyzing(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleAnalyze = (text: string) => {
    if (!text.trim() || !workerRef.current) return;
    
    setIsAnalyzing(true);
    setError(null);
    workerRef.current.postMessage({ text });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-cyan-500/20 selection:text-cyan-100">
      <header className="bg-[#0A0A0A] border-b border-white/10 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
              <div className="w-4 h-4 bg-cyan-500"></div>
            </div>
            <h1 className="text-xl font-medium tracking-tight text-white">
              LEXIS<span className="text-cyan-500">.</span>ANALYTICA
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-8 pb-20">
        <div className="w-full">
          <AnalyzerInterface onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-6 py-4 border text-sm font-mono flex items-center">
            Error analyzing text: {error}
          </div>
        )}

        {results && (
          <ResultsDashboard results={results} />
        )}
      </main>
    </div>
  );
}
