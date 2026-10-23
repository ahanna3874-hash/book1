import React, { useState } from 'react';
import { Copy, Check, Printer, RotateCw, BookOpen, Quote } from 'lucide-react';
import { QuestionCard } from '../types';

interface WorksheetViewProps {
  bookTitle: string;
  sceneSummary?: string;
  cards: QuestionCard[];
  notes: Record<number, string>;
  onFlipAll: (flip: boolean) => void;
  allFlipped: boolean;
  onReset: () => void;
}

export const WorksheetView: React.FC<WorksheetViewProps> = ({
  bookTitle,
  sceneSummary,
  cards,
  notes,
  onFlipAll,
  allFlipped,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    let text = `[독서 질문 카드] ${bookTitle}\n`;
    if (sceneSummary) {
      text += `장면 공감: ${sceneSummary}\n\n`;
    } else {
      text += '\n';
    }

    cards.forEach((card, idx) => {
      text += `----------------------------------------\n`;
      text += `카드 ${idx + 1}. [${card.categoryTitle}] ${card.badgeText}\n`;
      text += `질문: ${card.question}\n`;
      text += `생각 힌트: ${card.hint}\n`;
      if (notes[idx]?.trim()) {
        text += `나의 생각: ${notes[idx].trim()}\n`;
      }
      text += `\n`;
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Top Bar for Results */}
      <div className="no-print bg-amber-100/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-md">
                선택한 책
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif-kr">
                {bookTitle}
              </h2>
            </div>
            {sceneSummary && (
              <p className="text-xs sm:text-sm text-stone-600 mt-1 flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{sceneSummary}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onFlipAll(!allFlipped)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-stone-500" />
            <span>{allFlipped ? '질문 앞면 보기' : '모든 힌트 보기'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>질문 복사</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-stone-300" />
            <span>활동지 인쇄</span>
          </button>
        </div>
      </div>

      {/* ================= PRINT-ONLY WORKSHEET LAYOUT ================= */}
      <div className="hidden print-only p-4 font-serif-kr text-stone-900">
        <div className="border-b-2 border-stone-900 pb-3 mb-4 text-center">
          <h1 className="text-2xl font-bold">생각 쑥쑥 독서 질문 활동지</h1>
          <p className="text-sm text-stone-600 mt-1">
            도서명: <strong>{bookTitle}</strong> | 학년 / 반 / 이름: __________________
          </p>
        </div>

        {sceneSummary && (
          <div className="mb-4 p-3 bg-stone-100 rounded text-sm italic">
            장면: {sceneSummary}
          </div>
        )}

        <div className="space-y-6">
          {cards.map((card, idx) => (
            <div key={idx} className="border border-stone-400 rounded-lg p-4">
              <div className="flex items-center justify-between font-sans text-xs font-bold text-stone-700 mb-2">
                <span>[카드 {idx + 1}] {card.categoryTitle}</span>
                <span>{card.badgeText}</span>
              </div>
              <p className="text-base font-bold mb-3">
                질문: {card.question}
              </p>
              <p className="text-xs text-stone-600 mb-3 bg-stone-50 p-2 rounded">
                💡 생각 힌트: {card.hint}
              </p>
              <div className="mt-3">
                <span className="text-xs font-sans font-semibold text-stone-700 block mb-1">
                  나의 생각 적기:
                </span>
                <div className="min-h-[70px] border-b border-dashed border-stone-300">
                  {notes[idx] && <p className="text-sm">{notes[idx]}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-stone-500 font-sans">
          생각 쑥쑥 독서 질문 카드 · 정답이 없는 열린 질문으로 나만의 생각을 펼쳐보세요.
        </div>
      </div>
    </div>
  );
};
