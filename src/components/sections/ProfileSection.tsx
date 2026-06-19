import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionShared";
import {
  ChildProfile,
  EMPTY_PROFILE,
  StoredChild,
  addChildProfile,
  calcAge,
  listChildren,
  removeChildProfile,
  saveChildProfile,
  setActiveChildId,
  getActiveChildId,
} from "@/components/shared/childProfile";

const EVENT_NAME = "malyshdok:childProfile:update";

function emojiFor(g: ChildProfile["gender"]) {
  return g === "boy" ? "👦" : g === "girl" ? "👧" : "🧒";
}

export function ProfileSection() {
  const [children, setChildren] = useState<StoredChild[]>([]);
  const [activeId, setActiveIdState] = useState<string>("");
  const [profile, setProfile] = useState<ChildProfile>(EMPTY_PROFILE);
  const [saved, setSaved] = useState(false);

  const refresh = () => {
    const list = listChildren();
    setChildren(list);
    const id = getActiveChildId();
    setActiveIdState(id);
    const active = list.find((c) => c.id === id);
    if (active) {
      const { id: _id, ...rest } = active;
      void _id;
      setProfile({ ...EMPTY_PROFILE, ...rest });
    } else {
      setProfile(EMPTY_PROFILE);
    }
  };

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener(EVENT_NAME, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const update = <K extends keyof ChildProfile>(key: K, value: ChildProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const submit = () => {
    saveChildProfile(profile, activeId || undefined);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addChild = () => {
    addChildProfile(EMPTY_PROFILE);
  };

  const selectChild = (id: string) => {
    if (id === activeId) return;
    setActiveChildId(id);
  };

  const removeCurrent = () => {
    if (!activeId) return;
    const name = profile.name || "этого профиля";
    if (!confirm(`Удалить ${name}?`)) return;
    removeChildProfile(activeId);
  };

  const age = calcAge(profile.birthDate);
  const filled = Boolean(profile.name || profile.birthDate || profile.weight);

  const tabs = useMemo(
    () =>
      children.map((c, idx) => ({
        id: c.id,
        title: c.name?.trim() || `Ребёнок ${idx + 1}`,
        emoji: emojiFor(c.gender),
      })),
    [children],
  );

  const hasChildren = children.length > 0;

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="👶"
        title="Профиль ребёнка"
        subtitle="Можно добавить несколько детей — данные хранятся только на устройстве"
      />

      <div className="bg-white border border-border rounded-2xl p-3 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground">
            {hasChildren ? `Дети (${children.length})` : "Ещё нет профилей"}
          </p>
          <button
            onClick={addChild}
            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 active:scale-95 transition-transform"
          >
            <Icon name="Plus" size={14} />
            Добавить
          </button>
        </div>

        {hasChildren ? (
          <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
            {tabs.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  onClick={() => selectChild(t.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                    isActive
                      ? "bg-primary text-white border-primary shadow"
                      : "bg-mint-50 text-foreground border-mint-200 hover:bg-mint-100"
                  }`}
                >
                  <span className="text-base leading-none">{t.emoji}</span>
                  <span className="max-w-[120px] truncate">{t.title}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <button
            onClick={addChild}
            className="w-full bg-mint-50 border border-dashed border-mint-300 text-foreground rounded-xl py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-mint-100 transition"
          >
            <Icon name="UserPlus" size={16} />
            Создать первый профиль
          </button>
        )}
      </div>

      {hasChildren && filled && (
        <div className="bg-mint-50 border border-mint-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white border border-mint-200 flex items-center justify-center text-2xl flex-shrink-0">
            {emojiFor(profile.gender)}
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

      {hasChildren && (
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
              className="block w-full max-w-full min-w-0 box-border appearance-none px-3 py-2.5 bg-mint-50 border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
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
              style={{ WebkitAppearance: "none", MozAppearance: "none", minHeight: "42px" }}
              className="block w-full max-w-full min-w-0 box-border appearance-none h-[42px] leading-[1.25rem] px-3 py-2.5 bg-mint-50 border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
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
              className="block w-full max-w-full min-w-0 box-border appearance-none px-3 py-2.5 bg-mint-50 border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
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
              className="block w-full max-w-full min-w-0 box-border appearance-none px-3 py-2.5 bg-mint-50 border border-mint-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
            />
          </div>

          <div className="bg-mint-50 border border-mint-200 rounded-xl p-3">
            <button
              onClick={() => update("riskGroup", !profile.riskGroup)}
              className="w-full flex items-center gap-3 text-left"
            >
              <span
                className={`w-11 h-6 rounded-full flex-shrink-0 relative transition-colors ${
                  profile.riskGroup ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    profile.riskGroup ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-foreground">Ребёнок из группы риска</span>
                <span className="block text-[11px] text-muted-foreground leading-snug">
                  Включите, если есть показания к дополнительным прививкам (хронические болезни, недоношенность и др.)
                </span>
              </span>
            </button>
          </div>

          <button
            onClick={submit}
            className="w-full bg-primary text-white rounded-xl py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Icon name={saved ? "Check" : "Save"} size={16} />
            {saved ? "Сохранено" : "Сохранить"}
          </button>

          <button
            onClick={removeCurrent}
            className="w-full text-xs text-muted-foreground hover:text-rose-600 font-medium py-1 flex items-center justify-center gap-1"
          >
            <Icon name="Trash2" size={13} />
            Удалить этот профиль
          </button>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground text-center mt-3 px-3 leading-relaxed">
        🔒 Все данные хранятся только в вашем браузере и не отправляются на сервер
      </p>
    </SectionWrapper>
  );
}