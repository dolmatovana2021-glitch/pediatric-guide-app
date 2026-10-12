import { useState } from "react";
import Icon from "@/components/ui/icon";

export const SURVEY_URL = "https://docs.google.com/forms/d/e/1FAIpQLScWY8v3-pfmJ_sY6XoGUEmJD_0XeN4UZIgleIJjR6BhINeEfw/viewform";

const HIDE_KEY = "malyshdok:survey-hidden";

function isHidden() {
  try {
    return localStorage.getItem(HIDE_KEY) === "1";
  } catch {
    return false;
  }
}

function hide() {
  try {
    localStorage.setItem(HIDE_KEY, "1");
  } catch {
    return;
  }
}

export function SurveyCard() {
  const [hidden, setHidden] = useState(isHidden);

  if (!SURVEY_URL || hidden) return null;

  const close = () => {
    hide();
    setHidden(true);
  };

  return (
    <div className="mb-5 relative">
      <a
        href={SURVEY_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setTimeout(close, 300)}
        className="w-full rounded-3xl p-4 pr-12 bg-primary text-primary-foreground shadow-md flex items-center gap-3 active:scale-[0.98] transition-transform"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
          <Icon name="ClipboardList" size={24} />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-bold text-[15px] leading-tight flex items-center gap-1.5">
            Пройти опрос
            <Icon name="ExternalLink" size={14} className="opacity-90" />
          </p>
          <p className="text-[12px] opacity-90 leading-snug mt-0.5">
            5–7 минут — помогите сделать МалышДок полезнее
          </p>
        </div>
      </a>
      <button
        onClick={close}
        aria-label="Скрыть опрос"
        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground/90 hover:bg-primary-foreground/15 active:scale-90 transition-transform"
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  );
}
