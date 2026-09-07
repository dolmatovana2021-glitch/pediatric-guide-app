import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";
import {
  useMedkit,
  addMed,
  updateMed,
  removeMed,
  expiryState,
  type MedItem,
} from "@/components/shared/medkitStore";

const FORMS = [
  "Сироп",
  "Свечи",
  "Таблетки",
  "Капли",
  "Спрей",
  "Мазь",
  "Порошок",
  "Раствор",
  "Другое",
];

function fmtDate(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("ru-RU");
}

const stateMeta = {
  expired: {
    label: "просрочено",
    card: "bg-rose-50 border-rose-200",
    chip: "bg-rose-600 text-white",
  },
  soon: {
    label: "скоро истекает",
    card: "bg-amber-50 border-amber-200",
    chip: "bg-amber-500 text-white",
  },
  ok: { label: "годно", card: "bg-white border-border", chip: "bg-mint-100 text-emerald-700" },
  unknown: {
    label: "срок не указан",
    card: "bg-white border-border",
    chip: "bg-muted text-muted-foreground",
  },
} as const;

export function MedkitSection() {
  const items = useMedkit();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [form, setForm] = useState("");
  const [dosage, setDosage] = useState("");
  const [expiry, setExpiry] = useState("");
  const [note, setNote] = useState("");

  const reset = () => {
    setName("");
    setForm("");
    setDosage("");
    setExpiry("");
    setNote("");
    setEditId(null);
    setOpen(false);
  };

  const startEdit = (m: MedItem) => {
    setEditId(m.id);
    setName(m.name);
    setForm(m.form);
    setDosage(m.dosage);
    setExpiry(m.expiry);
    setNote(m.note);
    setOpen(true);
  };

  const save = () => {
    if (!name.trim()) return;
    const payload = {
      name: name.trim(),
      form,
      dosage: dosage.trim(),
      expiry,
      note: note.trim(),
    };
    if (editId) updateMed(editId, payload);
    else addMed(payload);
    reset();
  };

  const sorted = useMemo(() => {
    const rank = { expired: 0, soon: 1, ok: 2, unknown: 3 };
    return [...items].sort((a, b) => {
      const sa = expiryState(a.expiry).state;
      const sb = expiryState(b.expiry).state;
      if (rank[sa] !== rank[sb]) return rank[sa] - rank[sb];
      if (a.expiry && b.expiry) return a.expiry.localeCompare(b.expiry);
      return a.name.localeCompare(b.name);
    });
  }, [items]);

  const expired = items.filter((m) => expiryState(m.expiry).state === "expired");
  const soon = items.filter((m) => expiryState(m.expiry).state === "soon");

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="💊"
        title="Аптечка"
        subtitle="Лекарства дома: дозировка и срок годности"
      />

      {expired.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-3 flex items-start gap-2.5">
          <Icon name="TriangleAlert" size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-foreground leading-snug">
              Просрочено: {expired.length}
            </p>
            <p className="text-[12px] text-foreground leading-snug mt-0.5">
              {expired.map((m) => m.name).join(", ")}. Такие препараты давать ребёнку
              нельзя — их нужно заменить.
            </p>
          </div>
        </div>
      )}

      {soon.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-3 flex items-start gap-2.5">
          <Icon name="Clock" size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-foreground leading-snug">
            Срок заканчивается в ближайший месяц:{" "}
            <span className="font-semibold">{soon.map((m) => m.name).join(", ")}</span>
          </p>
        </div>
      )}

      {open ? (
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Название лекарства
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Нурофен для детей"
              className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Форма выпуска
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FORMS.map((f) => (
                <button
                  key={f}
                  onClick={() => setForm(form === f ? "" : f)}
                  className={`text-[12px] rounded-full px-3 py-1.5 border font-medium transition-colors ${
                    form === f
                      ? "bg-primary text-white border-primary"
                      : "bg-mint-50 text-foreground border-mint-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Дозировка
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Например: 100 мг / 5 мл, по 5 мл 3 раза в день"
              className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Годен до
            </label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="block w-full box-border appearance-none h-[42px] px-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Заметка
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Например: в холодильнике, от температуры"
              className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={!name.trim()}
              className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform"
            >
              {editId ? "Сохранить" : "Добавить в аптечку"}
            </button>
            <button
              onClick={reset}
              className="px-4 bg-white border border-border text-foreground rounded-xl py-2.5 font-semibold text-sm"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-primary text-white rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mb-4 shadow-sm active:scale-95 transition-transform"
        >
          <Icon name="Plus" size={16} />
          Добавить лекарство
        </button>
      )}

      {items.length === 0 ? (
        <div className="bg-white border border-dashed border-border rounded-2xl p-8 text-center">
          <Icon name="Pill" size={28} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-[13px] text-muted-foreground leading-snug">
            Аптечка пуста. Добавьте лекарства, которые есть дома — приложение подскажет,
            когда истекает срок годности.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <p className="text-[11px] font-semibold text-muted-foreground">
            В аптечке ({items.length})
          </p>
          {sorted.map((m) => {
            const { state, days } = expiryState(m.expiry);
            const meta = stateMeta[state];
            return (
              <div key={m.id} className={`border rounded-2xl p-3.5 shadow-sm ${meta.card}`}>
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-foreground leading-tight">
                      {m.name}
                    </p>
                    {m.form && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">{m.form}</p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold rounded-full px-2 py-0.5 flex-shrink-0 ${meta.chip}`}
                  >
                    {meta.label}
                  </span>
                </div>

                {m.dosage && (
                  <p className="text-[12px] text-foreground mt-2 flex items-start gap-1.5">
                    <Icon name="Syringe" fallback="Pill" size={13} className="text-primary flex-shrink-0 mt-0.5" />
                    {m.dosage}
                  </p>
                )}

                {m.expiry && (
                  <p className="text-[12px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
                    <Icon name="CalendarDays" fallback="Calendar" size={13} className="flex-shrink-0" />
                    Годен до {fmtDate(m.expiry)}
                    {days !== null && (
                      <span className="text-[11px]">
                        {days < 0
                          ? ` · истёк ${Math.abs(days)} дн. назад`
                          : days === 0
                            ? " · истекает сегодня"
                            : ` · осталось ${days} дн.`}
                      </span>
                    )}
                  </p>
                )}

                {m.note && (
                  <p className="text-[12px] text-muted-foreground mt-1.5 leading-snug">
                    {m.note}
                  </p>
                )}

                <div className="flex gap-2 mt-2.5">
                  <button
                    onClick={() => startEdit(m)}
                    className="text-[12px] font-semibold text-primary flex items-center gap-1"
                  >
                    <Icon name="Pencil" size={12} />
                    Изменить
                  </button>
                  <button
                    onClick={() => removeMed(m.id)}
                    className="text-[12px] font-semibold text-muted-foreground hover:text-rose-600 flex items-center gap-1"
                  >
                    <Icon name="Trash2" size={12} />
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground leading-snug mt-4">
        Просроченные лекарства нельзя давать ребёнку: они теряют эффективность и могут
        навредить. Дозировку всегда согласуйте с врачом — раздел служит только напоминанием
        о запасах дома.
      </p>
    </SectionWrapper>
  );
}

export default MedkitSection;