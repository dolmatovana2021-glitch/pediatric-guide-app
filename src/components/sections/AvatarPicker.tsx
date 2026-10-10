import { AVATAR_LABELS, CHILD_AVATARS, avatarSrc, childAvatar } from "@/components/shared/childProfile";
import { avatarBg } from "@/components/shared/ChildAvatar";

export function AvatarPicker({
  value,
  onChange,
  taken,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  taken: string[];
}) {
  const current = childAvatar({ avatar: value });
  const takenIds = taken.map((t) => childAvatar({ avatar: t })).filter(Boolean) as string[];

  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
        Зверёк-аватарка
      </label>
      <div className="grid grid-cols-4 gap-2.5">
        {CHILD_AVATARS.map((a) => {
          const active = current === a;
          const busy = !active && takenIds.includes(a);
          return (
            <button
              key={a}
              type="button"
              onClick={() => onChange(active ? "" : a)}
              aria-label={AVATAR_LABELS[a]}
              aria-pressed={active}
              className={`relative flex flex-col items-center gap-1 transition-all active:scale-90 ${busy ? "opacity-40" : ""}`}
            >
              <span
                className={`relative w-full aspect-square rounded-full overflow-hidden flex items-end justify-center ${avatarBg(a)} ${
                  active ? "ring-[3px] ring-primary ring-offset-2 ring-offset-card" : ""
                }`}
              >
                <img
                  src={avatarSrc(a)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="w-full h-full object-cover"
                />
              </span>
              {active && (
                <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shadow">
                  ✓
                </span>
              )}
              <span className={`text-[10px] leading-tight ${active ? "font-bold text-primary" : "text-muted-foreground"}`}>
                {AVATAR_LABELS[a]}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">
        {current
          ? "Нажмите на выбранного зверька ещё раз, чтобы вернуть смайлик по полу"
          : "Если не выбрать — будет смайлик по полу ребёнка"}
        {takenIds.length > 0 && ". Полупрозрачные уже у других детей"}
      </p>
    </div>
  );
}

export default AvatarPicker;
