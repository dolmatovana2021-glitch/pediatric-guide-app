import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BackupError,
  hasAnyData,
  readBackupFile,
  restoreBackup,
  saveBackupFile,
  summarize,
  type BackupFile,
  type BackupSummary,
} from "@/components/shared/backup";

type Notice = { tone: "ok" | "error"; text: string } | null;

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function SummaryList({ s }: { s: BackupSummary }) {
  const rows = [
    { emoji: "👶", text: s.children.length ? s.children.join(", ") : "Профилей детей нет" },
    { emoji: "💉", text: `${s.vaccines} ${plural(s.vaccines, "отметка", "отметки", "отметок")} о прививках` },
    { emoji: "🩺", text: `${s.checkups} ${plural(s.checkups, "отметка", "отметки", "отметок")} об осмотрах` },
    { emoji: "💊", text: `${s.meds} ${plural(s.meds, "лекарство", "лекарства", "лекарств")} в аптечке` },
    { emoji: "📒", text: `${s.diaryEntries} ${plural(s.diaryEntries, "запись", "записи", "записей")} в дневниках и замерах` },
  ];
  return (
    <ul className="mt-2 space-y-1.5 text-left">
      {rows.map((r) => (
        <li key={r.emoji} className="flex items-start gap-2 text-[13px] text-foreground">
          <span className="w-5 text-center flex-shrink-0">{r.emoji}</span>
          <span className="min-w-0 break-words">{r.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function BackupCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<BackupFile | null>(null);

  const onSave = async () => {
    setNotice(null);
    if (!hasAnyData()) {
      setNotice({ tone: "error", text: "Пока нечего сохранять — заполните профиль ребёнка" });
      return;
    }
    setBusy(true);
    try {
      const result = await saveBackupFile();
      if (result === "downloaded") {
        setNotice({ tone: "ok", text: "Файл сохранён в «Загрузки». Перешлите его на новый телефон — например, себе в мессенджер" });
      } else if (result === "shared") {
        setNotice({ tone: "ok", text: "Файл отправлен. Откройте его на новом телефоне через «Восстановить из файла»" });
      }
    } catch {
      setNotice({ tone: "error", text: "Не получилось сохранить файл, попробуйте ещё раз" });
    } finally {
      setBusy(false);
    }
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setNotice(null);
    try {
      setPending(await readBackupFile(file));
    } catch (err) {
      setNotice({
        tone: "error",
        text: err instanceof BackupError ? err.message : "Не получилось прочитать файл",
      });
    }
  };

  const onConfirm = () => {
    if (!pending) return;
    restoreBackup(pending);
    setPending(null);
    window.location.reload();
  };

  const summary = pending ? summarize(pending) : null;
  const date = pending ? formatDate(pending.createdAt) : "";

  return (
    <div className="mt-5 bg-card border border-border rounded-3xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
          <Icon name="ArrowRightLeft" size={18} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm">Перенос на другой телефон</p>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Профили детей, прививки, осмотры, аптечка и дневники — в одном файле
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <button
          onClick={onSave}
          disabled={busy}
          className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl py-2.5 active:scale-95 transition-transform disabled:opacity-60"
        >
          <Icon name={busy ? "Loader2" : "Download"} size={16} className={busy ? "animate-spin" : ""} />
          Сохранить данные в файл
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 bg-muted text-foreground text-sm font-semibold rounded-xl py-2.5 active:scale-95 transition-transform"
        >
          <Icon name="Upload" size={16} />
          Восстановить из файла
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onPick}
        />
      </div>

      {notice && (
        <div
          className={`mt-3 flex items-start gap-2 text-[12px] rounded-xl p-2.5 ${
            notice.tone === "ok"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          <Icon name={notice.tone === "ok" ? "CheckCircle2" : "AlertCircle"} size={14} className="flex-shrink-0 mt-0.5" />
          <span>{notice.text}</span>
        </div>
      )}

      <AlertDialog open={Boolean(pending)} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent className="max-w-[360px] rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Восстановить данные?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="text-[13px] text-muted-foreground">
                  {date ? `Копия от ${date}. ` : ""}В файле:
                </p>
                {summary && <SummaryList s={summary} />}
                <p className="mt-3 text-[12px] text-rose-600 dark:text-rose-400 font-medium">
                  Данные на этом телефоне будут заменены данными из файла.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl mt-0">Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} className="rounded-xl">
              Восстановить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default BackupCard;
