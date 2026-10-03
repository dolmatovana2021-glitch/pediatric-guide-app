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

type QuickCard = {
  id: Section;
  emoji: string;
  label: string;
  hint: string;
  group: "urgent" | "care";
  tile: string;
  chip: string;
};

const groups: { id: QuickCard["group"]; title: string }[] = [
  { id: "urgent", title: "Если малыш заболел" },
  { id: "care", title: "Забота и развитие" },
];

function SectionTile({ card, onClick }: { card: QuickCard; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${card.tile} border rounded-3xl p-3 flex items-center gap-3 text-left active:scale-[0.97] transition-transform`}
    >
      <span className={`${card.chip} w-11 h-11 rounded-2xl flex items-center justify-center text-[22px] flex-shrink-0`}>
        {card.emoji}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-bold text-foreground leading-tight">{card.label}</span>
        <span className="block text-[11px] text-muted-foreground leading-snug mt-0.5 truncate">{card.hint}</span>
      </span>
    </button>
  );
}

export function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
  const profile = useChildProfile();
  const age = calcAge(profile.birthDate);
  const quickCards: QuickCard[] = [
    { id: "firstaid", emoji: "🚑", label: "Первая помощь", hint: "Пошагово", group: "urgent", tile: "bg-red-50 border-red-200", chip: "bg-red-100" },
    { id: "redflags", emoji: "🚩", label: "Красные флаги", hint: "Когда к врачу", group: "urgent", tile: "bg-pink-50 border-pink-200", chip: "bg-pink-100" },
    { id: "rash", emoji: "🔴", label: "Сыпь", hint: "Что это может быть", group: "urgent", tile: "bg-rose-50 border-rose-200", chip: "bg-rose-100" },
    { id: "illness", emoji: "🤒", label: "Дневник болезни", hint: "Ход болезни", group: "urgent", tile: "bg-orange-50 border-orange-200", chip: "bg-orange-100" },
    { id: "medkit", emoji: "💊", label: "Аптечка", hint: "Дозы и сроки", group: "care", tile: "bg-teal-50 border-teal-200", chip: "bg-teal-100" },
    { id: "development", emoji: "🌱", label: "Развитие", hint: "Нормы и режим", group: "care", tile: "bg-violet-50 border-violet-200", chip: "bg-violet-100" },
    { id: "vaccination", emoji: "💉", label: "Вакцинация", hint: "График прививок", group: "care", tile: "bg-mint-50 border-mint-200", chip: "bg-mint-100" },
    { id: "checkup", emoji: "🩺", label: "Осмотры", hint: "Плановые визиты", group: "care", tile: "bg-sky-50 border-sky-200", chip: "bg-sky-100" },
    { id: "contacts", emoji: "👩‍⚕️", label: "Врачи", hint: "Контакты", group: "care", tile: "bg-teal-50 border-teal-200", chip: "bg-teal-100" },
    { id: "docs", emoji: "📄", label: "Документы", hint: "Справки и формы", group: "care", tile: "bg-slate-50 border-slate-200", chip: "bg-slate-100" },
    { id: "useful", emoji: "🔗", label: "Полезное", hint: "Статьи и сервисы", group: "care", tile: "bg-amber-50 border-amber-200", chip: "bg-amber-100" },
    { id: "settings", emoji: "⚙️", label: "Настройки", hint: "Тема и разделы", group: "care", tile: "bg-gray-50 border-gray-200", chip: "bg-gray-100" },
  ];

  const visibility = useSectionVisibility();
  const visibleCards = quickCards.filter((card) => isSectionVisible(card.id, visibility));
  const isVisible = useCallback((id: Section) => isSectionVisible(id, visibility), [visibility]);

  const profileFilled = profile.name || profile.birthDate || profile.weight;
  const dueVaccines = useDueVaccines();
  const dueWord = dueVaccines === 1 ? "прививку" : dueVaccines >= 2 && dueVaccines <= 4 ? "прививки" : "прививок";
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