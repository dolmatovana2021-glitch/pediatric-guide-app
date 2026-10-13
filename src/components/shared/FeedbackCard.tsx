import { useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

const FEEDBACK_URL = (func2url as Record<string, string>).feedback;

type Category = "idea" | "bug" | "content" | "other";

const categories: { id: Category; icon: string; label: string }[] = [
  { id: "idea", icon: "Lightbulb", label: "Идея" },
  { id: "bug", icon: "Bug", label: "Ошибка" },
  { id: "content", icon: "BookOpen", label: "Материалы" },
  { id: "other", icon: "MessageCircle", label: "Другое" },
];

const placeholders: Record<Category, string> = {
  idea: "Чего не хватает в приложении? Какой раздел или функцию добавить?",
  bug: "Что пошло не так? Где это случилось и что вы нажимали?",
  content: "Какую информацию уточнить, исправить или добавить?",
  other: "Напишите всё, что хотите сказать",
};

export function FeedbackCard() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>("idea");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "limit">("idle");

  const send = async () => {
    if (message.trim().length < 3) return;
    setStatus("sending");
    try {
      const res = await fetch(FEEDBACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message: message.trim(), contact: contact.trim() }),
      });
      if (res.status === 429) {
        setStatus("limit");
        return;
      }
      if (!res.ok) throw new Error("fail");
      setStatus("sent");
      setMessage("");
      setContact("");
    } catch {
      setStatus("error");
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => {
          setOpen(true);
          setStatus("idle");
        }}
        className="mt-3 w-full bg-card border border-border rounded-3xl p-4 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
          <Icon name="MessageSquareHeart" fallback="MessageSquare" size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-semibold text-foreground text-sm leading-tight">Пожелания и ошибки</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">Расскажите, что улучшить в МалышДоке</p>
        </div>
        <Icon name="ChevronRight" size={18} className="text-muted-foreground flex-shrink-0" />
      </button>
    );
  }

  return (
    <div className="mt-3 bg-card border border-border rounded-3xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="MessageSquareHeart" fallback="MessageSquare" size={18} className="text-primary" />
        <p className="font-semibold text-foreground text-sm flex-1">Пожелания и ошибки</p>
        <button
          onClick={() => setOpen(false)}
          aria-label="Свернуть"
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground"
        >
          <Icon name="X" size={18} />
        </button>
      </div>

      {status === "sent" ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-mint-50 border border-mint-200 flex items-center justify-center mx-auto mb-2">
            <Icon name="Check" size={24} className="text-primary" />
          </div>
          <p className="font-semibold text-foreground text-sm">Спасибо! Сообщение отправлено</p>
          <p className="text-[12px] text-muted-foreground mt-1">Мы читаем каждое пожелание</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-3 text-[13px] font-semibold text-primary"
          >
            Написать ещё
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                aria-pressed={category === c.id}
                className={`flex flex-col items-center gap-1 rounded-xl border py-2 text-[11px] font-semibold transition-colors ${
                  category === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border"
                }`}
              >
                <Icon name={c.icon} size={16} />
                {c.label}
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 4000))}
            placeholder={placeholders[category]}
            rows={5}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <div>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value.slice(0, 200))}
              placeholder="Телефон, почта или Telegram (необязательно)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
              Оставьте контакт, если хотите получить ответ. Не пишите данные о здоровье ребёнка.
            </p>
          </div>

          {status === "error" && (
            <p className="text-[12px] text-red-600">Не удалось отправить. Проверьте интернет и попробуйте ещё раз.</p>
          )}
          {status === "limit" && (
            <p className="text-[12px] text-red-600">Слишком много сообщений подряд. Попробуйте через час.</p>
          )}

          <button
            onClick={send}
            disabled={message.trim().length < 3 || status === "sending"}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Icon name={status === "sending" ? "Loader2" : "Send"} size={16} className={status === "sending" ? "animate-spin" : ""} />
            {status === "sending" ? "Отправляю…" : "Отправить"}
          </button>
        </div>
      )}
    </div>
  );
}

export default FeedbackCard;
