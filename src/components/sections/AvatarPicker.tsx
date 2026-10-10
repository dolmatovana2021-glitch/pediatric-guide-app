import { CHILD_AVATARS } from "@/components/shared/childProfile";

const BG = [
  "bg-mint-100",
  "bg-peach-100",
  "bg-violet-100",
  "bg-sky-100",
  "bg-pink-100",
];

export function avatarBg(avatar: string | undefined): string {
  const i = avatar ? CHILD_AVATARS.indexOf(avatar) : -1;
  return i >= 0 ? BG[i % BG.length] : "bg-card";
}

export function AvatarPicker({
  value,
  onChange,
  taken,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  taken: string[];
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
        Зверёк-аватарка
      </label>
      <div className="grid grid-cols-5 gap-2">
        {CHILD_AVATARS.map((a, i) => {
          const active = value === a;
          const busy = !active && taken.includes(a);
          return (
            <button
              key={a}
              type="button"
              onClick={() => onChange(active ? "" : a)}
              aria-label={`Аватарка ${a}`}
              aria-pressed={active}
              className={`relative aspect-square rounded-2xl flex items-center justify-center text-[26px] transition-all active:scale-90 ${BG[i % BG.length]} ${
                active ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-105" : ""
              } ${busy ? "opacity-40" : ""}`}
            >
              {a}
              {active && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground mt-1.5">
        {value
          ? "Нажмите на выбранного зверька ещё раз, чтобы вернуть смайлик по полу"
          : "Если не выбрать — будет смайлик по полу ребёнка"}
        {taken.length > 0 && ". Полупрозрачные уже у других детей"}
      </p>
    </div>
  );
}

export default AvatarPicker;
