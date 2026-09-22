'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  message: string | null;
}

export const Toast: React.FC<Props> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold shadow-xl border border-stone-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      <span>{message}</span>
    </div>
  );
};
