import type { ReactNode } from "react";
import Icon from "@/components/ui/icon";
import { Bear, type BearPose } from "@/components/shared/Bear";

export function SectionWrapper({ children }: { children: ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}

export type Tone =
  | "mint"
  | "red"
  | "rose"
  | "pink"
  | "orange"
  | "amber"
  | "violet"
  | "sky"
  | "teal"
  | "slate";

const toneStyles: Record<Tone, { card: string; blob: string }> = {
  mint: { card: "from-mint-100 to-mint-50 border-mint-200", blob: "bg-mint-200/60" },
  red: { card: "from-red-100 to-red-50 border-red-200", blob: "bg-red-200/60" },
  rose: { card: "from-rose-100 to-rose-50 border-rose-200", blob: "bg-rose-200/60" },
  pink: { card: "from-pink-100 to-pink-50 border-pink-200", blob: "bg-pink-200/60" },
  orange: { card: "from-orange-100 to-orange-50 border-orange-200", blob: "bg-orange-200/60" },
  amber: { card: "from-amber-100 to-amber-50 border-amber-200", blob: "bg-amber-200/60" },
  violet: { card: "from-violet-100 to-violet-50 border-violet-200", blob: "bg-violet-200/60" },
  sky: { card: "from-sky-100 to-sky-50 border-sky-200", blob: "bg-sky-200/60" },
  teal: { card: "from-teal-100 to-teal-50 border-teal-200", blob: "bg-teal-200/60" },
  slate: { card: "from-slate-100 to-slate-50 border-slate-200", blob: "bg-slate-200/60" },
};

const titleTones: Record<string, Tone> = {
  "🚑": "red",
  "🆘": "red",
  "🚩": "pink",
  "🔴": "rose",
  "🔬": "rose",
  "🤒": "orange",
  "🌡️": "orange",
  "💊": "teal",
  "🌱": "violet",
  "🧠": "violet",
  "🎒": "violet",
  "👶": "mint",
  "🥣": "amber",
  "🍼": "amber",
  "😴": "sky",
  "🦷": "sky",
  "💉": "mint",
  "🩺": "sky",
  "👩‍⚕️": "teal",
  "📄": "slate",
  "🔗": "amber",
  "⚙️": "slate",
};

export function SectionTitle({
  emoji,
  title,
  subtitle,
  tone,
  compact,
  bear,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  tone?: Tone;
  compact?: boolean;
  bear?: BearPose;
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 mb-4">
        {bear ? (
          <Bear pose={bear} className="w-14 h-14 -my-1.5 flex-shrink-0" />
        ) : (
          <span className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center text-[22px] flex-shrink-0">
            {emoji}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-heading text-[18px] font-extrabold text-foreground leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  const t = toneStyles[tone ?? titleTones[emoji] ?? "mint"];

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br border p-4 mb-5 ${t.card}`}
    >
      <div className={`absolute -right-8 -top-10 w-32 h-32 rounded-full ${t.blob}`} />
      {bear && (
        <Bear
          pose={bear}
          className="absolute right-2 -bottom-1.5 w-[104px] h-[104px]"
        />
      )}
      <div className={`relative flex items-center gap-3.5 ${bear ? "pr-[96px] min-h-[64px] pl-1" : ""}`}>
        {!bear && (
          <span className="w-14 h-14 rounded-[20px] bg-card flex items-center justify-center text-[28px] flex-shrink-0 shadow-sm">
            {emoji}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-heading text-[23px] font-extrabold text-foreground leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-[12px] text-muted-foreground leading-snug mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function BlockTitle({
  children,
  icon,
  action,
}: {
  children: ReactNode;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-2.5 mt-1 px-1">
      {icon && <Icon name={icon} size={16} className="text-primary" />}
      <h3 className="font-heading font-extrabold text-[16px] text-foreground">{children}</h3>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; emoji?: string; icon?: string }[];
}) {
  return (
    <div className="flex p-1 gap-1 bg-muted rounded-2xl mb-4">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[13px] font-semibold transition-colors ${
              active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {o.icon && <Icon name={o.icon} size={15} />}
            {o.emoji && <span>{o.emoji}</span>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ChipTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; emoji?: string }[];
}) {
  return (
    <div className="-mx-4 px-4 mb-5 overflow-x-auto scrollbar-none">
      <div className="flex gap-2 w-max">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              data-tab={o.id}
              onClick={() => onChange(o.id)}
              aria-pressed={active}
              className={`flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3.5 text-[13px] font-semibold border whitespace-nowrap transition-colors ${
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-foreground border-border"
              }`}
            >
              {o.emoji && (
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[15px] ${
                    active ? "bg-white/20" : "bg-muted"
                  }`}
                >
                  {o.emoji}
                </span>
              )}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
