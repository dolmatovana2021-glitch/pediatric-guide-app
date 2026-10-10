import { avatarSrc, childAvatar, childEmoji, CHILD_AVATARS, type ChildProfile } from "@/components/shared/childProfile";

const BG = ["bg-mint-100", "bg-peach-100", "bg-violet-100", "bg-sky-100", "bg-pink-100"];

export function avatarBg(id: string | null | undefined): string {
  const i = id ? (CHILD_AVATARS as readonly string[]).indexOf(id) : -1;
  return i >= 0 ? BG[i % BG.length] : "";
}

export function ChildAvatar({
  child,
  size = 24,
  className = "",
  round = true,
}: {
  child: Pick<ChildProfile, "gender" | "avatar"> | null | undefined;
  size?: number;
  className?: string;
  round?: boolean;
}) {
  const id = childAvatar(child);
  if (!id) {
    return (
      <span
        className={`inline-flex items-center justify-center leading-none flex-shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.82) }}
      >
        {childEmoji(child)}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-end justify-center overflow-hidden flex-shrink-0 ${round ? "rounded-full" : "rounded-2xl"} ${avatarBg(id)} ${className}`}
      style={{ width: size, height: size }}
    >
      <img src={avatarSrc(id)} alt="" width={size} height={size} loading="lazy" decoding="async" className="w-full h-full object-cover" draggable={false} />
    </span>
  );
}

export default ChildAvatar;
