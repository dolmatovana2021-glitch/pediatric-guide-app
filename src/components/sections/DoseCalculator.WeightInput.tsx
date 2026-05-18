import Icon from "@/components/ui/icon";

type AgeInfo = { years: number; months: number; label: string } | null;

type ProfileLike = {
  weight: string;
  name?: string;
  gender?: string;
};

type Props = {
  profile: ProfileLike;
  age: AgeInfo;
  weight: string;
  usedProfile: boolean;
  valid: boolean;
  onUseProfile: () => void;
  onChange: (value: string) => void;
  onClear: () => void;
};

export function WeightInput({
  profile,
  age,
  weight,
  usedProfile,
  valid,
  onUseProfile,
  onChange,
  onClear,
}: Props) {
  return (
    <>
      {profile.weight && (
        <button
          onClick={onUseProfile}
          className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 border text-xs transition ${
            usedProfile && weight === profile.weight
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-white border-mint-200 text-foreground hover:bg-mint-100"
          }`}
        >
          <span className="text-base">
            {profile.gender === "boy" ? "👦" : profile.gender === "girl" ? "👧" : "🧒"}
          </span>
          <span className="flex-1 text-left truncate">
            <span className="font-semibold">{profile.name || "Малыш"}</span>
            {age ? ` · ${age.label}` : ""} · {profile.weight} кг
          </span>
          <Icon name={usedProfile && weight === profile.weight ? "Check" : "ArrowDown"} size={12} />
        </button>
      )}

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Вес ребёнка, кг
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            min="1"
            max="80"
            step="0.1"
            value={weight}
            onChange={(e) => onChange(e.target.value)}
            placeholder="например, 12"
            className="w-full px-3 py-2.5 bg-white border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {weight && (
            <button
              onClick={onClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-mint-100 flex items-center justify-center text-muted-foreground"
              aria-label="Очистить"
            >
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
      </div>

      {!valid && weight && (
        <p className="text-[11px] text-rose-600">
          Введите вес от 1 до 80 кг
        </p>
      )}
    </>
  );
}

export default WeightInput;
