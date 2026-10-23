import React, { useState, useEffect } from 'react';
import { Sparkles, BookMarked, Lightbulb, CornerDownRight, Eraser } from 'lucide-react';
import { MIDDLE_SCHOOL_PRESETS } from '../data/presets';
import { BookPreset } from '../types';

interface BookFormProps {
  onSubmit: (title: string, scene: string) => void;
  isLoading: boolean;
  initialTitle?: string;
  initialScene?: string;
}

export const BookForm: React.FC<BookFormProps> = ({
  onSubmit,
  isLoading,
  initialTitle = '',
  initialScene = '',
}) => {
  const [bookTitle, setBookTitle] = useState(initialTitle);
  const [sceneDescription, setSceneDescription] = useState(initialScene);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const loadingSteps = [
    '책 속 장면에 깊이 집중하고 있어요...',
    '등장인물의 감정과 상황을 헤아리는 중...',
    '생각을 쑥쑥 넓혀줄 질문 카드 3장을 빚고 있어요...',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev + 1) % loadingSteps.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !sceneDescription.trim() || isLoading) return;
    onSubmit(bookTitle.trim(), sceneDescription.trim());
  };

  const handleApplyPreset = (preset: BookPreset) => {
    setBookTitle(preset.title);
    setSceneDescription(preset.scene);
  };

  const handleClear = () => {
    setBookTitle('');
    setSceneDescription('');
  };

  return (
    <div className="no-print bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-sm p-5 sm:p-7 max-w-2xl mx-auto transition-all">
      {/* Quick preset selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            어떤 책을 쓸지 고민된다면? 예시 둘러보기
          </span>
          {(bookTitle || sceneDescription) && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Eraser className="w-3 h-3" />
              지우기
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MIDDLE_SCHOOL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-2 text-left bg-stone-50 hover:bg-amber-50/80 hover:border-amber-300 border border-stone-200/80 rounded-xl transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-xs font-bold text-stone-800 group-hover:text-amber-900 truncate">
                {preset.title}
              </div>
              <div className="text-[11px] text-stone-500 truncate mt-0.5">
                {preset.genre}
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Book Title */}
        <div>
          <label htmlFor="bookTitle" className="block text-sm font-semibold text-stone-800 mb-1.5">
            1. 책 제목
          </label>
          <div className="relative">
            <input
              id="bookTitle"
              type="text"
              required
              disabled={isLoading}
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="예: 아몬드, 자전거 도둑, 어린 왕자, 페인트, 원더..."
              className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-sm sm:text-base outline-none transition-all placeholder:text-stone-400 disabled:opacity-50"
            />
            <BookMarked className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Memorable Scene */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="sceneDescription" className="block text-sm font-semibold text-stone-800">
              2. 인상 깊었던 장면
            </label>
            <span className="text-xs text-stone-400">
              {sceneDescription.length}자
            </span>
          </div>

          <p className="text-xs text-stone-500 mb-2 leading-relaxed">
            인물이 했던 특별한 말이나 행동, 가슴이 쿵 내려앉았던 순간이나 자꾸 생각나는 장면을 자유롭게 적어 주세요.
          </p>

          <textarea
            id="sceneDescription"
            required
            rows={4}
            disabled={isLoading}
            value={sceneDescription}
            onChange={(e) => setSceneDescription(e.target.value)}
            placeholder="예: 주인공이 왜 그런 선택을 했을지 궁금했던 장면, 친구와 갈등하며 속상해하던 순간, 책을 덮고 나서도 오래 기억에 남았던 한 장면을 적어보세요."
            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-sm sm:text-base outline-none transition-all placeholder:text-stone-400 disabled:opacity-50 resize-y leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading || !bookTitle.trim() || !sceneDescription.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-semibold text-base transition-all duration-200 shadow-sm shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm sm:text-base font-medium animate-pulse">
                  {loadingSteps[loadingPhase]}
                </span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>생각을 넓히는 질문 카드 3장 만들기</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Thought guide note */}
      <div className="mt-4 pt-3.5 border-t border-stone-150 flex items-center gap-2 text-xs text-stone-500">
        <CornerDownRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>만들어진 카드 3장은 <strong>사실 확인</strong>, <strong>인물 마음 추측</strong>, <strong>나와 연결하기</strong>로 구성됩니다.</span>
      </div>
    </div>
  );
};
