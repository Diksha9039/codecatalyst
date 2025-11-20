import React, { useState, useEffect } from 'react';
import { ShieldCheck, ScanSearch, RotateCcw, AlertTriangle } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ClaimCard from './components/ClaimCard';
import { analyzeImage } from './services/gemini';
import { FactCheckResponse } from './types';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    setResult(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      // Remove data URL prefix for API call
      const base64Data = base64String.split(',')[1];
      setImage(base64String);
      setMimeType(file.type);
      
      try {
        const analysis = await analyzeImage(base64Data, file.type);
        setResult(analysis);
      } catch (err) {
        setError("Failed to analyze the image. Please try again later or with a different image.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetApp = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setMimeType('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
                MythBuster AI
              </h1>
              <p className="text-xs text-slate-500 font-medium">Multimodal Fact-Checking Assistant</p>
            </div>
          </div>
          {result && (
            <button 
              onClick={resetApp}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Check Another
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        {!image && (
          <div className="text-center space-y-8 mt-12 mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                Verify news in seconds.
              </h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                Upload a screenshot of a social media post, news article, or message. 
                We'll extract the text and verify the claims using trusted global sources.
              </p>
            </div>
            
            <FileUpload onFileSelect={handleFileSelect} disabled={loading} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 text-left max-w-3xl mx-auto">
              <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <ScanSearch className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Extract Text</h3>
                <p className="text-sm text-slate-500">Advanced OCR automatically reads text from images and screenshots.</p>
              </div>
               <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Verify Claims</h3>
                <p className="text-sm text-slate-500">AI cross-references claims against verified global knowledge bases.</p>
              </div>
               <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Get Verdict</h3>
                <p className="text-sm text-slate-500">Receive clear True/False verdicts with detailed explanations and sources.</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {image && loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
             <div className="relative w-64 h-48 bg-slate-200 rounded-lg overflow-hidden shadow-inner">
                {/* Blurred preview of uploaded image */}
                <img 
                  src={image} 
                  alt="Analyzing" 
                  className="w-full h-full object-cover opacity-50 blur-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
             </div>
             <div className="text-center">
               <h3 className="text-xl font-semibold text-slate-800">Analyzing content...</h3>
               <p className="text-slate-500 animate-pulse">Identifying claims and cross-referencing facts.</p>
             </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center my-8">
             <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
             <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Failed</h3>
             <p className="text-red-600 mb-6">{error}</p>
             <button 
                onClick={resetApp}
                className="px-6 py-2 bg-white text-red-600 border border-red-200 font-medium rounded-lg hover:bg-red-50 transition-colors"
             >
               Try Again
             </button>
          </div>
        )}

        {/* Result View */}
        {result && !loading && (
          <div className="space-y-8 animate-fade-in">
             
             {/* Original Image Preview (Small) */}
             <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4 shadow-sm">
                <img 
                  src={image!} 
                  alt="Source" 
                  className="w-24 h-24 object-cover rounded-lg border border-slate-100"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Cleaned Text from Image
                  </h3>
                  <p className="text-slate-700 text-sm italic border-l-4 border-slate-200 pl-3 bg-slate-50 py-2 pr-2 rounded-r">
                    "{result.cleaned_text}"
                  </p>
                </div>
             </div>

             <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Fact-Check Results</h2>
                {result.claims.map((claim, index) => (
                  <ClaimCard key={index} claimData={claim} />
                ))}
             </div>

             <div className="text-center text-xs text-slate-400 pt-8 pb-12">
                <p>AI generated results may vary. Always verify important information with official sources.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
