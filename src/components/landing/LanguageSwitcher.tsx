"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' }
];

export function LanguageSwitcher() {
  const [lang, setLang] = useState<string>('en');

  // Sync initial language state from cookie and Google Translate combo box
  useEffect(() => {
    // 1. Immediately try to read from cookie (fastest sync)
    const match = document.cookie.match(/googtrans=\/[^\/]+\/([^;]+)/);
    if (match && match[1]) {
      setLang(match[1]);
    }

    // 2. Poll the combo box to catch changes natively executed by Google Translate
    const checkGoogleTranslate = setInterval(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select && select.value) {
        setLang((prevLang) => {
          if (prevLang !== select.value) return select.value;
          return prevLang;
        });
      }
    }, 500);

    return () => clearInterval(checkGoogleTranslate);
  }, []);

  const selectedLangName = languages.find(l => l.code === lang)?.name || 'English';

  const handleLangChange = (code: string) => {
    setLang(code);
    
    // Set the cookie directly in case the widget hasn't loaded fully or event fails
    document.cookie = `googtrans=/en/${code}; path=/`;
    document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname}`;
    
    // Command the hidden Google Translate combo box to change language
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = code;
      // Google Translate requires the event to bubble
      select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    } else {
      // Fallback: If combo box isn't found, reload to apply cookie
      window.location.reload();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 text-sm font-medium cursor-pointer text-[#0F1729] dark:text-slate-100 hover:text-primary transition-colors hover:scale-105 active:scale-95 transition-all duration-300">
          <Globe className="w-4 h-4" /> <span className="hidden sm:inline notranslate">{selectedLangName}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] notranslate">
        {languages.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => handleLangChange(l.code)} className="cursor-pointer">
            {l.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
