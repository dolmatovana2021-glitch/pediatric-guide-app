import Icon from "@/components/ui/icon";

export const SURVEY_URL = "https://docs.google.com/forms/d/e/1FAIpQLScWY8v3-pfmJ_sY6XoGUEmJD_0XeN4UZIgleIJjR6BhINeEfw/viewform";

export function SurveyCard() {
  if (!SURVEY_URL) return null;

  return (
    <a
      href={SURVEY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mb-5 w-full rounded-3xl p-4 bg-primary text-primary-foreground shadow-md flex items-center gap-3 active:scale-[0.98] transition-transform"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
        <Icon name="ClipboardList" size={24} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-bold text-[15px] leading-tight">Пройти опрос</p>
        <p className="text-[12px] opacity-90 leading-snug mt-0.5">
          5–7 минут — помогите сделать МалышДок полезнее
        </p>
      </div>
      <Icon name="ExternalLink" size={18} className="flex-shrink-0 opacity-90" />
    </a>
  );
}