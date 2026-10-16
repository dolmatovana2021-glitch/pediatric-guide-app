import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Icon from "@/components/ui/icon";

const SHARE_TEXT = "МалышДок — бесплатный помощник для родителей: первая помощь, болезни, прививки и развитие малыша. Работает даже без интернета.";

const getUrl = () => `${window.location.origin}/`;
const prettyUrl = () => window.location.host;

const targets: { id: string; label: string; icon: string; color: string; href: (url: string, text: string) => string }[] = [
  {
    id: "tg",
    label: "Telegram",
    icon: "Send",
    color: "bg-[#229ED9]",
    href: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    id: "wa",
    label: "WhatsApp",
    icon: "MessageCircle",
    color: "bg-[#25D366]",
    href: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  },
  {
    id: "vk",
    label: "ВКонтакте",
    icon: "Users",
    color: "bg-[#0077FF]",
    href: (u, t) => `https://vk.com/share.php?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`,
  },
  {
    id: "ok",
    label: "Одноклассники",
    icon: "UserRound",
    color: "bg-[#EE8208]",
    href: (u) => `https://connect.ok.ru/offer?url=${encodeURIComponent(u)}`,
  },
  {
    id: "viber",
    label: "Viber",
    icon: "Phone",
    color: "bg-[#7360F2]",
    href: (u, t) => `viber://forward?text=${encodeURIComponent(`${t} ${u}`)}`,
  },
  {
    id: "mail",
    label: "Почта",
    icon: "Mail",
    color: "bg-slate-500",
    href: (u, t) => `mailto:?subject=${encodeURIComponent("МалышДок — помощник для родителей")}&body=${encodeURIComponent(`${t}\n${u}`)}`,
  },
];

const buildPoster = (svg: string, origin: string, host: string) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>МалышДок — QR-код</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Golos Text", Arial, sans-serif; color: #1e293b; text-align: center; }
  .wrap { max-width: 170mm; margin: 0 auto; padding-top: 6mm; }
  .bear { width: 46mm; height: auto; }
  h1 { font-size: 34pt; margin: 2mm 0 0; color: #2e806d; }
  .sub { font-size: 15pt; margin: 3mm 0 8mm; }
  .qr { display: inline-block; padding: 6mm; border: 0.6mm solid #2e806d; border-radius: 6mm; }
  .qr svg { width: 95mm; height: 95mm; display: block; }
  .hint { font-size: 14pt; font-weight: 600; margin: 7mm 0 2mm; }
  .url { font-size: 13pt; color: #2e806d; font-weight: 600; }
  ul { list-style: none; padding: 0; margin: 8mm 0 0; font-size: 12pt; line-height: 1.7; }
  .note { margin-top: 8mm; font-size: 10pt; color: #64748b; }
</style></head>
<body><div class="wrap">
  <img class="bear" src="${origin}/bear/doctor-clean.png" alt="">
  <h1>МалышДок</h1>
  <p class="sub">Бесплатный помощник для родителей</p>
  <div class="qr">${svg}</div>
  <p class="hint">Наведите камеру телефона на QR-код</p>
  <p class="url">${host}</p>
  <ul>
    <li>Первая помощь и экстренные ситуации</li>
    <li>Календарь прививок и плановых осмотров</li>
    <li>Болезни, развитие и питание малыша</li>
    <li>Работает даже без интернета</li>
  </ul>
  <p class="note">Справочное приложение. Не заменяет консультацию врача.</p>
</div>
<script>
  window.onload = function () {
    var img = document.querySelector('.bear');
    var go = function () { setTimeout(function () { window.print(); }, 150); };
    if (img && !img.complete) { img.onload = go; img.onerror = go; } else { go(); }
  };
</script>
</body></html>`;

export function ShareAppCard() {
  const [open, setOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const nativeShare = async () => {
    try {
      await navigator.share({ title: "МалышДок", text: SHARE_TEXT, url: getUrl() });
    } catch {
      /* пользователь закрыл меню */
    }
  };

  const copy = async () => {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printQr = () => {
    const svg = qrRef.current?.querySelector("svg")?.outerHTML;
    if (!svg) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(buildPoster(svg, window.location.origin, prettyUrl()));
    w.document.close();
  };

  return (
    <div className="mt-5 bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Icon name="Share2" size={20} className="text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-semibold text-foreground text-sm leading-tight">Поделиться приложением</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
            Ссылка в мессенджеры или QR-код для показа и печати
          </p>
        </div>
        <Icon name={open ? "ChevronUp" : "ChevronRight"} size={18} className="text-muted-foreground flex-shrink-0" />
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setShowQr((v) => !v)}
              aria-pressed={showQr}
              className={`rounded-xl py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform ${
                showQr ? "bg-primary text-primary-foreground" : "bg-background border border-border text-foreground"
              }`}
            >
              <Icon name="QrCode" size={16} />
              QR-код
            </button>
            <button
              onClick={copy}
              className="rounded-xl border border-border bg-background py-2.5 text-[13px] font-semibold text-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Icon name={copied ? "Check" : "Link"} size={16} className={copied ? "text-primary" : "text-muted-foreground"} />
              {copied ? "Скопировано" : "Ссылка"}
            </button>
          </div>

          {showQr && (
            <div className="mb-3 rounded-2xl border border-border bg-background p-4 flex flex-col items-center text-center">
              <div ref={qrRef} className="bg-white p-3 rounded-2xl">
                <QRCodeSVG value={getUrl()} size={208} level="M" marginSize={0} fgColor="#1e293b" bgColor="#ffffff" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-foreground">Наведите камеру телефона на код</p>
              <p className="text-[12px] text-primary font-semibold mt-0.5 break-all">{prettyUrl()}</p>
              <button
                onClick={printQr}
                className="mt-3 w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Icon name="Printer" size={16} />
                Распечатать листовку
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {targets.map((t) => (
              <a
                key={t.id}
                href={t.href(getUrl(), SHARE_TEXT)}
                target={t.id === "mail" || t.id === "viber" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-background py-3 active:scale-95 transition-transform"
              >
                <span className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center`}>
                  <Icon name={t.icon} size={18} className="text-white" />
                </span>
                <span className="text-[11px] font-semibold text-foreground leading-tight text-center">{t.label}</span>
              </a>
            ))}
          </div>

          {canNativeShare && (
            <button
              onClick={nativeShare}
              className="mt-2 w-full rounded-xl border border-border bg-background py-2.5 text-[13px] font-semibold text-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Icon name="MoreHorizontal" size={16} className="text-muted-foreground" />
              Другие приложения
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ShareAppCard;
