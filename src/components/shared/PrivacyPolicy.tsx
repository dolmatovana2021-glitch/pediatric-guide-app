import Icon from "@/components/ui/icon";

type Block = { icon: string; title: string; items: string[] };

const stored: Block[] = [
  {
    icon: "Baby",
    title: "Профили детей",
    items: [
      "Имя, дата рождения, пол, вес и рост",
      "Группа крови, аллергии, отметка о группе риска",
      "Выбранный аватар",
    ],
  },
  {
    icon: "HeartPulse",
    title: "Записи о здоровье",
    items: [
      "Дневник болезни: температура, симптомы, лекарства",
      "История доз лекарств и напоминания о них",
      "Отметки и даты прививок и осмотров",
      "Зубная формула, сон и кормления",
    ],
  },
  {
    icon: "Pill",
    title: "Аптечка",
    items: ["Список лекарств и сроки годности"],
  },
  {
    icon: "Settings",
    title: "Настройки",
    items: ["Тема оформления, скрытые разделы, скрытые подсказки"],
  },
];

const outside: { icon: string; title: string; text: string }[] = [
  {
    icon: "BarChart3",
    title: "Статистика посещений",
    text: "Мы используем Яндекс Метрику, чтобы понимать, какими разделами пользуются чаще. Она собирает технические сведения: устройство, браузер, город по IP-адресу, открытые экраны и нажатия.",
  },
  {
    icon: "ClipboardList",
    title: "Опрос",
    text: "Опрос открывается в Google Формах. Ответы получает команда МалышДок, данные о ребёнке из приложения туда не передаются. Email указывать необязательно.",
  },
  {
    icon: "MessageSquare",
    title: "Пожелания и ошибки",
    text: "Если вы отправляете сообщение через эту форму, мы получаем текст и контакт для ответа, если вы его указали. Автоматически сохраняются сведения о браузере и устройстве и IP-адрес — чтобы разобраться с ошибкой и защитить форму от спама. Не пишите туда данные о здоровье ребёнка.",
  },
  {
    icon: "FileDown",
    title: "Резервная копия и отчёт для врача",
    text: "Файлы создаются только по вашей команде и сохраняются на ваше устройство. Кому их отправить, решаете вы.",
  },
];

const rights = [
  "Удалить профиль ребёнка можно в разделе «Профиль» — вместе с ним удаляются его записи",
  "Удалить все данные сразу — очистите данные сайта в настройках браузера или удалите приложение с телефона",
  "Перенести данные на другое устройство — через резервную копию в «Настройках»",
];

export function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-[13px] font-semibold text-primary active:scale-95 transition-transform"
      >
        <Icon name="ChevronLeft" size={16} />
        Настройки
      </button>

      <div className="flex items-center gap-3 mb-4">
        <span className="w-11 h-11 rounded-2xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
          <Icon name="ShieldCheck" size={22} className="text-primary" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[17px] font-bold text-foreground leading-tight">Политика конфиденциальности</h2>
          <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">Какие данные хранит МалышДок и где они лежат</p>
        </div>
      </div>

      <div className="rounded-3xl bg-primary text-primary-foreground p-4 mb-5 flex items-start gap-3">
        <Icon name="Smartphone" size={22} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-[15px] leading-tight">Всё хранится только на вашем устройстве</p>
          <p className="text-[12px] opacity-90 leading-relaxed mt-1">
            Данные о ребёнке записываются в память браузера на вашем телефоне или компьютере. Мы не отправляем их
            на сервер, не видим их и не передаём третьим лицам. Регистрация не нужна.
          </p>
        </div>
      </div>

      <p className="font-semibold text-foreground text-sm mb-3">Что сохраняется на устройстве</p>
      <div className="space-y-3 mb-3">
        {stored.map((b) => (
          <div key={b.title} className="bg-card border border-border rounded-3xl p-4 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
                <Icon name={b.icon} size={16} className="text-primary" />
              </span>
              <p className="font-semibold text-foreground text-sm">{b.title}</p>
            </div>
            <ul className="space-y-1.5">
              {b.items.map((i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-foreground leading-snug">
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0 mt-[7px]" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-[12px] text-amber-900 bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-6">
        <Icon name="TriangleAlert" size={15} className="flex-shrink-0 mt-0.5" />
        <span>
          Если очистить данные браузера, удалить приложение или потерять телефон, записи пропадут — восстановить их
          мы не сможем. Регулярно делайте резервную копию в «Настройках».
        </span>
      </div>

      <p className="font-semibold text-foreground text-sm mb-3">Что уходит за пределы устройства</p>
      <div className="space-y-3 mb-6">
        {outside.map((o) => (
          <div key={o.title} className="bg-card border border-border rounded-3xl p-4 shadow-sm flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <Icon name={o.icon} size={16} className="text-muted-foreground" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm leading-tight">{o.title}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">{o.text}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="font-semibold text-foreground text-sm mb-3">Ваши данные — под вашим контролем</p>
      <div className="bg-card border border-border rounded-3xl p-4 shadow-sm mb-4">
        <ul className="space-y-2.5">
          {rights.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[12px] text-foreground leading-snug">
              <Icon name="Check" size={14} className="text-primary flex-shrink-0 mt-0.5" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">Редакция от 16 октября 2026 года</p>
    </div>
  );
}
