import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import { rashCategories } from "@/components/shared/rashData";

export function RashSection() {
  const [openCat, setOpenCat] = useState<string | null>(rashCategories[0]?.id ?? null);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🔴"
        title="Сыпь у детей"
        subtitle="Основные виды инфекционных и неинфекционных сыпей"
      />

      <div className="space-y-3">
        {rashCategories.map((cat) => {
          const open = openCat === cat.id;
          return (
            <div
              key={cat.id}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenCat(open ? null : cat.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span className="text-2xl flex-shrink-0">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm leading-tight">
                    {cat.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {cat.items.length} видов
                  </p>
                </div>
                <Icon
                  name={open ? "ChevronUp" : "ChevronDown"}
                  size={18}
                  className="text-muted-foreground flex-shrink-0"
                />
              </button>

              {open && (
                <div className="px-4 pb-4 space-y-1.5 animate-fade-in">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 bg-mint-50 border border-mint-200 rounded-xl px-3 py-2.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-foreground leading-snug">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

export default RashSection;
