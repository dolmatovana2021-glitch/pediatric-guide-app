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

type PortionRow = {
  product: string;
  m4_5: string;
  m6: string;
  m7: string;
  m8: string;
  m9_12: string;
};

const portions: PortionRow[] = [
  { product: "Овощное пюре", m4_5: "10–150", m6: "150", m7: "150", m8: "180", m9_12: "200" },
  { product: "Каша", m4_5: "10–150", m6: "150", m7: "150", m8: "180", m9_12: "200" },
  { product: "Фруктовое пюре", m4_5: "—", m6: "60", m7: "70", m8: "80", m9_12: "90–100" },
  { product: "Мясное пюре", m4_5: "—", m6: "5–30", m7: "30", m8: "50", m9_12: "60–70" },
  { product: "Желток", m4_5: "—", m6: "—", m7: "¼", m8: "½", m9_12: "½" },
  { product: "Творог", m4_5: "—", m6: "10–40", m7: "40", m8: "40", m9_12: "50" },
  { product: "Рыбное пюре", m4_5: "—", m6: "—", m7: "—", m8: "5–30", m9_12: "30–60" },
  { product: "Кисломолочное", m4_5: "—", m6: "—", m7: "—", m8: "200", m9_12: "200" },
  { product: "Сок", m4_5: "—", m6: "—", m7: "—", m8: "—", m9_12: "80–100" },
  { product: "Масло растит.", m4_5: "1–3", m6: "5", m7: "5", m8: "6", m9_12: "6" },
  { product: "Масло сливоч.", m4_5: "1–4", m6: "5", m7: "5", m8: "6", m9_12: "6" },
  { product: "Сухари, печенье", m4_5: "—", m6: "—", m7: "5", m8: "5", m9_12: "10–15" },
  { product: "Хлеб пшеничный", m4_5: "—", m6: "—", m7: "—", m8: "5", m9_12: "10" },
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

      <div className="mt-6 bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 rounded-xl border bg-orange-50 text-orange-600 border-orange-200 flex items-center justify-center flex-shrink-0">
            <Icon name="CalendarDays" size={18} />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Объёмы порций по месяцам</p>
            <p className="text-[11px] text-muted-foreground">Примерное количество, г (мл) в сутки</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="bg-mint-50 text-muted-foreground">
                <th className="text-left font-semibold px-3 py-2 sticky left-0 bg-mint-50">Продукт</th>
                <th className="font-semibold px-2 py-2 whitespace-nowrap">4–5 мес</th>
                <th className="font-semibold px-2 py-2 whitespace-nowrap">6 мес</th>
                <th className="font-semibold px-2 py-2 whitespace-nowrap">7 мес</th>
                <th className="font-semibold px-2 py-2 whitespace-nowrap">8 мес</th>
                <th className="font-semibold px-2 py-2 whitespace-nowrap">9–12 мес</th>
              </tr>
            </thead>
            <tbody>
              {portions.map((row, i) => (
                <tr key={row.product} className={i % 2 ? "bg-muted/40" : "bg-white"}>
                  <td className={`text-left px-3 py-2 font-medium text-foreground whitespace-nowrap sticky left-0 ${i % 2 ? "bg-muted/40" : "bg-white"}`}>
                    {row.product}
                  </td>
                  <td className="text-center px-2 py-2 text-foreground">{row.m4_5}</td>
                  <td className="text-center px-2 py-2 text-foreground">{row.m6}</td>
                  <td className="text-center px-2 py-2 text-foreground">{row.m7}</td>
                  <td className="text-center px-2 py-2 text-foreground">{row.m8}</td>
                  <td className="text-center px-2 py-2 text-foreground">{row.m9_12}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted-foreground px-3 py-2 border-t border-border leading-snug">
          «—» продукт в этом возрасте ещё не вводят. Объёмы примерные, уточняйте у педиатра.
        </p>
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