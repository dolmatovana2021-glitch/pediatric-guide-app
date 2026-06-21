import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";

export type UsefulLink = {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon: string;
};

export type UsefulGroup = {
  id: string;
  title: string;
  emoji: string;
  links: UsefulLink[];
};

export const usefulGroups: UsefulGroup[] = [
  {
    id: "breastfeeding",
    title: "Для кормящих мам",
    emoji: "🤱",
    links: [
      {
        id: "e-lactation",
        title: "E-Лактация",
        description: "Совместимость лекарств с грудным вскармливанием",
        url: "https://e-lactation.ru/",
        icon: "Pill",
      },
    ],
  },
  {
    id: "vaccination",
    title: "Всё о вакцинации и не только",
    emoji: "💉",
    links: [
      {
        id: "vaccina-info",
        title: "АНО «Коллективный иммунитет»",
        description: "Достоверная информация о прививках и инфекциях",
        url: "https://vaccina.info/",
        icon: "ShieldCheck",
      },
    ],
  },
  {
    id: "feeding",
    title: "Всё о прикормах",
    emoji: "🥣",
    links: [
      {
        id: "nczd-feeding",
        title: "Программа вскармливания детей 1-го года",
        description: "Методические рекомендации НМИЦ здоровья детей",
        url: "https://nczd.ru/wp-content/uploads/2019/12/Met_rekom_1_god_.pdf",
        icon: "FileText",
      },
    ],
  },
];

export function UsefulSection() {
  const hasLinks = usefulGroups.some((g) => g.links.length > 0);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🔗"
        title="Полезное"
        subtitle="Основные ссылки и материалы для родителей"
      />

      {!hasLinks ? (
        <div className="bg-white border border-dashed border-border rounded-2xl p-8 text-center">
          <Icon name="Link" size={28} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-[13px] text-muted-foreground">
            Ссылки скоро появятся здесь
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {usefulGroups
            .filter((g) => g.links.length > 0)
            .map((group) => (
              <div key={group.id}>
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                  <span className="text-lg">{group.emoji}</span>
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
                        <Icon name={link.icon} fallback="Link" size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm leading-tight truncate">
                          {link.title}
                        </p>
                        {link.description && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                            {link.description}
                          </p>
                        )}
                      </div>
                      <Icon name="ExternalLink" size={16} className="text-muted-foreground flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </SectionWrapper>
  );
}

export default UsefulSection;