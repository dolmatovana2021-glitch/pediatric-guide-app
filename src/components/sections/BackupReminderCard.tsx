import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  formatBackupAge,
  saveBackupFile,
  snoozeBackupReminder,
  useBackupReminder,
} from "@/components/shared/backup";

export function BackupReminderCard() {
  const reminder = useBackupReminder();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  if (!reminder.due) return null;

  const onSave = async () => {
    setBusy(true);
    setError(false);
    try {
      await saveBackupFile();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-5 rounded-3xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/60 p-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 text-2xl">
          💾
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[14px] text-amber-900 dark:text-amber-200 leading-tight">
            Пора сохранить копию данных
          </p>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-snug mt-0.5">
            {formatBackupAge(reminder)}. Если телефон сломается или потеряется, профили, прививки и дневники
            можно будет вернуть из файла
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onSave}
          disabled={busy}
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl py-2.5 active:scale-95 transition-transform disabled:opacity-60"
        >
          <Icon name={busy ? "Loader2" : "Download"} size={16} className={busy ? "animate-spin" : ""} />
          Сохранить копию
        </button>
        <button
          onClick={() => snoozeBackupReminder(7)}
          className="px-3.5 text-sm font-semibold rounded-xl bg-white/70 dark:bg-white/10 text-amber-900 dark:text-amber-200 active:scale-95 transition-transform"
        >
          Через неделю
        </button>
      </div>

      {error && (
        <p className="mt-2 text-[11px] text-rose-700 dark:text-rose-400">
          Не получилось сохранить файл, попробуйте ещё раз
        </p>
      )}
    </div>
  );
}

export default BackupReminderCard;
