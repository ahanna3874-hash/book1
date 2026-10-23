import React from 'react';
import { BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="no-print pt-6 pb-4 sm:pt-10 sm:pb-6 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium mb-3 shadow-xs">
        <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
        <span>중등 1~3학년 독서 생각 확장 도우미</span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
          <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900 font-serif-kr">
          생각 쑥쑥 독서 질문 카드
        </h1>
      </div>

      <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
        내가 읽은 책 제목과 마음에 남은 장면을 적어보세요.<br className="hidden sm:inline" />
        답을 미리 알려주지 않고, 스스로 생각을 넓힐 수 있는 <strong className="text-amber-800 font-semibold">3장의 질문 카드</strong>를 만들어 줍니다.
      </p>

      {/* Privacy & Safety Promise */}
      <div className="mt-4 inline-flex items-center gap-2 text-xs text-stone-500 bg-white/70 backdrop-blur-xs border border-stone-200/80 px-3.5 py-1.5 rounded-lg shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>이름을 묻지 않으며, 입력한 내용은 서버나 데이터베이스에 저장되지 않는 안전한 공간입니다.</span>
      </div>
    </header>
  );
};
