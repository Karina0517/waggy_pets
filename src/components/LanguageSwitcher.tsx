'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { languages } from '@/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
      className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
          {lang.code.toUpperCase()}
        </option>
      ))}
    </select>
  );
}