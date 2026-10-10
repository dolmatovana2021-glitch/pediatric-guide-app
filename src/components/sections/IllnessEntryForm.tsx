const SYMPTOMS = [
  "Кашель",
  "Насморк",
  "Боль в горле",
  "Рвота",
  "Понос",
  "Сыпь",
  "Вялость",
  "Плохой аппетит",
  "Боль в животе",
  "Боль в ухе",
];

export function IllnessEntryForm({
  datetime,
  setDatetime,
  temperature,
  setTemperature,
  symptoms,
  toggleSymptom,
  medication,
  setMedication,
  note,
  setNote,
  canSave,
  onSave,
  onCancel,
}: {
  datetime: string;
  setDatetime: (v: string) => void;
  temperature: string;
  setTemperature: (v: string) => void;
  symptoms: string[];
  toggleSymptom: (s: string) => void;
  medication: string;
  setMedication: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-3xl p-4 shadow-sm mb-4 space-y-3">
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Дата и время
        </label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          className="block w-full box-border appearance-none h-[42px] px-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Температура, °C
        </label>
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          min="34"
          max="43"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          placeholder="37.5"
          className="block w-full box-border appearance-none px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
          Симптомы
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SYMPTOMS.map((s) => {
            const active = symptoms.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`text-[12px] rounded-full px-3 py-1.5 border font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-mint-50 text-foreground border-mint-200"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Лекарство и доза
        </label>
        <input
          type="text"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          placeholder="Например: Парацетамол 120 мг"
          className="block w-full box-border appearance-none px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Заметка
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Как ребёнок себя чувствует"
          className="block w-full box-border appearance-none px-3 py-2.5 bg-card border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={!canSave}
          className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform"
        >
          Сохранить запись
        </button>
        <button
          onClick={onCancel}
          className="px-4 bg-card border border-border text-foreground rounded-xl py-2.5 font-semibold text-sm"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

export default IllnessEntryForm;
