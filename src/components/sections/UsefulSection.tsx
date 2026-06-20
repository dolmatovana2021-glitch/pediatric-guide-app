import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";

export type UsefulLink = {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon: string;
};

export const usefulLinks: UsefulLink[] = [];

export function UsefulSection() {
  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🔗"
        title="Полезное"
        subtitle="Основные ссылки и материалы для родителей"
      />

      {usefulLinks.length === 0 ? (
        <div className="bg-white border border-dashed border-border rounded-2xl p-8 text-center">
          <Icon name="Link" size={28} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-[13px] text-muted-foreground">
            Ссылки скоро появятся здесь
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {usefulLinks.map((link) => (
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
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug truncate">
                    {link.description}
                  </p>
                )}
              </div>
              <Icon name="ExternalLink" size={16} className="text-muted-foreground flex-shrink-0" />
            </a>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}

export default UsefulSection;
