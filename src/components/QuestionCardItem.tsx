import React, { useState } from 'react';
import { RotateCw, Volume2, VolumeX, Sparkles, Check, HelpCircle, PencilLine, Eye } from 'lucide-react';
import { QuestionCard } from '../types';

interface QuestionCardItemProps {
  card: QuestionCard;
  index: number;
  isFlipped: boolean;
  onToggleFlip: () => void;
  myNote: string;
  onNoteChange: (note: string) => void;
}

export const QuestionCardItem: React.FC<QuestionCardItemProps> = ({
  card,
  index,
  isFlipped,
  onToggleFlip,
  myNote,
  onNoteChange,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Palette configuration based on card type
  const theme = {
    fact: {
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      frontAccent: 'from-sky-500/10 via-white to-sky-50/50',
      borderFront: 'border-sky-200 hover:border-sky-300',
      backAccent: 'from-sky-50 via-white to-blue-50/60',
      borderBack: 'border-sky-300',
      tagColor: 'text-sky-700',
      numberColor: 'bg-sky-600 text-white',
      accentColor: 'text-sky-600',
    },
    emotion: {
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      frontAccent: 'from-purple-500/10 via-white to-purple-50/50',
      borderFront: 'border-purple-200 hover:border-purple-300',
      backAccent: 'from-purple-50 via-white to-fuchsia-50/60',
      borderBack: 'border-purple-300',
      tagColor: 'text-purple-700',
      numberColor: 'bg-purple-600 text-white',
      accentColor: 'text-purple-600',
    },
    connection: {
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      frontAccent: 'from-emerald-500/10 via-white to-emerald-50/50',
      borderFront: 'border-emerald-200 hover:border-emerald-300',
      backAccent: 'from-emerald-50 via-white to-teal-50/60',
      borderBack: 'border-emerald-300',
      tagColor: 'text-emerald-700',
      numberColor: 'bg-emerald-600 text-white',
      accentColor: 'text-emerald-600',
    },
  }[card.type] || {
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    frontAccent: 'from-amber-500/10 via-white to-amber-50/50',
    borderFront: 'border-amber-200 hover:border-amber-300',
    backAccent: 'from-amber-50 via-white to-orange-50/60',
    borderBack: 'border-amber-300',
    tagColor: 'text-amber-700',
    numberColor: 'bg-amber-600 text-white',
    accentColor: 'text-amber-600',
  };

  const speakQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(card.question);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95; // Friendly, clear reading speed for middle schoolers

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="perspective-1000 w-full min-h-[460px] h-full">
      <div
        className={`card-inner transform-style-3d relative w-full h-full cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onToggleFlip}
      >
        {/* ================= CARD FRONT ================= */}
        <div
          className={`backface-hidden absolute inset-0 w-full h-full rounded-2xl bg-linear-to-b ${theme.frontAccent} border-2 ${theme.borderFront} p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow select-none`}
        >
          {/* Top category & card number */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.badgeBg}`}
              >
                {card.badgeText || card.categoryTitle}
              </span>
              <div className="flex items-center gap-1.5">
                {'speechSynthesis' in window && (
                  <button
                    type="button"
                    onClick={speakQuestion}
                    title="질문 소리내어 읽기"
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <VolumeX className="w-4 h-4 text-amber-600 animate-pulse" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                )}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${theme.numberColor}`}
                >
                  {index + 1}
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold tracking-wide text-stone-400 mb-2">
              {card.thinkPrompt || '질문 카드'}
            </p>

            {/* Question sentence - Exactly one sentence */}
            <div className="mt-4 my-auto">
              <div className="text-3xl text-amber-500/40 font-serif-kr select-none leading-none mb-1">
                “
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug font-serif-kr">
                {card.question}
              </h3>
              <div className="text-3xl text-amber-500/40 font-serif-kr select-none leading-none text-right mt-1">
                ”
              </div>
            </div>
          </div>

          {/* Bottom Flip Trigger */}
          <div className="pt-4 border-t border-stone-200/60 mt-auto">
            {myNote.trim() && (
              <div className="mb-2.5 px-2.5 py-1.5 rounded-lg bg-white/70 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  내 생각 메모 작성됨
                </span>
                <span className="text-[11px] text-stone-400 truncate max-w-[120px]">
                  {myNote}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium group">
              <span className="inline-flex items-center gap-1.5 text-stone-700 group-hover:text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                카드를 뒤집으면 <strong>생각을 돕는 힌트</strong>가 나와요!
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 group-hover:bg-amber-100/70 text-stone-600 transition-colors">
                <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                뒤집기
              </span>
            </div>
          </div>
        </div>

        {/* ================= CARD BACK ================= */}
        <div
          className={`backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-2xl bg-linear-to-b ${theme.backAccent} border-2 ${theme.borderBack} p-6 sm:p-7 flex flex-col justify-between shadow-md`}
        >
          <div>
            {/* Top header on Back */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${theme.badgeBg}`}
              >
                {card.categoryTitle}
              </span>
              <span className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                생각을 돕는 힌트
              </span>
            </div>

            {/* Hint Box */}
            <div className="bg-white/90 border border-stone-200/90 rounded-xl p-4 shadow-2xs mb-4">
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {card.hint}
              </p>
            </div>

            {/* Student's Quick Scratchpad for Reflection */}
            <div onClick={(e) => e.stopPropagation()}>
              <label
                htmlFor={`note-${index}`}
                className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1"
              >
                <span className="flex items-center gap-1">
                  <PencilLine className="w-3.5 h-3.5 text-stone-500" />
                  나만의 생각 적어보기 (선택)
                </span>
                <span className="text-[11px] text-stone-400 font-normal">
                  자동 저장되지 않는 임시 메모
                </span>
              </label>
              <textarea
                id={`note-${index}`}
                rows={3}
                value={myNote}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="이 질문을 읽고 어떤 생각이 들었나요? 자유롭게 적어 보세요."
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white/80 focus:bg-white text-xs sm:text-sm text-stone-800 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-stone-400 resize-none"
              />
            </div>
          </div>

          {/* Bottom Flip Back button */}
          <div className="pt-3 border-t border-stone-200/70 mt-3 flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="text-[11px] text-stone-500 flex items-center gap-1">
              <Eye className="w-3 h-3 text-stone-400" />
              정답은 정해져 있지 않아요!
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFlip();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer text-xs font-semibold shadow-xs"
            >
              <RotateCw className="w-3 h-3" />
              질문 다시 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
