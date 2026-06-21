import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  useSectionVisibility,
  setSectionVisible,
  type ToggleableSection,
} from "@/components/shared/sectionVisibility";
import { useChildProfile, calcAge } from "@/components/shared/childProfile";

const items: {
  id: ToggleableSection;
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    id: "development",
    emoji: "🌱",
    title: "Развитие ребёнка 0–3 года",
    description: "Нервно-психическое развитие и организация прикорма",
  },
];

export function SettingsSection() {
  const visibility = useSectionVisibility();
  const profile = useChildProfile();
  const age = calcAge(profile.birthDate);

  const suggestHideDevelopment = Boolean(age && age.years >= 3 && visibility.development);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="⚙️"
        title="Настройки"
        subtitle="Какие разделы показывать на главном экране"
      />

      <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
        Эти разделы актуальны для детей определённого возраста. Если они вам сейчас
        не нужны — выключите, и они скроются с главного экрана.
      </p>

      {suggestHideDevelopment && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-violet-200 flex items-center justify-center text-lg flex-shrink-0">
            🌱
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm leading-tight">
              {profile.name || "Малышу"} уже больше 3 лет
            </p>
            <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">
              Раздел «Развитие ребёнка 0–3 года» рассчитан на ранний возраст. Возможно, он вам больше не нужен.
            </p>
            <button
              onClick={() => setSectionVisible("development", false)}
              className="mt-2 inline-flex items-center gap-1.5 bg-violet-500 text-white text-xs font-semibold rounded-xl px-3 py-1.5 active:scale-95 transition-transform"
            >
              <Icon name="EyeOff" size={14} />
              Скрыть раздел
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const enabled = visibility[item.id];
          return (
            <div
              key={item.id}
              className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center text-xl flex-shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => setSectionVisible(item.id, !enabled)}
                role="switch"
                aria-checked={enabled}
                aria-label={`${enabled ? "Скрыть" : "Показать"} раздел ${item.title}`}
                className={`relative w-12 h-7 rounded-full flex-shrink-0 transition-colors ${
                  enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                    enabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-2 text-[11px] text-muted-foreground bg-muted/40 rounded-xl p-3">
        <Icon name="Info" size={14} className="flex-shrink-0 mt-0.5" />
        <span>Скрытые разделы можно вернуть здесь в любой момент.</span>
      </div>
    </SectionWrapper>
  );
}

export default SettingsSection;