import React, { useState } from 'react';
import { ArtStyle } from './types';
import { STYLE_OPTIONS } from './constants';
import { generatePrompt, generateStylizedImage } from './services/geminiService';
import StyleCard from './components/StyleCard';
import ImageUploader from './components/ImageUploader';
import { Wand2, Download, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null);
  const [generatedImages, setGeneratedImages] = useState<{ url: string; style: ArtStyle }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    // 새로운 사진을 선택하면 그 사진으로 만든 기록만 남기도록 이전 결과는 정리
    setGeneratedImages([]);
    setError(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setGeneratedImages([]);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage || !selectedStyle) return;

    setIsLoading(true);
    setError(null);

    try {
      setLoadingStep("Dreaming up ideas...");
      const prompt = await generatePrompt(selectedImage, selectedStyle);
      
      setLoadingStep("Painting your memory...");
      const imageUrl = await generateStylizedImage(selectedImage, prompt);
      
      // 가장 최근 결과가 위로 오도록 누적 저장
      setGeneratedImages((prev) => [
        { url: imageUrl, style: selectedStyle },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oops! Something went wrong.');
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleDownload = (imageUrl: string) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `art-diary-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-dashed border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-rose-100 p-2 rounded-xl text-rose-500 rotate-3">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              ArtStyle Diary
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-500 border border-slate-200">
            <Heart size={12} fill="#94a3b8" />
            Powered by Gemini
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className="md:col-span-5 flex flex-col gap-8">
            {/* Step 1: Upload */}
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold font-['Fredoka']">1</span>
                <h2 className="text-xl font-bold text-slate-700">Pick a Photo</h2>
              </div>
              
              <ImageUploader 
                onImageSelect={handleImageSelect} 
                onClear={handleClearImage} 
                selectedImage={selectedImage}
                previewUrl={previewUrl}
              />
            </section>

             {/* Error Message */}
             {error && (
               <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-100 text-red-600 flex items-start gap-3 animate-bounce-in">
                 <AlertCircle className="shrink-0 mt-0.5" size={20} />
                 <p className="font-medium">{error}</p>
               </div>
            )}
          </div>

          {/* Right Column: Style & Action */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Step 2: Style */}
            <section>
              <div className="flex items-center gap-3 mb-4 px-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold font-['Fredoka']">2</span>
                <h2 className="text-xl font-bold text-slate-700">Choose a Vibe</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {STYLE_OPTIONS.map((style) => (
                  <StyleCard
                    key={style.id}
                    styleConfig={style}
                    isSelected={selectedStyle === style.id}
                    onClick={() => setSelectedStyle(style.id)}
                  />
                ))}
              </div>
            </section>

            {/* Action Area */}
            <div className="sticky bottom-6 mt-4">
              <button
                disabled={!selectedImage || !selectedStyle || isLoading}
                onClick={handleGenerate}
                className={`
                  w-full py-4 px-8 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 border-b-4 active:border-b-0 active:translate-y-1
                  ${(!selectedImage || !selectedStyle) 
                    ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed' 
                    : isLoading
                      ? 'bg-indigo-400 text-white border-indigo-600 cursor-wait'
                      : 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white border-purple-600 hover:brightness-105'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
                    {loadingStep}
                  </>
                ) : (
                  <>
                    <Wand2 size={24} strokeWidth={2.5} />
                    Decorate My Photo!
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Result Section */}
        {generatedImages.length > 0 && (
          <div className="mt-12 pt-12 border-t-2 border-dashed border-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">✨ Tada! Your little gallery ✨</h2>
              <p className="text-slate-500">Each time you decorate, the new artwork gently joins the collection below.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {generatedImages.map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="relative bg-white/95 p-4 pb-16 rounded-[2rem] shadow-xl rotate-1 transform transition-transform hover:rotate-0 border border-slate-100/80"
                >
                  {/* Tape */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-9 bg-indigo-100/80 rotate-1 backdrop-blur-sm z-10" />

                  <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <img 
                      src={image.url} 
                      alt={`Generated Art ${index + 1}`} 
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="absolute bottom-4 left-6 font-['Fredoka'] text-slate-300 text-sm font-semibold -rotate-3">
                    #{image.style}
                  </div>
                  <div className="absolute bottom-4 right-6 text-xs text-slate-400 font-medium">
                    Take {generatedImages.length - index}
                  </div>

                  <button
                    onClick={() => handleDownload(image.url)}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-7 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-slate-700 transition-colors flex items-center gap-2 active:scale-95"
                  >
                    <Download size={18} />
                    Save Image
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
      <Analytics />
    </div>
  );
};

export default App;