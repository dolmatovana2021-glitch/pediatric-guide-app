import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import { docForms, DOCS_DISCLAIMER } from "@/components/shared/docsData";

export function DocsSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="📄"
        title="Медицинская документация"
        subtitle="Какие справки нужны для сада, школы, лагеря и санатория"
      />

      <div className="space-y-2.5">
        {docForms.map((form) => {
          const isOpen = openId === form.id;
          return (
            <div
              key={form.id}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : form.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left active:scale-[0.99] transition-transform"
              >
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 text-lg ${form.color}`}
                >
                  {form.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm leading-tight">
                    Форма {form.code}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {form.short}
                  </p>
                </div>
                <Icon
                  name={isOpen ? "ChevronUp" : "ChevronDown"}
                  size={18}
                  className="text-muted-foreground flex-shrink-0"
                />
              </button>

              {isOpen && (
                <div className="px-3.5 pb-3.5 space-y-3 animate-fade-in">
                  <p className="text-[13px] font-semibold text-foreground leading-snug">
                    {form.name}
                  </p>

                  <p className="text-[12px] text-foreground leading-relaxed">
                    {form.purpose}
                  </p>

                  <div className="bg-mint-50 border border-mint-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <Icon
                        name="MapPin"
                        size={14}
                        className="text-primary flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-[11px] font-bold text-foreground">Где получить</p>
                        <p className="text-[12px] text-foreground leading-snug">
                          {form.whereToGet}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon
                        name="CalendarClock"
                        size={14}
                        className="text-primary flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-[11px] font-bold text-foreground">Срок действия</p>
                        <p className="text-[12px] text-foreground leading-snug">
                          {form.validity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {form.sections.map((section) => (
                    <div
                      key={section.title}
                      className="bg-sky-50 border border-sky-100 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon name="ListChecks" size={15} className="text-sky-600" />
                        <span className="text-[13px] font-bold text-sky-800">
                          {section.title}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Icon
                              name="Check"
                              size={13}
                              className="text-emerald-600 flex-shrink-0 mt-0.5"
                            />
                            <span className="text-[12px] text-foreground leading-snug">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon name="Lightbulb" size={15} className="text-amber-600" />
                      <span className="text-[13px] font-bold text-amber-800">
                        Советы родителям
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {form.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                          <span className="text-[12px] text-amber-900 leading-snug">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 bg-white border border-border rounded-xl px-3 py-2.5 mt-4 shadow-sm">
        <Icon name="Info" size={15} className="text-muted-foreground flex-shrink-0 mt-0.5" />
        <span className="text-[11px] text-muted-foreground leading-snug">
          {DOCS_DISCLAIMER}
        </span>
      </div>
    </SectionWrapper>
  );
}

export default DocsSection;
