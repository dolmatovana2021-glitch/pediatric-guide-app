import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";

type Block = {
  icon: string;
  color: string;
  title: string;
  intro?: string;
  items: string[];
};

const blocks: Block[] = [
  {
    icon: "Clock",
    color: "bg-mint-50 text-primary border-mint-200",
    title: "Когда вводить прикорм",
    intro:
      "Прикорм — это все продукты, кроме грудного молока и детской молочной смеси, дополняющие рацион ребёнка.",
    items: [
      "Оптимальный возраст введения прикорма — от 4 до 6 месяцев.",
      "Раньше 4 месяцев ребёнок ещё не готов к новой пище, позже 6 месяцев возникают проблемы с адаптацией.",
      "Срок определяется индивидуально педиатром с учётом особенностей развития ребёнка.",
      "Детям на грудном вскармливании прикорм назначают так же, как и при искусственном.",
    ],
  },
  {
    icon: "CheckCircle2",
    color: "bg-sky-50 text-sky-600 border-sky-200",
    title: "Признаки готовности ребёнка",
    items: [
      "Угасание рефлекса «выталкивания» (язык не выталкивает пищу).",
      "Готовность к жевательным движениям.",
      "Удерживает голову, уверенно сидит с поддержкой.",
      "Открывает рот при приближении ложки.",
      "Отворачивается от ложки, когда не голоден.",
      "Проявляет интерес к пище взрослых.",
    ],
  },
  {
    icon: "ListChecks",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    title: "Основные правила введения",
    items: [
      "Вводите новый продукт здоровому ребёнку, не в жаркую погоду и не во время прививок.",
      "Давайте прикорм перед кормлением грудью (смесью), с ложечки.",
      "Начинайте с малых количеств (1/2 чайной ложки) и постепенно за 5–7 дней доводите до возрастной нормы.",
      "Вводите по одному новому продукту, постепенно усложняя его состав.",
      "Новые продукты не дают в период острых заболеваний и во время вакцинации.",
      "Консистенция пищи — гомогенная, к 9–10 месяцам переходят к более густой и измельчённой.",
    ],
  },
  {
    icon: "Utensils",
    color: "bg-violet-50 text-violet-600 border-violet-200",
    title: "Последовательность продуктов",
    intro:
      "Первыми вводят продукты с наибольшей пищевой ценностью — овощное пюре или кашу. Детям с недостаточной массой и неустойчивым стулом — кашу, со склонностью к запорам и избыточной массой — овощи.",
    items: [
      "Овощное пюре — с 4–6 месяцев (кабачок, цветная капуста, брокколи).",
      "Каша (безмолочная, безглютеновая: гречневая, рисовая, кукурузная) — с 4–6 месяцев.",
      "Мясное пюре — с 6 месяцев (источник железа: индейка, кролик, говядина).",
      "Фруктовое пюре — с 6 месяцев (после основных блюд).",
      "Желток — с 7 месяцев.",
      "Творог — с 6 месяцев (не ранее).",
      "Рыба — с 8 месяцев (1–2 раза в неделю вместо мяса).",
      "Кисломолочные продукты, детский кефир, йогурт — с 8 месяцев.",
      "Сухарики, детское печенье, хлеб пшеничный — с 7–8 месяцев.",
      "Растительное и сливочное масло — добавляют в блюда прикорма (с 4–6 мес.).",
    ],
  },
  {
    icon: "Ban",
    color: "bg-rose-50 text-rose-600 border-rose-200",
    title: "Что нельзя на первом году",
    items: [
      "Цельное коровье и козье молоко как основной напиток.",
      "Соль и сахар в блюдах прикорма.",
      "Мёд (риск ботулизма у детей до года).",
      "Соки до 6 месяцев — они не имеют преимуществ перед фруктовым пюре.",
      "Грибы, морепродукты, экзотические фрукты, орехи.",
      "Колбасные изделия, копчёности, консервы «для взрослых».",
    ],
  },
];

export function FeedingSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionWrapper>
      <SectionTitle
        emoji="🥣"
        title="Организация прикорма"
        subtitle="По методическим рекомендациям НМИЦ здоровья детей"
      />

      <div className="space-y-3">
        {blocks.map((block, i) => {
          const isOpen = open === i;
          return (
            <div
              key={block.title}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${block.color}`}
                >
                  <Icon name={block.icon} fallback="Utensils" size={18} />
                </div>
                <p className="flex-1 text-left font-semibold text-foreground text-sm">
                  {block.title}
                </p>
                <Icon
                  name="ChevronDown"
                  size={18}
                  className={`text-muted-foreground flex-shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 animate-fade-in">
                  {block.intro && (
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                      {block.intro}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-2 text-[13px] text-foreground leading-snug">
                        <Icon
                          name="Dot"
                          size={18}
                          className="text-primary flex-shrink-0 -ml-1"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <a
        href="https://nczd.ru/wp-content/uploads/2019/12/Met_rekom_1_god_.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 bg-mint-50 border border-mint-200 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-white border border-mint-200 flex items-center justify-center flex-shrink-0">
          <Icon name="FileText" size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm leading-tight">
            Источник: методические рекомендации
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Программа вскармливания детей 1-го года жизни (глава 5)
          </p>
        </div>
        <Icon name="ExternalLink" size={16} className="text-muted-foreground flex-shrink-0" />
      </a>
    </SectionWrapper>
  );
}

export default FeedingSection;
