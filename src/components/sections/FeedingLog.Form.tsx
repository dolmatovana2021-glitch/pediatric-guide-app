import Icon from "@/components/ui/icon";
import { type FeedType } from "@/components/shared/childProfile";
import { typeMeta, localNow } from "./FeedingLog.data";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  datetime: string;
  setDatetime: (v: string) => void;
  type: FeedType;
  setType: (v: FeedType) => void;
  amount: string;
  setAmount: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  save: () => void;
};

export function FeedingLogForm({
  open,
  setOpen,
  datetime,
  setDatetime,
  type,
  setType,
  amount,
  setAmount,
  duration,
  setDuration,
  note,
  setNote,
  save,
}: Props) {
  if (!open) {
    return (
      <button
        onClick={() => {
          setDatetime(localNow());
          setOpen(true);
        }}
        className="w-full bg-primary text-white rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mb-4 shadow-sm active:scale-95 transition-transform"
      >
        <Icon name="Plus" size={16} />
        Добавить кормление
      </button>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4 space-y-3">
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
          Чем кормили
        </label>
        <div className="flex gap-2">
          {(Object.keys(typeMeta) as FeedType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 rounded-xl py-2 text-[13px] font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                type === t
                  ? "bg-primary text-white border-primary"
                  : "bg-mint-50 text-foreground border-mint-200"
              }`}
            >
              <span>{typeMeta[t].emoji}</span>
              {typeMeta[t].label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Дата и время
        </label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          className="block w-full box-border appearance-none h-[42px] px-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {type === "breast" ? (
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
            Длительность, минут
          </label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="120"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="20"
            className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      ) : (
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
            Объём, мл
          </label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="120"
            className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
          Заметка
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Например: срыгнул, ел с аппетитом"
          className="block w-full box-border appearance-none px-3 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={save}
          className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold text-sm active:scale-95 transition-transform"
        >
          Сохранить
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-4 bg-white border border-border text-foreground rounded-xl py-2.5 font-semibold text-sm"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

export default FeedingLogForm;
