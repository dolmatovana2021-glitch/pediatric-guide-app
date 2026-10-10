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
};

const groups: { id: QuickCard["group"]; title: string }[] = [
  { id: "urgent", title: "Если малыш заболел" },
  { id: "care", title: "Забота и развитие" },
];

function SectionTile({ card, onClick }: { card: QuickCard; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${card.tile} rounded-3xl p-4 text-left text-white shadow-md active:scale-[0.97] transition-transform`}
    >
      <div className="flex items-start justify-between">
        <Icon name={card.icon} fallback="Circle" size={24} />
        <Icon name="ChevronRight" size={16} className="text-white/80" />
      </div>
      <p className="font-bold text-sm mt-2 leading-tight">{card.label}</p>
      <p className="text-[11px] text-white/85 truncate">{card.hint}</p>
    </button>
  );
}

export function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
  const profile = useChildProfile();
  const age = calcAge(profile.birthDate);
  const quickCards: QuickCard[] = [
    { id: "firstaid", icon: "Ambulance", label: "Первая помощь", hint: "Пошагово", group: "urgent", tile: "bg-red-600 shadow-red-600/20" },
    { id: "redflags", icon: "Flag", label: "Красные флаги", hint: "Когда к врачу", group: "urgent", tile: "bg-pink-500 shadow-pink-500/20" },
    { id: "rash", icon: "ScanSearch", label: "Сыпь", hint: "Что это может быть", group: "urgent", tile: "bg-rose-500 shadow-rose-500/20" },
    { id: "illness", icon: "Thermometer", label: "Дневник болезни", hint: "Ход болезни", group: "urgent", tile: "bg-orange-500 shadow-orange-500/20" },
    { id: "medkit", icon: "Pill", label: "Аптечка", hint: "Дозы и сроки", group: "care", tile: "bg-teal-600 shadow-teal-600/20" },
    { id: "development", icon: "Sprout", label: "Развитие", hint: "Нормы и режим", group: "care", tile: "bg-violet-500 shadow-violet-500/20" },
    { id: "vaccination", icon: "Syringe", label: "Вакцинация", hint: "График прививок", group: "care", tile: "bg-mint-500 shadow-mint-500/20" },
    { id: "checkup", icon: "Stethoscope", label: "Осмотры", hint: "Плановые визиты", group: "care", tile: "bg-sky-600 shadow-sky-600/20" },
    { id: "contacts", icon: "UserRound", label: "Врачи", hint: "Контакты", group: "care", tile: "bg-cyan-700 shadow-cyan-700/20" },
    { id: "docs", icon: "FileText", label: "Документы", hint: "Справки и формы", group: "care", tile: "bg-slate-500 shadow-slate-500/20" },
    { id: "useful", icon: "Link", label: "Полезное", hint: "Статьи и сервисы", group: "care", tile: "bg-amber-600 shadow-amber-600/20" },
    { id: "settings", icon: "Settings", label: "Настройки", hint: "Тема и разделы", group: "care", tile: "bg-gray-500 shadow-gray-500/20" },
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