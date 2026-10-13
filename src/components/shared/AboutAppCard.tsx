import Icon from "@/components/ui/icon";
import { SURVEY_URL } from "@/components/shared/SurveyCard";

type Contact = { icon: string; label: string; value: string; href: string };

export const CONTACTS: Contact[] = [];

const features = [
  "Первая помощь пошагово и «красные флаги» — когда срочно к врачу",
  "Дозы лекарств по весу и домашняя аптечка со сроками годности",
  "Календарь прививок и плановых осмотров с напоминаниями",
  "Дневник болезни и отчёт для врача одним файлом",
  "Работает без интернета, данные хранятся на вашем устройстве",
];

export function AboutAppCard() {
  return (
    <div className="mt-8">
      <p className="font-semibold text-foreground text-sm mb-3">О приложении</p>

      <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/icon-192.png?v=2" alt="" className="w-12 h-12 rounded-2xl shadow-sm flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-caveat text-primary font-bold text-2xl leading-none">МалышДок</p>
            <p className="text-[11px] text-muted-foreground mt-1">Бесплатный помощник для родителей</p>
          </div>
        </div>

        <p className="text-[13px] text-foreground leading-relaxed mt-3">
          МалышДок помогает спокойно действовать, когда ребёнок заболел, и не упускать важное в заботе о его здоровье.
        </p>

        <ul className="mt-3 space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[12px] text-foreground leading-snug">
              <Icon name="Check" size={14} className="text-primary flex-shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
            <Icon name="GraduationCap" size={20} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-tight">Разработано при поддержке</p>
            <p className="text-[13px] font-semibold text-foreground leading-snug mt-0.5">
              Ярославского государственного медицинского университета
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">ФГБОУ ВО ЯГМУ Минздрава России</p>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Icon name="TriangleAlert" size={18} className="text-amber-700" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-amber-900 text-sm leading-tight">Приложение не заменяет врача</p>
          <p className="text-[12px] text-amber-900/80 leading-relaxed mt-1">
            Вся информация носит справочный характер. Диагноз и лечение назначает только врач после осмотра.
            Перед приёмом лекарств посоветуйтесь с педиатром. Если состояние ребёнка угрожает жизни — сразу
            звоните <a href="tel:103" className="font-bold underline">103</a> или{" "}
            <a href="tel:112" className="font-bold underline">112</a>.
          </p>
        </div>
      </div>

      <div className="mt-3 bg-card border border-border rounded-3xl p-4 shadow-sm">
        <p className="font-semibold text-foreground text-sm mb-1">Связаться с нами</p>
        <p className="text-[11px] text-muted-foreground leading-snug mb-3">
          Нашли ошибку или есть идея? Мы читаем каждое сообщение
        </p>
        <div className="space-y-2">
          {CONTACTS.map((c) => (
            <a
              key={c.href}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 active:scale-[0.98] transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
                <Icon name={c.icon} size={17} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground leading-tight">{c.label}</p>
                <p className="text-sm font-semibold text-foreground truncate">{c.value}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0" />
            </a>
          ))}
          {SURVEY_URL && (
            <a
              href={SURVEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 active:scale-[0.98] transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
                <Icon name="ClipboardList" size={17} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground leading-tight">5–7 минут</p>
                <p className="text-sm font-semibold text-foreground">Пройти опрос</p>
              </div>
              <Icon name="ExternalLink" size={16} className="text-muted-foreground flex-shrink-0" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}