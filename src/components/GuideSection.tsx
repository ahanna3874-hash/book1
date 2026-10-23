import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Compass, Search, Heart, User } from 'lucide-react';

export const GuideSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="no-print mt-12 max-w-3xl mx-auto">
      <div className="bg-white/80 border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-stone-50/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                질문 카드 3총사는 왜 특별할까요?
              </h3>
              <p className="text-xs text-stone-500">
                중학생의 독서 사고력을 넓혀주는 3단계 생각 여행
              </p>
            </div>
          </div>
          <div className="text-stone-400">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {isOpen && (
          <div className="px-5 pb-5 pt-2 border-t border-stone-100 text-xs sm:text-sm text-stone-600 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/80">
                <div className="flex items-center gap-1.5 font-bold text-sky-900 mb-1">
                  <Search className="w-4 h-4 text-sky-600" />
                  <span>1. 사실 확인</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  장면의 구체적인 상황과 배경을 돋보기처럼 비춰보며, 책의 핵심 사실을 정확하게 짚어냅니다.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80">
                <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span>2. 인물 마음 추측</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  등장인물의 신발을 신고 그 자리에 서 봅니다. 겉으로 드러난 말과 행동 뒤에 숨은 감정을 헤아려요.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>3. 나와 연결하기</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  책 속 이야기와 고민을 내 삶, 학교생활, 친구 관계와 이어보며 나만의 가치관을 키웁니다.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>왜 정답을 알려주지 않나요?</strong><br />
                독서에는 하나의 정답이 정해져 있지 않아요. 질문 카드를 마주하고 스스로 떠올린 생각이 세상에서 가장 소중한 정답이랍니다! 카드를 뒤집어 <strong>생각을 돕는 힌트</strong>를 살펴보며 차근차근 생각을 열어보세요.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
