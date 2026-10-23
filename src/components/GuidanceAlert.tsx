import React from 'react';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

interface GuidanceAlertProps {
  message: string;
  onReset: () => void;
}

export const GuidanceAlert: React.FC<GuidanceAlertProps> = ({ message, onReset }) => {
  return (
    <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-sm my-6 transition-all animate-in fade-in zoom-in-95 duration-300">
      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-stone-900 mb-2">
        조금 더 마음을 담아 적어 볼까요?
      </h3>

      <p className="text-stone-700 text-sm sm:text-base leading-relaxed mb-5 whitespace-pre-line">
        {message}
      </p>

      <div className="bg-white/80 border border-amber-200/60 rounded-xl p-3.5 mb-5 text-xs sm:text-sm text-stone-600 text-left">
        <p className="font-semibold text-amber-900 flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          생각 카드를 잘 만드는 꿀팁
        </p>
        <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
          <li>장난이나 비속어 대신, 진짜 읽었던 책의 이름을 써 주세요.</li>
          <li>인물이 어떤 행동을 했거나 어떤 대화를 나누었는지 조금 더 구체적으로 적어 주세요.</li>
        </ul>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>다시 작성하러 가기</span>
      </button>
    </div>
  );
};
