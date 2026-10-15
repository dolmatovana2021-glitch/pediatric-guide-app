import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { SubPageLayout } from "@/components/shared/SubPageLayout";

const sections: { icon: string; title: string; text: string[] }[] = [
  {
    icon: "BookOpen",
    title: "Справочный характер",
    text: [
      "МалышДок — бесплатное справочное приложение для родителей. Вся информация в нём, включая советы по первой помощи, описания болезней, дозы лекарств, календари прививок и осмотров, носит общий ознакомительный характер.",
      "Приложение не ставит диагноз, не назначает лечение и не является медицинской услугой или медицинским изделием.",
    ],
  },
  {
    icon: "Stethoscope",
    title: "Приложение не заменяет врача",
    text: [
      "Диагноз и лечение может назначить только врач после осмотра ребёнка. Перед приёмом любых лекарств, в том числе по рассчитанной в приложении дозе, посоветуйтесь с педиатром.",
      "Если вас беспокоит состояние ребёнка, не откладывайте обращение к врачу, даже если в приложении ситуация описана как неопасная.",
    ],
  },
  {
    icon: "UserCheck",
    title: "Ответственность пользователя",
    text: [
      "Решения о здоровье ребёнка принимаете вы. Используя приложение, вы соглашаетесь, что применяете полученные сведения на своё усмотрение и под свою ответственность.",
      "Мы стараемся поддерживать информацию точной и актуальной, но не можем гарантировать отсутствие ошибок и полноту сведений для каждого конкретного случая.",
    ],
  },
  {
    icon: "FileText",
    title: "Изменение соглашения",
    text: [
      "Мы можем обновлять приложение и текст этого соглашения. Актуальная версия всегда доступна на этой странице. Продолжая пользоваться приложением, вы соглашаетесь с действующей редакцией.",
    ],
  },
];

const Terms = () => (
  <SubPageLayout title="Пользовательское соглашение">
    <p className="text-[12px] text-muted-foreground mt-1">Действует с 2026 года</p>

    <div className="mt-4 bg-red-50 border border-red-200 rounded-3xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
        <Icon name="Siren" fallback="TriangleAlert" size={18} className="text-red-700" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-red-900 text-sm leading-tight">В экстренной ситуации</p>
        <p className="text-[12px] text-red-900/80 leading-relaxed mt-1">
          Если состояние ребёнка угрожает жизни, не ищите ответ в приложении — сразу звоните{" "}
          <a href="tel:103" className="font-bold underline">103</a> или{" "}
          <a href="tel:112" className="font-bold underline">112</a>.
        </p>
      </div>
    </div>

    <div className="mt-3 space-y-3">
      {sections.map((s) => (
        <div key={s.title} className="bg-card border border-border rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
              <Icon name={s.icon} fallback="ShieldCheck" size={18} className="text-primary" />
            </div>
            <p className="font-semibold text-foreground text-sm leading-tight">{s.title}</p>
          </div>
          <div className="space-y-2">
            {s.text.map((t) => (
              <p key={t} className="text-[13px] text-foreground leading-relaxed">
                {t}
              </p>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
            <Icon name="Lock" size={18} className="text-primary" />
          </div>
          <p className="font-semibold text-foreground text-sm leading-tight">Ваши данные</p>
        </div>
        <p className="text-[13px] text-foreground leading-relaxed">
          Как приложение обращается с данными, описано в{" "}
          <Link to="/privacy" className="text-primary font-semibold underline underline-offset-2">
            политике конфиденциальности
          </Link>
          .
        </p>
      </div>
    </div>
  </SubPageLayout>
);

export default Terms;
