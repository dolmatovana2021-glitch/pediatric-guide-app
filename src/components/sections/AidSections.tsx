import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import {
  Section,
  DOCTOR_BEAR,
  firstAidItems,
  emergencyItems,
  redFlags,
  dailyTips,
  SectionWrapper,
  SectionTitle,
} from "@/components/shared/SectionShared";

// HOME
export function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const [tipIndex, setTipIndex] = useState(dayOfYear % dailyTips.length);
  const [tipKey, setTipKey] = useState(0);
  const tipOfDay = dailyTips[tipIndex];
  const nextTip = () => {
    setTipIndex((tipIndex + 1) % dailyTips.length);
    setTipKey((k) => k + 1);
  };

  const quickCards: { id: Section; emoji: string; label: string; color: string }[] = [
    { id: "firstaid", emoji: "🚑", label: "Первая помощь", color: "bg-red-50 border-red-200 hover:border-red-300" },
    { id: "emergency", emoji: "🆘", label: "Неотложка", color: "bg-rose-50 border-rose-200 hover:border-rose-300" },
    { id: "redflags", emoji: "🚩", label: "Красные флаги", color: "bg-pink-50 border-pink-200 hover:border-pink-300" },
    { id: "diseases", emoji: "🌡️", label: "Болезни", color: "bg-orange-50 border-orange-200 hover:border-orange-300" },
    { id: "rashes", emoji: "🔬", label: "Сыпи", color: "bg-purple-50 border-purple-200 hover:border-purple-300" },
    { id: "contacts", emoji: "👩‍⚕️", label: "Врачи", color: "bg-teal-50 border-teal-200 hover:border-teal-300" },
  ];

  return (
    <SectionWrapper>
      <div className="blob-bg rounded-3xl p-6 mb-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="font-caveat text-primary text-lg font-semibold mb-1">Привет, родитель! 👋</p>
            <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
              МалышДок —<br />ваш педиатрический<br />помощник
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Первая помощь, болезни и неотложные ситуации — всё под рукой
            </p>
          </div>
          <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
            <img src={DOCTOR_BEAR} alt="Доктор" className="w-full h-full object-cover" />
          </div>
        </div>
        <button
          onClick={() => setSection("emergency")}
          className="mt-4 w-full bg-red-500 text-white rounded-2xl py-3 px-4 flex items-center justify-between font-semibold text-sm shadow-md active:scale-95 transition-transform"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🆘</span>
            Неотложная помощь!
          </span>
          <Icon name="ChevronRight" size={18} />
        </button>
      </div>

      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Разделы</h3>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {quickCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSection(card.id)}
            className={`${card.color} border rounded-2xl p-3 text-center card-hover flex flex-col items-center gap-1.5`}
          >
            <span className="text-2xl">{card.emoji}</span>
            <span className="text-xs font-semibold text-foreground">{card.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-mint-50 border border-mint-200 rounded-2xl p-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <p className="font-caveat text-primary text-base font-semibold">💡 Совет дня</p>
          <span
            key={`tag-${tipKey}`}
            className="text-[10px] font-semibold bg-mint-100 text-primary px-2 py-0.5 rounded-full animate-scale-in"
          >
            {tipOfDay.emoji} {tipOfDay.topic}
          </span>
          <span className="ml-auto text-[10px] text-muted-foreground font-medium">
            {tipIndex + 1}/{dailyTips.length}
          </span>
        </div>
        <p
          key={`text-${tipKey}`}
          className="text-sm text-foreground leading-relaxed mb-3 animate-fade-in"
        >
          {tipOfDay.text}
        </p>
        <button
          onClick={nextTip}
          className="w-full bg-white border border-mint-200 text-primary rounded-xl py-2 px-3 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform group"
        >
          Следующий совет
          <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </SectionWrapper>
  );
}

// FIRST AID
export function FirstAidSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <SectionWrapper>
      <SectionTitle emoji="🚑" title="Первая помощь" subtitle="Нажмите на ситуацию, чтобы увидеть шаги" />
      <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 flex gap-2 items-center">
        <span className="text-xl">📞</span>
        <p className="text-xs text-red-700 font-medium">При угрозе жизни звоните <strong className="text-base">103</strong> или <strong className="text-base">112</strong></p>
      </div>
      <div className="space-y-3">
        {firstAidItems.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <Icon name={item.icon} fallback="AlertCircle" size={20} />
                </div>
                <span className="font-semibold text-foreground">{item.title}</span>
              </div>
              <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground" />
            </button>
            {open === i && (
              <div className="px-4 pb-4 space-y-2 animate-fade-in">
                {item.steps.map((step, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// EMERGENCY
export function EmergencySection() {
  const [open, setOpen] = useState<number | null>(null);

  const urgencyBadge = (urgency: string) => {
    if (urgency.includes("Немедленно")) return "bg-red-500 text-white";
    if (urgency.includes("Вызвать")) return "bg-orange-400 text-white";
    return "bg-amber-400 text-white";
  };

  return (
    <SectionWrapper>
      <SectionTitle emoji="🆘" title="Неотложная помощь" subtitle="Опасные ситуации — что делать прямо сейчас" />

      <div className="grid grid-cols-2 gap-2 mb-5">
        <a href="tel:103" className="bg-red-500 text-white rounded-2xl p-3 text-center active:scale-95 transition-transform block">
          <p className="text-2xl font-bold">103</p>
          <p className="text-xs opacity-90">Скорая помощь</p>
        </a>
        <a href="tel:112" className="bg-red-700 text-white rounded-2xl p-3 text-center active:scale-95 transition-transform block">
          <p className="text-2xl font-bold">112</p>
          <p className="text-xs opacity-90">Единый номер</p>
        </a>
      </div>

      <div className="space-y-3">
        {emergencyItems.map((item, i) => (
          <div key={i} className={`bg-white border ${item.color.includes("red") ? "border-red-200" : item.color.includes("orange") ? "border-orange-200" : "border-amber-200"} rounded-2xl overflow-hidden shadow-sm`}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-start gap-3 p-4 text-left"
            >
              <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border`}>
                <Icon name={item.icon} fallback="AlertCircle" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${urgencyBadge(item.urgency)} inline-block mb-1`}>
                  {item.urgency}
                </span>
                <p className="font-semibold text-foreground text-sm leading-tight">{item.title}</p>
              </div>
              <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground flex-shrink-0 mt-1" />
            </button>
            {open === i && (
              <div className="px-4 pb-4 animate-fade-in space-y-3">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Признаки</p>
                  <ul className="space-y-1">
                    {item.signs.map((sign, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 mb-1">Что делать</p>
                  <p className="text-sm text-foreground leading-relaxed">{item.action}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// RED FLAGS
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