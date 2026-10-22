import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type BearPose = "main" | "thermometer" | "sleep" | "school" | "firstaid" | "night" | "plaster";

export const bearSrc = (pose: BearPose) => `/bear/${pose}.webp?v=4`;

const altText: Record<BearPose, string> = {
  main: "Медвежонок-доктор",
  thermometer: "Медвежонок с градусником",
  sleep: "Спящий медвежонок",
  school: "Медвежонок с рюкзаком",
  firstaid: "Медвежонок с аптечкой",
  night: "Медвежонок в пижаме с фонариком",
  plaster: "Медвежонок с пластырем",
};

export function Bear({
  pose = "main",
  className = "",
  dayOnly = false,
}: {
  pose?: BearPose;
  nightAware?: boolean;
  className?: string;
  dayOnly?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isNight = !dayOnly && mounted && resolvedTheme === "dark";
  const actual: BearPose = isNight ? "night" : pose;

  if (actual === "night") {
    return (
      <span className={`block select-none pointer-events-none ${className}`} aria-hidden={false}>
        <span className="relative block w-full h-full">
          <img
            src={bearSrc("night")}
            alt={altText.night}
            draggable={false}
            className="w-full h-full object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)]"
          />
          <span className="bear-lantern-glow" />
          <span className="bear-lantern-core" />
        </span>
      </span>
    );
  }

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