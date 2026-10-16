import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAccount, useAuth } from "@/components/shared/auth";
import { clearPhotoCache } from "@/components/shared/photoUpload";

export function DeleteServerDataCard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "deleting" | "done" | "error">("idle");

  if (status === "done") {
    return (
      <div className="mt-4 bg-card border border-border rounded-3xl p-4 shadow-sm flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
          <Icon name="Check" size={20} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm leading-tight">Данные удалены с сервера</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">
            Номер телефона, данные о детях и фото стёрты. Записи на этом устройстве остались — их можно удалить в
            профиле ребёнка или очистив данные сайта в браузере.
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const confirm = async () => {
    setStatus("deleting");
    try {
      await deleteAccount();
      clearPhotoCache();
      setOpen(false);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-4 bg-card border border-border rounded-3xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
          <Icon name="ShieldX" fallback="Trash2" size={20} className="text-red-600" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm leading-tight">Данные в личном кабинете</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">
            Вы вошли по номеру {user.phone}. Можно полностью стереть с сервера номер телефона, сохранённые данные о
            детях и загруженные фото.
          </p>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-3 text-[12px] text-red-600">Не удалось удалить. Проверьте интернет и попробуйте ещё раз.</p>
      )}

      <button
        onClick={() => {
          setStatus("idle");
          setOpen(true);
        }}
        className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 text-red-700 py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <Icon name="Trash2" size={16} />
        Удалить мои данные с сервера
      </button>

      <AlertDialog open={open} onOpenChange={(o) => status !== "deleting" && setOpen(o)}>
        <AlertDialogContent className="max-w-[360px] rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить данные с сервера?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-[13px] text-muted-foreground">
                <p>С сервера будут безвозвратно стёрты:</p>
                <ul className="space-y-1">
                  <li>• номер телефона и вход в кабинет</li>
                  <li>• сохранённые данные о детях</li>
                  <li>• все загруженные фото</li>
                </ul>
                <p>
                  Записи на этом телефоне останутся, но фото, загруженные в кабинет, перестанут открываться.
                  Восстановить удалённое нельзя.
                </p>
                {status === "error" && (
                  <p className="text-red-600">Не удалось удалить. Попробуйте ещё раз.</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl mt-0" disabled={status === "deleting"}>
              Отмена
            </AlertDialogCancel>
            <button
              onClick={confirm}
              disabled={status === "deleting"}
              className="rounded-xl bg-red-600 text-white px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Icon name={status === "deleting" ? "Loader2" : "Trash2"} size={16} className={status === "deleting" ? "animate-spin" : ""} />
              {status === "deleting" ? "Удаляю…" : "Удалить навсегда"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DeleteServerDataCard;
