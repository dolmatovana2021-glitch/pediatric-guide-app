import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import { rashCategories, RASH_DISCLAIMER, type RashItem } from "@/components/shared/rashData";

function InfoRow({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon name={icon} size={15} className="text-primary flex-shrink-0 mt-0.5" />
      <p className="text-xs text-foreground leading-snug">
        <span className="font-semibold">{label}: </span>
        {text}
      </p>
    </div>
  );
}

function ListBlock({
  icon,
  iconColor,
  title,
  items,
  itemBg,
}: {
  icon: string;
  iconColor: string;
  title: string;
  items: string[];
  itemBg: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
        {title}
      </p>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className={`flex items-start gap-2 border rounded-xl px-3 py-2 ${itemBg}`}>
            <Icon name={icon} size={15} className={`${iconColor} flex-shrink-0 mt-0.5`} />
            <span className="text-xs text-foreground leading-snug">{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RashDetails({ item }: { item: RashItem }) {
  return (
    <div className="px-3.5 pb-3.5 space-y-3 animate-fade-in">
      <div className="bg-mint-50 border border-mint-200 rounded-xl p-3 space-y-2">
        <InfoRow icon="Bug" label="Причина" text={item.cause} />
        <InfoRow icon="Clock" label="Инкубационный период" text={item.incubation} />
        <InfoRow icon="ScanFace" label="Характер сыпи" text={item.rash} />
      </div>

      <ListBlock
        icon="Activity"
        iconColor="text-sky-600"
        title="Сопутствующие симптомы"
        items={item.symptoms}
        itemBg="bg-sky-50 border-sky-100"
      />

      <ListBlock
        icon="HeartPulse"
        iconColor="text-emerald-600"
        title="Лечение и тактика"
        items={item.treatment}
        itemBg="bg-emerald-50 border-emerald-100"
      />

      <ListBlock
        icon="TriangleAlert"
        iconColor="text-rose-600"
        title="Когда срочно к врачу"
        items={item.urgent}
        itemBg="bg-rose-50 border-rose-100"
      />

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
        <Icon name="Info" size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] text-amber-800 leading-snug">{RASH_DISCLAIMER}</span>
      </div>
    </div>
  );
}

export function RashSection() {
  const [openCat, setOpenCat] = useState<string | null>(rashCategories[0]?.id ?? null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredCategories = rashCategories
    .map((cat) => ({
      ...cat,
      items: q ? cat.items.filter((i) => i.title.toLowerCase().includes(q)) : cat.items,
    }))
    .filter((cat) => cat.items.length > 0);

  const totalFound = filteredCategories.reduce((n, c) => n + c.items.length, 0);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🔴"
        title="Сыпь у детей"
        subtitle="Основные виды инфекционных и неинфекционных сыпей"
      />

      <div className="relative mb-3">
        <Icon
          name="Search"
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию..."
          className="block w-full max-w-full min-w-0 box-border appearance-none pl-9 pr-9 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Очистить"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground active:scale-90 transition"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {q && totalFound === 0 && (
        <div className="bg-white border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
          Ничего не найдено по запросу «{query}»
        </div>
      )}

      <div className="space-y-3">
        {filteredCategories.map((cat) => {
          const open = q ? true : openCat === cat.id;
          return (
            <div
              key={cat.id}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => !q && setOpenCat(open ? null : cat.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span className="text-2xl flex-shrink-0">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm leading-tight">
                    {cat.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {q ? `Найдено: ${cat.items.length}` : `${cat.items.length} видов`}
                  </p>
                </div>
                {!q && (
                  <Icon
                    name={open ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-muted-foreground flex-shrink-0"
                  />
                )}
              </button>

              {open && (
                <div className="px-3 pb-3 space-y-2 animate-fade-in">
                  {cat.items.map((item) => {
                    const itemOpen = openItem === item.id;
                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-border rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenItem(itemOpen ? null : item.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-3 text-left"
                        >
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          <span className="flex-1 text-sm font-medium text-foreground leading-snug">
                            {item.title}
                          </span>
                          <Icon
                            name={itemOpen ? "ChevronUp" : "ChevronDown"}
                            size={16}
                            className="text-muted-foreground flex-shrink-0"
                          />
                        </button>
                        {itemOpen && <RashDetails item={item} />}
                      </div>
                    );
                  })}
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