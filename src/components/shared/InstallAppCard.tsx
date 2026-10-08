import { useState } from "react";
import Icon from "@/components/ui/icon";
import { dismissInstall, promptInstall, useInstallState } from "@/components/shared/pwa";

export function InstallAppCard({ force = false }: { force?: boolean }) {
  const { installed, canPrompt, ios, dismissed } = useInstallState();
  const [showIosHelp, setShowIosHelp] = useState(false);

  if (installed) {
    if (!force) return null;
    return (
      <div className="mb-5 rounded-3xl border border-mint-200 bg-mint-50 p-4 flex items-center gap-3">
        <img src="/icon-192.png" alt="" className="w-11 h-11 rounded-2xl flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-bold text-[14px] text-foreground">Приложение установлено</p>
          <p className="text-[11px] text-muted-foreground">Работает и без интернета</p>
        </div>
      </div>
    );
  }
  if (!force && dismissed) return null;
  if (!canPrompt && !ios && !force) return null;

  const onInstall = async () => {
    if (canPrompt) {
      await promptInstall();
    } else {
      setShowIosHelp((v) => !v);
    }
  };

  return (
    <div className="mb-5 rounded-3xl border border-mint-200 bg-mint-50 p-4 relative">
      {!force && (
        <button
          onClick={dismissInstall}
          aria-label="Скрыть"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground active:scale-90 transition-transform"
        >
          <Icon name="X" size={15} />
        </button>
      )}
      <div className="flex items-center gap-3 pr-6">
        <img src="/icon-192.png" alt="" className="w-12 h-12 rounded-2xl shadow-sm flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-bold text-[14px] text-foreground leading-tight">Установите МалышДок</p>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            Иконка на главном экране и работа без интернета — первая помощь всегда под рукой
          </p>
        </div>
      </div>

      {(canPrompt || ios) && (
        <button
          onClick={onInstall}
          className="mt-3 w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl py-2.5 active:scale-95 transition-transform"
        >
          <Icon name="Download" size={16} />
          Установить на телефон
        </button>
      )}

      {!canPrompt && !ios && (
        <p className="mt-3 text-[12px] text-foreground leading-relaxed">
          Откройте меню браузера <span className="font-semibold">⋮</span> и выберите{" "}
          <span className="font-semibold">«Установить приложение»</span> или{" "}
          <span className="font-semibold">«Добавить на главный экран»</span>.
        </p>
      )}

      {ios && showIosHelp && (
        <ol className="mt-3 space-y-2 text-[12px] text-foreground">
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center flex-shrink-0">1</span>
            <span>
              Нажмите <Icon name="Share" size={13} className="inline -mt-0.5 text-primary" /> «Поделиться» внизу Safari
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center flex-shrink-0">2</span>
            <span>
              Выберите <Icon name="SquarePlus" size={13} className="inline -mt-0.5 text-primary" /> «На экран „Домой“»
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center flex-shrink-0">3</span>
            <span>Нажмите «Добавить» — медвежонок появится на экране</span>
          </li>
        </ol>
      )}
    </div>
  );
}

export function OfflineBanner({ online }: { online: boolean }) {
  if (online) return null;
  return (
    <div className="sticky top-0 z-40 bg-amber-100 text-amber-900 text-[12px] font-medium py-1.5 px-4 flex items-center justify-center gap-1.5">
      <Icon name="WifiOff" size={13} />
      Нет интернета — приложение работает офлайн
    </div>
  );
}
