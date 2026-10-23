/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BookForm } from './components/BookForm';
import { QuestionCardItem } from './components/QuestionCardItem';
import { GuidanceAlert } from './components/GuidanceAlert';
import { WorksheetView } from './components/WorksheetView';
import { GuideSection } from './components/GuideSection';
import { CardGenerationResponse, QuestionCard } from './types';
import { RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<CardGenerationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Card flipping state for the 3 cards
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
  });

  // Student scratchpad notes for the 3 cards (ephemeral, not saved anywhere)
  const [studentNotes, setStudentNotes] = useState<Record<number, string>>({
    0: '',
    1: '',
    2: '',
  });

  const handleGenerateCards = async (title: string, scene: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setResponseResult(null);

    // Reset flips and notes
    setFlippedCards({ 0: false, 1: false, 2: false });
    setStudentNotes({ 0: '', 1: '', 2: '' });

    try {
      const response = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTitle: title,
          sceneDescription: scene,
        }),
      });

      const data: CardGenerationResponse = await response.json();
      setResponseResult(data);

      if (!response.ok && !data.guidanceMessage) {
        setErrorMessage('질문 카드를 만드는 과정에서 일시적인 문제가 생겼습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleFlipAll = (flip: boolean) => {
    setFlippedCards({
      0: flip,
      1: flip,
      2: flip,
    });
  };

  const handleNoteChange = (index: number, note: string) => {
    setStudentNotes((prev) => ({
      ...prev,
      [index]: note,
    }));
  };

  const handleReset = () => {
    setResponseResult(null);
    setErrorMessage(null);
    setFlippedCards({ 0: false, 1: false, 2: false });
    setStudentNotes({ 0: '', 1: '', 2: '' });
  };

  const isAllFlipped = flippedCards[0] && flippedCards[1] && flippedCards[2];

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">
      <main className="container mx-auto px-4 sm:px-6 max-w-5xl py-4 sm:py-8">
        <Header />

        {/* Guidance Alert for Inappropriate / Playful Input */}
        {responseResult && !responseResult.isValid && responseResult.guidanceMessage && (
          <GuidanceAlert
            message={responseResult.guidanceMessage}
            onReset={handleReset}
          />
        )}

        {/* Generic Error message */}
        {errorMessage && (
          <div className="no-print bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 sm:p-5 my-6 text-center max-w-lg mx-auto text-sm">
            <p>{errorMessage}</p>
            <button
              onClick={handleReset}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              다시 시도
            </button>
          </div>
        )}

        {/* Book Form (Shown when no valid cards are generated yet) */}
        {(!responseResult || !responseResult.isValid) && (
          <div className="mt-4 sm:mt-6">
            <BookForm
              onSubmit={handleGenerateCards}
              isLoading={isLoading}
              initialTitle={responseResult?.bookTitle || ''}
            />
          </div>
        )}

        {/* Result: 3 Question Cards */}
        {responseResult && responseResult.isValid && responseResult.cards && responseResult.cards.length > 0 && (
          <div className="mt-6 sm:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar & Print view */}
            <WorksheetView
              bookTitle={responseResult.bookTitle || ''}
              sceneSummary={responseResult.sceneSummary}
              cards={responseResult.cards}
              notes={studentNotes}
              onFlipAll={handleFlipAll}
              allFlipped={!!isAllFlipped}
              onReset={handleReset}
            />

            {/* Instruction tooltip banner */}
            <div className="no-print mb-4 flex items-center justify-between text-xs text-stone-500 px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                각 카드를 클릭하면 뒤집혀 <strong>생각을 돕는 힌트</strong>가 나타납니다.
              </span>
              <span>카드 3장 (1문장 질문)</span>
            </div>

            {/* Cards Grid: 3 columns on desktop, 1 on mobile */}
            <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
              {responseResult.cards.map((card: QuestionCard, index: number) => (
                <QuestionCardItem
                  key={index}
                  card={card}
                  index={index}
                  isFlipped={!!flippedCards[index]}
                  onToggleFlip={() => handleToggleFlip(index)}
                  myNote={studentNotes[index] || ''}
                  onNoteChange={(note) => handleNoteChange(index, note)}
                />
              ))}
            </div>

            {/* Bottom New Book Action */}
            <div className="no-print mt-8 text-center">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-stone-500" />
                <span>다른 책으로 새로운 질문 카드 만들기</span>
              </button>
            </div>
          </div>
        )}

        {/* Educational Guide Accordion */}
        <GuideSection />
      </main>

      {/* Footer */}
      <footer className="no-print py-6 border-t border-stone-200/60 text-center text-xs text-stone-500">
        <div className="container mx-auto px-4 space-y-1">
          <p className="font-medium text-stone-600">
            생각 쑥쑥 독서 질문 카드 · 중등 독서 사고력 도우미
          </p>
          <p className="text-[11px] text-stone-400">
            개인정보 보호를 위해 학생의 이름은 수집하지 않으며, 입력한 모든 독서 내용은 저장되지 않습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
