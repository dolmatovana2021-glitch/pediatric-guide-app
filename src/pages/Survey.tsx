import { useRef, useState } from "react";
import script from "@/data/surveyScript.txt?raw";
import Icon from "@/components/ui/icon";

const steps = [
  <>Нажмите <b>«Скопировать скрипт»</b> ниже (лучше на компьютере).</>,
  <>
    Откройте{" "}
    <a href="https://script.google.com/home/projects/create" target="_blank" rel="noopener noreferrer" className="text-primary underline">
      script.google.com
    </a>{" "}
    — создастся новый проект.
  </>,
  <>Щёлкните в окно с кодом, нажмите <b>Ctrl+A</b>, затем <b>Delete</b> — окно станет пустым.</>,
  <>Нажмите <b>Ctrl+V</b> — вставится длинный код, затем <b>Ctrl+S</b>, чтобы сохранить.</>,
  <>В списке рядом с «Выполнить» выберите <b>createSurvey</b> и нажмите <b>«Выполнить»</b>.</>,
  <>Разрешите доступ: «Проверить разрешения» → аккаунт → «Дополнительные настройки» → «Перейти на страницу проекта» → «Разрешить».</>,
  <>Ссылки на готовую форму появятся внизу, в «Журнале выполнения». Форма будет и в вашем Google Диске.</>,
];

const Survey = () => {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(script);
    } catch {
      ref.current?.focus();
      ref.current?.select();
      document.execCommand("copy");
    }
    setCopied(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">Опрос для родителей — Google Форма</h1>
        <p className="text-sm text-muted-foreground mb-4">Скрипт сам создаст форму со всеми вопросами и переходами между разделами.</p>

        <ol className="space-y-2 mb-5">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        <div className="sticky top-0 z-10 bg-background py-3 flex flex-wrap items-center gap-2">
          <button
            onClick={copy}
            className="bg-primary text-primary-foreground rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Icon name={copied ? "Check" : "Copy"} size={16} />
            {copied ? "Скопировано!" : "Скопировать скрипт"}
          </button>
          <a
            href="/survey/malyshdok-survey.docx"
            download
            className="bg-card border border-primary text-primary rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2"
          >
            <Icon name="FileText" size={16} />
            Скачать вопросы (Word)
          </a>
          {copied && <span className="text-sm font-semibold text-primary">Теперь вставьте в script.google.com</span>}
        </div>

        <textarea
          ref={ref}
          readOnly
          spellCheck={false}
          value={script}
          className="w-full h-[420px] font-mono text-xs leading-snug bg-card border border-border rounded-xl p-3"
        />
      </div>
    </div>
  );
};

export default Survey;
