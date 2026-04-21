export interface AnalysisResult {
  totalWords: number;
  uniqueWords: number;
  wordFrequencies: { word: string; count: number }[];
  bigramFrequencies: { bigram: string; count: number }[];
}

self.onmessage = (e: MessageEvent) => {
  const text = e.data.text;
  if (typeof text !== 'string') return;

  try {
    // Matches sequences of letters/numbers, and optionally one internal apostrophe.
    const wordRegex = /[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)?/gu;
    let match;
    const freq = new Map<string, number>();
    const bigramFreq = new Map<string, number>();
    
    let prevWord: string | null = null;
    let totalWords = 0;

    while ((match = wordRegex.exec(text)) !== null) {
      const word = match[0].toLowerCase();
      totalWords++;
      
      const currentCount = freq.get(word) || 0;
      freq.set(word, currentCount + 1);

      if (prevWord) {
        const bigram = `${prevWord} ${word}`;
        const currentBigramCount = bigramFreq.get(bigram) || 0;
        bigramFreq.set(bigram, currentBigramCount + 1);
      }
      prevWord = word;
    }

    const uniqueWords = freq.size;
    
    const wordFrequencies = Array.from(freq.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);

    const bigramFrequencies = Array.from(bigramFreq.entries())
      .map(([bigram, count]) => ({ bigram, count }))
      .sort((a, b) => b.count - a.count);

    self.postMessage({
      type: 'SUCCESS',
      result: {
        totalWords,
        uniqueWords,
        wordFrequencies,
        bigramFrequencies
      }
    });

  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
