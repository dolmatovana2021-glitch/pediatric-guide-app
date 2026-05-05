import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import {
  redFlags,
  SectionWrapper,
  SectionTitle,
} from "@/components/shared/SectionShared";

const QUICK_TAGS = [
  "температура",
  "сыпь",
  "судороги",
  "рвота",
  "дыхание",
  "сонливость",
  "обезвоживание",
  "синюшность",
];

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const q = query.trim().toLowerCase();
  const lower = text.toLowerCase();
  const parts: { t: string; m: boolean }[] = [];
  let i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(q, i);
    if (idx === -1) {
      parts.push({ t: text.slice(i), m: false });
      break;
    }
    if (idx > i) parts.push({ t: text.slice(i, idx), m: false });
    parts.push({ t: text.slice(idx, idx + q.length), m: true });
    i = idx + q.length;
  }
  return parts.map((p, j) =>
    p.m ? (
      <mark key={j} className="bg-yellow-200 text-rose-900 rounded px-0.5">
        {p.t}
      </mark>
    ) : (
      <span key={j}>{p.t}</span>
    ),
  );
}

export function RedFlagsSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filteredFlags = useMemo(() => {
    if (!q) return redFlags.map((f) => ({ flag: f, matches: 0 }));
    return redFlags
      .map((flag) => {
        let matches = 0;
        const inTitle = flag.title.toLowerCase().includes(q) || flag.desc.toLowerCase().includes(q);
        if (inTitle) matches += 5;
        flag.groups.forEach((g) => {
          if (g.title.toLowerCase().includes(q)) matches += 2;
          g.items.forEach((it) => {
            if (it.toLowerCase().includes(q)) matches += 1;
          });
        });
        return { flag, matches };
      })
      .filter((x) => x.matches > 0)
      .sort((a, b) => b.matches - a.matches);
  }, [q]);

  const totalMatches = filteredFlags.reduce((s, x) => s + x.matches, 0);

  return (
    <SectionWrapper>
      <SectionTitle emoji="🚩" title="Красные флаги" subtitle="Симптомы, при которых нужно срочно к врачу" />

      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 flex gap-2 items-start">
        <span className="text-base flex-shrink-0">⚠️</span>
        <p className="text-xs text-rose-700 leading-relaxed">
          Это сигналы организма, которые нельзя игнорировать. Если видите хотя бы один — немедленно к врачу или 103.
        </p>
      </div>

      <div className="bg-white border border-mint-200 rounded-2xl p-3 mb-3 shadow-sm">
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(null);
            }}
            placeholder="Найти симптом: рвота, сыпь, температура..."
            className="w-full pl-10 pr-10 py-2.5 bg-mint-50 border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-mint-100 flex items-center justify-center text-muted-foreground"
              aria-label="Очистить"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                setOpen(null);
              }}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition ${
                q === tag
                  ? "bg-primary text-white border-primary"
                  : "bg-mint-50 text-primary border-mint-200 hover:bg-mint-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {q && (
          <p className="text-[11px] text-muted-foreground mt-2.5">
            {filteredFlags.length === 0
              ? "Ничего не найдено — попробуйте другое слово"
              : `Найдено совпадений: ${totalMatches} в ${filteredFlags.length} ${
                  filteredFlags.length === 1 ? "разделе" : "разделах"
                }`}
          </p>
        )}
      </div>

      {filteredFlags.length === 0 && q ? (
        <div className="bg-white border border-mint-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-sm font-semibold text-foreground mb-1">Ничего не нашли</p>
          <p className="text-xs text-muted-foreground mb-3">
            Если симптом тревожит — лучше сразу позвонить 103
          </p>
          <a
            href="tel:103"
            className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <Icon name="Phone" size={14} />
            Скорая 103
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFlags.map(({ flag, matches }, i) => {
            const isOpen = open === i || (q.length > 0 && matches > 0);
            return (
              <div
                key={i}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${flag.color.split(" ")[2]}`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div
                    className={`${flag.color} w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border`}
                  >
                    <Icon name={flag.icon} fallback="Flag" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm leading-tight">
                      {highlight(flag.title, q)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {highlight(flag.desc, q)}
                    </p>
                  </div>
                  {q && matches > 0 && (
                    <span className="text-[10px] font-bold bg-yellow-200 text-rose-900 rounded-full px-2 py-0.5 flex-shrink-0">
                      {matches}
                    </span>
                  )}
                  <Icon
                    name={isOpen ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-muted-foreground flex-shrink-0"
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 animate-fade-in space-y-3">
                    {flag.groups
                      .filter((group) => {
                        if (!q) return true;
                        return (
                          group.title.toLowerCase().includes(q) ||
                          group.items.some((it) => it.toLowerCase().includes(q))
                        );
                      })
                      .map((group, gi) => {
                        const isWarn = /НЕ делать/i.test(group.title);
                        const items = q
                          ? group.items.filter((it) => it.toLowerCase().includes(q) || group.title.toLowerCase().includes(q))
                          : group.items;
                        return (
                          <div
                            key={gi}
                            className={`rounded-xl p-3 border ${
                              isWarn
                                ? "bg-amber-50 border-amber-200"
                                : "bg-rose-50/50 border-rose-100"
                            }`}
                          >
                            <p
                              className={`text-xs font-bold uppercase tracking-wide mb-2 ${
                                isWarn ? "text-amber-700" : "text-rose-700"
                              }`}
                            >
                              {isWarn ? "⛔ " : "🚩 "}
                              {highlight(group.title, q)}
                            </p>
                            <ul className="space-y-1.5">
                              {items.map((item, j) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
                                >
                                  <span
                                    className={`flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${
                                      isWarn ? "bg-amber-500" : "bg-rose-500"
                                    }`}
                                  />
                                  <span>{highlight(item, q)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    <div className="bg-mint-50 border border-mint-200 rounded-xl p-3">
                      <p className="text-xs font-bold text-primary mb-1">✅ Главное действие</p>
                      <p className="text-sm text-foreground leading-relaxed">{flag.action}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SectionWrapper>
  );
}
