import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import Icon from "@/components/ui/icon";
import { SubPageLayout } from "@/components/shared/SubPageLayout";
import { SITE_URL, SITE_HOST, printPoster } from "@/components/shared/sharePoster";

const benefits: { icon: string; title: string; text: string }[] = [
  {
    icon: "Siren",
    title: "Первая помощь и «красные флаги»",
    text: "Пошаговые действия при неотложных состояниях и признаки, при которых нужно срочно вызвать 103 или обратиться к врачу.",
  },
  {
    icon: "Syringe",
    title: "Прививки и осмотры по срокам",
    text: "Календарь прививок по национальному календарю (приказ Минздрава России № 1122н) и график профилактических осмотров по приказу № 211н — на главной видно, что пора сделать.",
  },
  {
    icon: "NotebookPen",
    title: "Дневник болезни",
    text: "Родители записывают температуру, симптомы и принятые лекарства по времени — на приёме проще восстановить картину болезни.",
  },
  {
    icon: "FileText",
    title: "Сводка для педиатра",
    text: "Рост и вес на центильных коридорах ВОЗ, прививки, зубы, сон, кормление и записи о болезни — на одном листе для печати или PDF.",
  },
  {
    icon: "WifiOff",
    title: "Работает без интернета",
    text: "После первого открытия приложение доступно офлайн. Данные о ребёнке хранятся на телефоне родителей; по желанию их можно сохранить в личном кабинете, чтобы не потерять.",
  },
];

const ForDoctors = () => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* буфер обмена недоступен */
    }
  };

  return (
    <SubPageLayout title="Для врачей">
      <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
        МалышДок — бесплатное справочное приложение для родителей. Его можно порекомендовать на приёме или
        разместить листовку с QR-кодом в поликлинике.
      </p>

      <div className="mt-4 bg-card border border-border rounded-3xl p-4 shadow-sm flex flex-col items-center text-center">
        <div ref={qrRef} className="bg-white p-3 rounded-2xl border border-border">
          <QRCodeSVG value={SITE_URL} size={200} level="M" marginSize={0} fgColor="#1e293b" bgColor="#ffffff" />
        </div>
        <p className="mt-3 text-[13px] font-semibold text-foreground">Покажите родителям — они отсканируют камерой</p>
        <p className="text-[13px] text-primary font-semibold mt-0.5">{SITE_HOST}</p>
        <div className="mt-3 w-full grid grid-cols-2 gap-2">
          <button
            onClick={() => printPoster(qrRef.current)}
            className="bg-primary text-primary-foreground rounded-xl py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Icon name="Printer" size={16} />
            Листовка А4
          </button>
          <button
            onClick={copy}
            className="rounded-xl border border-border bg-background py-2.5 text-[13px] font-semibold text-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Icon name={copied ? "Check" : "Link"} size={16} className={copied ? "text-primary" : "text-muted-foreground"} />
            {copied ? "Скопировано" : "Ссылка"}
          </button>
        </div>
      </div>

      <h2 className="mt-6 mb-2.5 px-1 font-bold text-[15px] text-foreground">Чем полезен родителям</h2>
      <div className="space-y-2.5">
        {benefits.map((b) => (
          <div key={b.title} className="bg-card border border-border rounded-3xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
              <Icon name={b.icon} fallback="CircleCheck" size={18} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm leading-tight">{b.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">{b.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-3">
        <Icon name="Stethoscope" size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-amber-900 leading-relaxed">
          Приложение носит справочный характер, не ставит диагноз и не назначает лечение. В нём родителям прямо
          напоминают обращаться к врачу. Подробнее — в{" "}
          <Link to="/terms" className="font-semibold underline underline-offset-2">
            пользовательском соглашении
          </Link>
          .
        </p>
      </div>
    </SubPageLayout>
  );
};

export default ForDoctors;
