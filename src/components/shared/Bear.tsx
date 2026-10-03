import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type BearPose = "main" | "thermometer" | "sleep" | "school" | "firstaid" | "night";

export const bearSrc = (pose: BearPose) => `/bear/${pose}.webp`;

const altText: Record<BearPose, string> = {
  main: "Медвежонок-доктор",
  thermometer: "Медвежонок с градусником",
  sleep: "Спящий медвежонок",
  school: "Медвежонок с рюкзаком",
  firstaid: "Медвежонок с аптечкой",
  night: "Медвежонок в пижаме",
};

export function Bear({
  pose = "main",
  nightAware = false,
  className = "",
}: {
  pose?: BearPose;
  nightAware?: boolean;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const actual: BearPose = nightAware && mounted && resolvedTheme === "dark" ? "night" : pose;

  return (
    <img
      src={bearSrc(actual)}
      alt={altText[actual]}
      draggable={false}
      className={`select-none pointer-events-none object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.18)] ${className}`}
    />
  );
}

export default Bear;
