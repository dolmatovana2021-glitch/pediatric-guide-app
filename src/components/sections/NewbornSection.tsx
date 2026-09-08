import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import { newbornBlocks, NEWBORN_DISCLAIMER } from "@/components/shared/newbornData";

export function NewbornSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="👶"
        title="Новорождённый"
        subtitle="Первый месяц: уход, нормы и тревожные признаки"
      />

      <div className="space-y-3">
        {newbornBlocks.map((block, i) => {
          const isOpen = open === i;
          return (
            <div
              key={block.title}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${block.color}`}
                >
                  <Icon name={block.icon} fallback="Baby" size={18} />
                </div>
                <p className="flex-1 text-left font-semibold text-foreground text-sm">
                  {block.title}
                </p>
                <Icon
                  name="ChevronDown"
                  size={18}
                  className={`text-muted-foreground flex-shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 animate-fade-in">
                  {block.intro && (
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                      {block.intro}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-2 text-[13px] text-foreground leading-snug">
                        <Icon
                          name="Dot"
                          size={18}
                          className="text-primary flex-shrink-0 -ml-1"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground leading-snug mt-6">
        {NEWBORN_DISCLAIMER}
      </p>
    </SectionWrapper>
  );
}

export default NewbornSection;
