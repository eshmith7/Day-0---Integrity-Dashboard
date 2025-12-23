import React, { useState } from 'react';
import { ScanEye, Upload, X, Loader2 } from 'lucide-react';
import { analyzeIntelImage } from '../services/geminiService';

export const IntelScanner: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mimeType, setMimeType] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract base64 data strictly
        const base64Data = base64String.split(',')[1];
        setSelectedImage(base64Data);
        setMimeType(file.type);
        setAnalysis(null); // Reset analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const executeAnalysis = async () => {
    if (!selectedImage || !mimeType) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeIntelImage(selectedImage, mimeType, "Analyze this visual intel. Assess nutritional value, tactical layout, or data density.");
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setAnalysis("Analysis failed. Decryption error.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setMimeType('');
  };

  return (
    <div className="flex flex-col h-full bg-charcoal border border-neutral-800 rounded-lg overflow-hidden relative group">
      <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <ScanEye className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono font-bold tracking-wider text-neutral-400">VISION INTEL</span>
        </div>
        {selectedImage && (
          <button onClick={clearImage} className="text-neutral-500 hover:text-alert">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col items-center justify-center relative">
        {!selectedImage ? (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-neutral-800 hover:border-blue-500/50 hover:bg-neutral-900/30 transition-all rounded-md">
            <Upload className="w-8 h-8 text-neutral-600 mb-2" />
            <span className="text-xs text-neutral-500 font-mono">UPLOAD VISUAL DATA</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        ) : (
          <div className="w-full h-full flex flex-col gap-4">
            <div className="relative flex-1 bg-black rounded border border-neutral-800 overflow-hidden flex items-center justify-center">
              <img 
                src={`data:${mimeType};base64,${selectedImage}`} 
                alt="Intel" 
                className="max-h-full max-w-full object-contain opacity-80" 
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                   <div className="flex flex-col items-center gap-2">
                     <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                     <span className="text-blue-500 font-mono text-xs animate-pulse">PROCESSING...</span>
                   </div>
                </div>
              )}
            </div>

            {analysis ? (
              <div className="h-32 bg-neutral-900/50 p-3 overflow-y-auto border-t border-blue-500/30 text-xs font-mono text-blue-100">
                {analysis}
              </div>
            ) : (
               <button 
                onClick={executeAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/50 text-blue-400 text-xs font-mono font-bold tracking-widest uppercase transition-all"
              >
                Execute Analysis
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
