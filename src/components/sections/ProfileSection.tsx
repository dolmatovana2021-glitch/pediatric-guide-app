import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionShared";
import {
  ChildProfile,
  EMPTY_PROFILE,
  calcAge,
  clearChildProfile,
  loadChildProfile,
  saveChildProfile,
} from "@/components/shared/childProfile";

export function ProfileSection() {
  const [profile, setProfile] = useState<ChildProfile>(EMPTY_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(loadChildProfile());
  }, []);

  const update = <K extends keyof ChildProfile>(key: K, value: ChildProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const submit = () => {
    saveChildProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reset = () => {
    if (!confirm("Удалить данные профиля?")) return;
    clearChildProfile();
    setProfile(EMPTY_PROFILE);
  };

  const age = calcAge(profile.birthDate);
  const filled = profile.name || profile.birthDate || profile.weight;

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="👶"
        title="Профиль ребёнка"
        subtitle="Данные хранятся только на вашем устройстве"
      />

      {filled && (
        <div className="bg-mint-50 border border-mint-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white border border-mint-200 flex items-center justify-center text-2xl flex-shrink-0">
            {profile.gender === "boy" ? "👦" : profile.gender === "girl" ? "👧" : "🧒"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-base truncate">
              {profile.name || "Малыш"}
            </p>
            <p className="text-xs text-muted-foreground">
              {age ? age.label : "возраст не указан"}
              {profile.weight ? ` · ${profile.weight} кг` : ""}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-border rounded-2xl p-4 space-y-4 shadow-sm">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            Имя
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Например, Маша"
            className="w-full px-3 py-2.5 bg-mint-50 border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            Дата рождения
          </label>
          <input
            type="date"
            value={profile.birthDate}
            onChange={(e) => update("birthDate", e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
            className="w-full px-3 py-2.5 bg-mint-50 border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {age && (
            <p className="text-[11px] text-primary font-semibold mt-1">
              Возраст: {age.label}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            Вес, кг
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="1"
            max="80"
            step="0.1"
            value={profile.weight}
            onChange={(e) => update("weight", e.target.value)}
            placeholder="Например, 12"
            className="w-full px-3 py-2.5 bg-mint-50 border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Подставится в калькулятор дозы автоматически
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            Пол
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "", label: "Не указан", emoji: "🧒" },
              { v: "boy", label: "Мальчик", emoji: "👦" },
              { v: "girl", label: "Девочка", emoji: "👧" },
            ].map((g) => (
              <button
                key={g.v}
                onClick={() => update("gender", g.v as ChildProfile["gender"])}
                className={`text-xs font-semibold py-2 px-2 rounded-lg border transition flex items-center justify-center gap-1 ${
                  profile.gender === g.v
                    ? "bg-primary text-white border-primary"
                    : "bg-mint-50 text-foreground border-mint-200 hover:bg-mint-100"
                }`}
              >
                <span>{g.emoji}</span>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
            Аллергии и важное
          </label>
          <textarea
            value={profile.allergies}
            onChange={(e) => update("allergies", e.target.value)}
            placeholder="Например: аллергия на пенициллин, лактазная недостаточность"
            rows={3}
            className="w-full px-3 py-2.5 bg-mint-50 border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
          />
        </div>

        <button
          onClick={submit}
          className="w-full bg-primary text-white rounded-xl py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Icon name={saved ? "Check" : "Save"} size={16} />
          {saved ? "Сохранено" : "Сохранить"}
        </button>

        {filled && (
          <button
            onClick={reset}
            className="w-full text-xs text-muted-foreground hover:text-rose-600 font-medium py-1"
          >
            Удалить профиль
          </button>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground text-center mt-3 px-3 leading-relaxed">
        🔒 Все данные хранятся только в вашем браузере и не отправляются на сервер
      </p>
    </SectionWrapper>
  );
}
