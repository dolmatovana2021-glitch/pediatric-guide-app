import Icon from "@/components/ui/icon";
import { SubPageLayout } from "@/components/shared/SubPageLayout";

const sections: { icon: string; title: string; text: string[] }[] = [
  {
    icon: "Smartphone",
    title: "Данные о ребёнке хранятся на вашем устройстве",
    text: [
      "Профиль ребёнка, прививки, осмотры, домашняя аптечка, дневник болезни и прикреплённые фото сохраняются только в памяти вашего браузера на этом устройстве.",
      "Мы не получаем эти данные, не храним их на своих серверах и не передаём третьим лицам. Регистрация для работы приложения не нужна.",
    ],
  },
  {
    icon: "Trash2",
    title: "Как удалить данные",
    text: [
      "Данные удаляются вместе с очисткой данных сайта в настройках браузера или при удалении приложения с устройства. Восстановить их после этого нельзя.",
      "Чтобы не потерять записи при смене телефона, сохраните резервную копию в приложении — файл останется у вас.",
    ],
  },
  {
    icon: "ChartBar",
    title: "Статистика посещений",
    text: [
      "Для улучшения приложения используется сервис Яндекс Метрика. Он собирает обезличенные сведения о посещениях: тип устройства, просмотренные разделы, действия на страницах.",
      "Отключить сбор статистики можно в настройках браузера или с помощью блокировщика.",
    ],
  },
];

const Privacy = () => (
  <SubPageLayout title="Политика конфиденциальности">
    <p className="text-[12px] text-muted-foreground mt-1">Действует с 2026 года</p>

    <div className="mt-4 space-y-3">
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
    </div>
  </SubPageLayout>
);

export default Privacy;