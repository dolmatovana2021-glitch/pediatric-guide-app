import { useCallback } from "react";
import Icon from "@/components/ui/icon";
import {
  Section,
  SectionWrapper,
} from "@/components/shared/SectionShared";
import { useChildProfile, calcAge } from "@/components/shared/childProfile";
import { useDueVaccines } from "@/components/shared/vaccineStatus";
import { useDueCheckup } from "@/components/shared/checkupStatus";
import { useSectionVisibility, isSectionVisible } from "@/components/shared/sectionVisibility";
import { HomeHero } from "@/components/sections/HomeHero";
import { DailyTipCard } from "@/components/sections/DailyTipCard";
import { InstallAppCard } from "@/components/shared/InstallAppCard";
import { BackupReminderCard } from "@/components/sections/BackupReminderCard";
import { QuickTemperatureButton } from "@/components/sections/QuickTemperature";

type QuickCard = {
  id: Section;
  icon: string;
  label: string;
  hint: string;
  group: "urgent" | "care";
  tile: string;
  ink: string;
};

const groups: { id: QuickCard["group"]; title: string }[] = [
  { id: "urgent", title: "Если малыш заболел" },
  { id: "care", title: "Забота и развитие" },
];

function SectionTile({ card, onClick }: { card: QuickCard; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${card.tile} bg-gradient-to-br rounded-3xl p-4 text-left text-foreground shadow-md active:scale-[0.97] transition-transform`}
    >
      <div className="flex items-start justify-between">
        <Icon name={card.icon} fallback="Circle" size={24} className={card.ink} />
        <Icon name="ChevronRight" size={16} className="text-foreground/50" />
      </div>
      <p className="font-bold text-sm mt-2 leading-tight">{card.label}</p>
      <p className="text-[11px] text-foreground/65 truncate">{card.hint}</p>
    </button>
  );
}

export function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
  const profile = useChildProfile();
  const age = calcAge(profile.birthDate);
  const quickCards: QuickCard[] = [
    { id: "firstaid", icon: "Ambulance", label: "Первая помощь", hint: "Пошагово", group: "urgent", tile: "from-red-100 to-red-200 shadow-red-300/30", ink: "text-red-600 dark:text-red-400" },
    { id: "redflags", icon: "Flag", label: "Красные флаги", hint: "Когда к врачу", group: "urgent", tile: "from-pink-100 to-pink-200 shadow-pink-300/30", ink: "text-pink-600 dark:text-pink-400" },
    { id: "rash", icon: "ScanSearch", label: "Сыпь", hint: "Что это может быть", group: "urgent", tile: "from-rose-100 to-rose-200 shadow-rose-300/30", ink: "text-rose-600 dark:text-rose-400" },
    { id: "illness", icon: "Thermometer", label: "Дневник болезни", hint: "Ход болезни", group: "urgent", tile: "from-orange-100 to-orange-200 shadow-orange-300/30", ink: "text-orange-600 dark:text-orange-400" },
    { id: "medkit", icon: "Pill", label: "Аптечка", hint: "Дозы и сроки", group: "care", tile: "from-teal-100 to-teal-200 shadow-teal-300/30", ink: "text-teal-600 dark:text-teal-400" },
    { id: "development", icon: "Sprout", label: "Развитие", hint: "Нормы и режим", group: "care", tile: "from-violet-100 to-violet-200 shadow-violet-300/30", ink: "text-violet-600 dark:text-violet-400" },
    { id: "vaccination", icon: "Syringe", label: "Вакцинация", hint: "График прививок", group: "care", tile: "from-mint-100 to-mint-200 shadow-mint-300/30", ink: "text-mint-600 dark:text-mint-400" },
    { id: "checkup", icon: "Stethoscope", label: "Осмотры", hint: "Плановые визиты", group: "care", tile: "from-sky-100 to-sky-200 shadow-sky-300/30", ink: "text-sky-600 dark:text-sky-400" },
    { id: "contacts", icon: "UserRound", label: "Врачи", hint: "Контакты", group: "care", tile: "from-cyan-100 to-cyan-200 shadow-cyan-300/30", ink: "text-cyan-600 dark:text-cyan-400" },
    { id: "docs", icon: "FileText", label: "Документы", hint: "Справки и формы", group: "care", tile: "from-slate-100 to-slate-200 shadow-slate-300/30", ink: "text-slate-600 dark:text-slate-400" },
    { id: "useful", icon: "Link", label: "Полезное", hint: "Статьи и сервисы", group: "care", tile: "from-amber-100 to-amber-200 shadow-amber-300/30", ink: "text-amber-600 dark:text-amber-400" },
    { id: "settings", icon: "Settings", label: "Настройки", hint: "Тема и разделы", group: "care", tile: "from-gray-100 to-gray-200 shadow-gray-300/30", ink: "text-gray-600 dark:text-gray-400" },
  ];


  const visibility = useSectionVisibility();
  const visibleCards = quickCards.filter((card) => isSectionVisible(card.id, visibility));
  const isVisible = useCallback((id: Section) => isSectionVisible(id, visibility), [visibility]);

  const profileFilled = profile.name || profile.birthDate || profile.weight;
  const dueVaccines = useDueVaccines();
  const m10 = dueVaccines % 10;
  const m100 = dueVaccines % 100;
  const dueWord =
    m10 === 1 && m100 !== 11 ? "прививку" : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? "прививки" : "прививок";
  const dueCheckup = useDueCheckup();

  return (
    <SectionWrapper>
      <HomeHero
        name={profile.name || undefined}
        details={[age?.label, profile.weight ? `${profile.weight} кг` : ""].filter(Boolean).join(" · ")}
        emoji={profile.gender === "boy" ? "👦" : profile.gender === "girl" ? "👧" : "🧒"}
        profileFilled={Boolean(profileFilled)}
        onEmergency={() => setSection("emergency")}
        onProfile={() => setSection("profile")}
      />

      <QuickTemperatureButton setSection={setSection} />

      {dueVaccines > 0 && (
        <button
          onClick={() => setSection("vaccination")}
          className="w-full mb-3 rounded-3xl p-3.5 border border-red-200 bg-red-50 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0 relative">
            <span className="text-2xl">💉</span>
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
              {dueVaccines}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-bold text-red-700 text-sm">Пора сделать {dueVaccines} {dueWord}</p>
            <p className="text-[11px] text-red-600/80">По возрасту ребёнка — обсудите с педиатром</p>
          </div>
          <Icon name="ChevronRight" size={18} className="text-red-400 flex-shrink-0" />
        </button>
      )}

      {dueCheckup && (
        <button
          onClick={() => setSection("checkup")}
          className="w-full mb-3 rounded-3xl p-3.5 border border-sky-200 bg-sky-50 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-11 h-11 rounded-2xl bg-sky-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🩺</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-bold text-sky-700 text-sm">Пора на осмотр: {dueCheckup.age}</p>
            <p className="text-[11px] text-sky-600/80">По возрасту ребёнка — отметьте, когда пройдёте</p>
          </div>
          <Icon name="ChevronRight" size={18} className="text-sky-400 flex-shrink-0" />
        </button>
      )}

      {(dueVaccines > 0 || dueCheckup) && <div className="h-2" />}

      <InstallAppCard />

      <BackupReminderCard />

      {groups.map((g) => {
        const cards = visibleCards.filter((c) => c.group === g.id);
        if (!cards.length) return null;
        return (
          <div key={g.id} className="mb-5">
            <h3 className="font-bold text-[15px] text-foreground mb-2.5 px-1">{g.title}</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {cards.map((card) => (
                <SectionTile key={card.id} card={card} onClick={() => setSection(card.id)} />
              ))}
            </div>
          </div>
        );
      })}

      <DailyTipCard
        ageMonths={age ? age.years * 12 + age.months : null}
        setSection={setSection}
        isVisible={isVisible}
      />
    </SectionWrapper>
  );
}