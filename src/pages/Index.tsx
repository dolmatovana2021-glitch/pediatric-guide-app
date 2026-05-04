import { useState } from "react";
import Icon from "@/components/ui/icon";

const DOCTOR_BEAR = "https://cdn.poehali.dev/projects/4bdabf76-7052-4eed-87e7-a05ab9d3eeed/files/fbc96f2c-8019-4441-a755-50cf8cf65882.jpg";

type Section = "home" | "firstaid" | "diseases" | "nutrition" | "calculator" | "faq" | "contacts";

// ──────────────────────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────────────────────

const navItems: { id: Section; label: string; emoji: string }[] = [
  { id: "home", label: "Главная", emoji: "🏠" },
  { id: "firstaid", label: "Первая помощь", emoji: "🚑" },
  { id: "diseases", label: "Болезни", emoji: "🌡️" },
  { id: "nutrition", label: "Питание", emoji: "🥦" },
  { id: "calculator", label: "Нормы", emoji: "📏" },
  { id: "faq", label: "Вопросы", emoji: "💬" },
  { id: "contacts", label: "Врачи", emoji: "👩‍⚕️" },
];

const firstAidItems = [
  { icon: "Flame", color: "bg-orange-50 text-orange-500", title: "Ожог", steps: ["Охладите под прохладной водой 10–20 минут", "Не используйте лёд, масло или зубную пасту", "Закройте стерильной повязкой", "При большом ожоге — вызвать скорую"] },
  { icon: "Zap", color: "bg-yellow-50 text-yellow-500", title: "Судороги", steps: ["Уложите ребёнка на бок", "Уберите опасные предметы рядом", "Не удерживайте ребёнка силой", "Зафиксируйте время начала. Скорая, если > 5 мин"] },
  { icon: "Wind", color: "bg-blue-50 text-blue-500", title: "Инородное тело", steps: ["Кашель — побудите продолжать кашлять", "5 ударов по спине между лопатками", "5 толчков на живот (Геймлих от 1 года)", "Немедленно вызовите скорую"] },
  { icon: "Droplets", color: "bg-red-50 text-red-500", title: "Кровотечение", steps: ["Прижмите чистую ткань к ране", "Удерживайте давление 10 минут", "Поднимите повреждённую конечность вверх", "При сильном кровотечении — скорая"] },
  { icon: "Thermometer", color: "bg-rose-50 text-rose-500", title: "Высокая температура", steps: ["Дать жаропонижающее (парацетамол/ибупрофен)", "Обеспечить питьё", "Проветрить комнату, не кутать", "Скорая если > 39 °C у детей до 3 мес"] },
  { icon: "Bug", color: "bg-green-50 text-green-500", title: "Укус насекомого", steps: ["Удалить жало пинцетом (не давить)", "Приложить холод на 10 минут", "Антигистаминный крем на место укуса", "Скорая при отёке лица, затруднении дыхания"] },
];

const rashPhotos = [
  { label: "Ветрянка", color: "from-rose-100 to-rose-200", emoji: "🔴", desc: "Пузырьки с прозрачной жидкостью, сильный зуд, сыпь по всему телу" },
  { label: "Краснуха", color: "from-pink-100 to-pink-200", emoji: "🟣", desc: "Мелкая розовая сыпь, начинается с лица, увеличены лимфоузлы" },
  { label: "Корь", color: "from-orange-100 to-orange-200", emoji: "🟠", desc: "Крупные красные пятна, сливаются, высокая температура" },
  { label: "Потница", color: "from-yellow-100 to-yellow-200", emoji: "🟡", desc: "Мелкие красные бугорки в складках кожи, при перегреве" },
  { label: "Аллергия", color: "from-purple-100 to-purple-200", emoji: "💜", desc: "Волдыри, сильный зуд, появляется после контакта с аллергеном" },
  { label: "Скарлатина", color: "from-red-100 to-red-200", emoji: "🔺", desc: "Мелкая сыпь как наждачная бумага, малиновый язык" },
];

const diseases = [
  { emoji: "🤧", name: "ОРВИ", temp: "37–39 °C", symptoms: "Насморк, кашель, боль в горле, слабость", action: "Жаропонижающее, питьё, покой" },
  { emoji: "👂", name: "Отит", temp: "37–39 °C", symptoms: "Боль в ухе, плач при нажатии на козелок", action: "Обратиться к врачу. Капли только по назначению" },
  { emoji: "🤮", name: "Ротавирус", temp: "37–39 °C", symptoms: "Рвота, понос, боль в животе", action: "Регидратация, исключить молоко. Скорая при обезвоживании" },
  { emoji: "😮‍💨", name: "Ларингит", temp: "37–38 °C", symptoms: "Лающий кашель, осиплость, круп", action: "Свежий воздух, влажность. При удушье — скорая" },
  { emoji: "🦷", name: "Стоматит", temp: "нет/37 °C", symptoms: "Язвочки во рту, отказ от еды, слюнотечение", action: "Полоскания, гели для дёсен, мягкая пища" },
  { emoji: "👁️", name: "Конъюнктивит", temp: "нет", symptoms: "Покраснение, выделения из глаз, склеивание", action: "Промывание ромашкой. Капли — по рецепту врача" },
];

const nutritionData = [
  { age: "0–6 мес", icon: "🍼", title: "Грудное молоко или смесь", tips: ["Кормление по требованию", "Не нужна вода при ГВ", "Витамин D с первых дней жизни"] },
  { age: "6–8 мес", icon: "🥣", title: "Начало прикорма", tips: ["Овощные пюре: кабачок, брокколи", "По 1/2 чайной ложки, увеличивать постепенно", "Новый продукт — раз в 3–5 дней"] },
  { age: "8–12 мес", icon: "🍚", title: "Разнообразный прикорм", tips: ["Каши, мясо, яйца, рыба", "Творог, кефир с 8 месяцев", "Избегать соль, сахар, мёд до года"] },
  { age: "1–3 года", icon: "🥗", title: "Общий стол", tips: ["5 приёмов пищи в день", "Порция примерно с кулачок ребёнка", "Ограничить сладкое и фастфуд"] },
  { age: "3–7 лет", icon: "🍱", title: "Осознанное питание", tips: ["Учить названия продуктов", "Совместная готовка развивает интерес", "Разнообразие — ключ к здоровью"] },
];

const milestones = [
  { month: 1, skill: "Фиксирует взгляд на лице" },
  { month: 3, skill: "Держит голову, улыбается" },
  { month: 6, skill: "Сидит с поддержкой, лепечет" },
  { month: 9, skill: "Встаёт у опоры, говорит «ма-ма»" },
  { month: 12, skill: "Ходит, знает 1–3 слова" },
  { month: 18, skill: "10–20 слов, поднимается по лестнице" },
  { month: 24, skill: "Короткие предложения, бегает" },
];

const faqItems = [
  { q: "Нужно ли сбивать температуру 37,5 °C?", a: "Нет. До 38,5 °C у детей старше 3 мес сбивать не нужно, если ребёнок чувствует себя нормально. Температура — признак борьбы иммунитета с инфекцией." },
  { q: "Когда нужны антибиотики?", a: "Только при бактериальных инфекциях, по назначению врача. ОРВИ (вирус) антибиотиками не лечится. Самостоятельно давать антибиотики нельзя." },
  { q: "Как часто купать новорождённого?", a: "Каждый день в первые месяцы. Достаточно 5–10 минут в воде 36–37 °C. Шампунь и мыло — не чаще 2–3 раз в неделю." },
  { q: "Когда начинать прикорм?", a: "Оптимально — с 6 месяцев. Признаки готовности: держит голову, проявляет интерес к еде, удвоил вес от рождения." },
  { q: "Почему ребёнок плохо спит?", a: "Причин много: зубы, голод, перегрев, болезнь, тревожность. До 2 лет ночные пробуждения — норма. Важен ритуал отхода ко сну." },
  { q: "Как часто должен ходить в туалет грудничок?", a: "При ГВ — от 8–12 раз в день (моча) и 1–8 раз (стул). К 1–2 месяцам стул может быть реже. Важнее консистенция, чем частота." },
];

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}

function SectionTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-3xl">{emoji}</span>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      {subtitle && <p className="text-muted-foreground text-sm ml-[52px]">{subtitle}</p>}
    </div>
  );
}

// HOME
function HomeSection({ setSection }: { setSection: (s: Section) => void }) {
  const quickCards: { id: Section; emoji: string; label: string; color: string }[] = [
    { id: "firstaid", emoji: "🚑", label: "Первая помощь", color: "bg-red-50 border-red-200 hover:border-red-300" },
    { id: "diseases", emoji: "🌡️", label: "Болезни", color: "bg-orange-50 border-orange-200 hover:border-orange-300" },
    { id: "nutrition", emoji: "🥦", label: "Питание", color: "bg-green-50 border-green-200 hover:border-green-300" },
    { id: "calculator", emoji: "📏", label: "Калькуляторы", color: "bg-blue-50 border-blue-200 hover:border-blue-300" },
    { id: "faq", emoji: "💬", label: "Вопросы", color: "bg-purple-50 border-purple-200 hover:border-purple-300" },
    { id: "contacts", emoji: "👩‍⚕️", label: "Врачи", color: "bg-teal-50 border-teal-200 hover:border-teal-300" },
  ];

  return (
    <SectionWrapper>
      <div className="blob-bg rounded-3xl p-6 mb-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="font-caveat text-primary text-lg font-semibold mb-1">Привет, родитель! 👋</p>
            <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
              МалышДок —<br />ваш педиатрический<br />помощник
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Первая помощь, болезни, питание и развитие — всё в одном приложении
            </p>
          </div>
          <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
            <img src={DOCTOR_BEAR} alt="Доктор" className="w-full h-full object-cover" />
          </div>
        </div>
        <button
          onClick={() => setSection("firstaid")}
          className="mt-4 w-full bg-red-500 text-white rounded-2xl py-3 px-4 flex items-center justify-between font-semibold text-sm shadow-md active:scale-95 transition-transform"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🚨</span>
            Нужна первая помощь!
          </span>
          <Icon name="ChevronRight" size={18} />
        </button>
      </div>

      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Разделы</h3>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {quickCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSection(card.id)}
            className={`${card.color} border rounded-2xl p-3 text-center card-hover flex flex-col items-center gap-1.5`}
          >
            <span className="text-2xl">{card.emoji}</span>
            <span className="text-xs font-semibold text-foreground">{card.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-mint-50 border border-mint-200 rounded-2xl p-4">
        <p className="font-caveat text-primary text-base font-semibold mb-1">💡 Совет дня</p>
        <p className="text-sm text-foreground leading-relaxed">
          Витамин D необходим детям с первых дней жизни — особенно в осенне-зимний период.
          Обсудите дозировку с педиатром на ближайшем приёме.
        </p>
      </div>
    </SectionWrapper>
  );
}

// FIRST AID
function FirstAidSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <SectionWrapper>
      <SectionTitle emoji="🚑" title="Первая помощь" subtitle="Нажмите на ситуацию, чтобы увидеть шаги" />
      <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 flex gap-2 items-center">
        <span className="text-xl">📞</span>
        <p className="text-xs text-red-700 font-medium">При угрозе жизни звоните <strong className="text-base">103</strong> или <strong className="text-base">112</strong></p>
      </div>
      <div className="space-y-3">
        {firstAidItems.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <Icon name={item.icon} fallback="AlertCircle" size={20} />
                </div>
                <span className="font-semibold text-foreground">{item.title}</span>
              </div>
              <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground" />
            </button>
            {open === i && (
              <div className="px-4 pb-4 space-y-2 animate-fade-in">
                {item.steps.map((step, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// DISEASES + GALLERY
function DiseasesSection() {
  const [tab, setTab] = useState<"list" | "gallery">("list");
  return (
    <SectionWrapper>
      <SectionTitle emoji="🌡️" title="Болезни и симптомы" />
      <div className="flex bg-muted rounded-2xl p-1 mb-4">
        {(["list", "gallery"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === t ? "bg-white shadow-sm text-primary" : "text-muted-foreground"
            }`}
          >
            {t === "list" ? "🗒️ Болезни" : "📸 Галерея сыпей"}
          </button>
        ))}
      </div>

      {tab === "list" && (
        <div className="space-y-3">
          {diseases.map((d, i) => (
            <div key={i} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{d.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">{d.name}</h3>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">{d.temp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{d.symptoms}</p>
                  <div className="bg-mint-50 rounded-xl p-2">
                    <p className="text-xs text-primary font-semibold">✅ {d.action}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "gallery" && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 flex gap-2">
            <span>⚠️</span>
            <p className="text-xs text-amber-700">Галерея только для ориентира. Диагноз ставит врач при осмотре.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {rashPhotos.map((rash, i) => (
              <div key={i} className={`bg-gradient-to-br ${rash.color} rounded-2xl p-4 border border-white shadow-sm`}>
                <span className="text-3xl block mb-2">{rash.emoji}</span>
                <h4 className="font-bold text-foreground text-sm mb-1">{rash.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{rash.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

// NUTRITION
function NutritionSection() {
  return (
    <SectionWrapper>
      <SectionTitle emoji="🥦" title="Питание и развитие" subtitle="Рекомендации по возрасту" />
      <div className="space-y-4 mb-5">
        {nutritionData.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <span className="text-xs font-semibold text-primary bg-mint-50 px-2 py-0.5 rounded-full">{item.age}</span>
                <h3 className="font-bold text-foreground mt-0.5">{item.title}</h3>
              </div>
            </div>
            <ul className="space-y-1.5">
              {item.tips.map((tip, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-br from-mint-50 to-green-50 border border-mint-200 rounded-2xl p-4">
        <h3 className="font-bold text-foreground mb-3">🏃 Этапы развития</h3>
        <div className="space-y-2">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 text-right flex-shrink-0">
                <span className="text-xs font-bold text-primary">{m.month} мес</span>
              </div>
              <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
              <p className="text-sm text-foreground">{m.skill}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// CALCULATOR
function CalculatorSection() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");

  const weightNum = parseFloat(weight);
  const ageNum = parseInt(age);
  const heightNum = parseFloat(height);

  const bmi = weight && height ? (weightNum / ((heightNum / 100) ** 2)).toFixed(1) : null;
  const paracetamolDose = weight ? `${(weightNum * 10).toFixed(0)}–${(weightNum * 15).toFixed(0)} мг` : null;
  const ibuprofenDose = weight ? `${(weightNum * 5).toFixed(0)}–${(weightNum * 10).toFixed(0)} мг` : null;
  const dailyCalories = age && weight
    ? ageNum < 1 ? "110–120 ккал/кг" : ageNum < 3 ? `${Math.round(weightNum * 100)} ккал` : `${Math.round(weightNum * 90)} ккал`
    : null;

  const hasResult = paracetamolDose || bmi || dailyCalories;

  return (
    <SectionWrapper>
      <SectionTitle emoji="📏" title="Калькуляторы норм" subtitle="Введите данные ребёнка" />
      <div className="bg-white border border-border rounded-2xl p-4 shadow-sm mb-4">
        <h3 className="font-semibold text-foreground mb-3">Данные ребёнка</h3>
        <div className="space-y-3">
          {[
            { label: "Вес (кг)", value: weight, setter: setWeight, placeholder: "Например: 12.5" },
            { label: "Рост (см)", value: height, setter: setHeight, placeholder: "Например: 85" },
            { label: "Возраст (лет)", value: age, setter: setAge, placeholder: "Например: 3" },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">{field.label}</label>
              <input
                type="number"
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                placeholder={field.placeholder}
                className="w-full border border-input rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-background"
              />
            </div>
          ))}
        </div>
      </div>

      {hasResult ? (
        <div className="space-y-3 animate-fade-in">
          {paracetamolDose && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h4 className="font-bold text-blue-700 mb-2">💊 Дозы жаропонижающих</h4>
              <p className="text-sm text-foreground"><span className="font-semibold">Парацетамол:</span> {paracetamolDose} разово</p>
              <p className="text-sm text-foreground"><span className="font-semibold">Ибупрофен:</span> {ibuprofenDose} разово</p>
              <p className="text-xs text-muted-foreground mt-2">* Интервал не менее 4 ч. Не более 4 раз в сутки.</p>
            </div>
          )}
          {bmi && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <h4 className="font-bold text-green-700 mb-1">⚖️ Индекс массы тела</h4>
              <p className="text-3xl font-bold text-foreground">{bmi}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {parseFloat(bmi) < 15 ? "Ниже нормы — проконсультируйтесь с врачом"
                  : parseFloat(bmi) < 19 ? "В норме для большинства возрастов"
                  : "Выше нормы — уточните у педиатра"}
              </p>
            </div>
          )}
          {dailyCalories && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <h4 className="font-bold text-orange-700 mb-1">🍽️ Норма калорий в день</h4>
              <p className="text-3xl font-bold text-foreground">{dailyCalories}</p>
              <p className="text-xs text-muted-foreground mt-1">Ориентировочно. Зависит от активности ребёнка.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted rounded-2xl p-6 text-center">
          <span className="text-4xl block mb-2">📊</span>
          <p className="text-muted-foreground text-sm">Введите данные выше, чтобы увидеть расчёты</p>
        </div>
      )}
    </SectionWrapper>
  );
}

// FAQ
function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <SectionWrapper>
      <SectionTitle emoji="💬" title="Частые вопросы" subtitle="Ответы педиатра на популярные вопросы" />
      <div className="space-y-3">
        {faqItems.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left p-4 flex items-start justify-between gap-3"
            >
              <p className="font-semibold text-foreground text-sm leading-relaxed">{item.q}</p>
              <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground flex-shrink-0 mt-0.5" />
            </button>
            {open === i && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="bg-mint-50 rounded-xl p-3">
                  <p className="text-sm text-foreground leading-relaxed">{item.a}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// CONTACTS
function ContactsSection() {
  const contacts = [
    { emoji: "🩺", role: "Педиатр", name: "Ваш участковый врач", phone: "Указан в карте ребёнка", color: "bg-blue-50 border-blue-200" },
    { emoji: "🦷", role: "Стоматолог", name: "Детский стоматолог", phone: "По направлению", color: "bg-yellow-50 border-yellow-200" },
    { emoji: "👁️", role: "Окулист", name: "Детский офтальмолог", phone: "По направлению", color: "bg-purple-50 border-purple-200" },
    { emoji: "🧠", role: "Невролог", name: "Детский невролог", phone: "По направлению", color: "bg-green-50 border-green-200" },
  ];
  const emergency = [
    { name: "Скорая помощь", phone: "103", color: "bg-red-500" },
    { name: "Единый номер", phone: "112", color: "bg-red-600" },
    { name: "Детская неотложка", phone: "103", color: "bg-orange-500" },
    { name: "Телефон доверия", phone: "8-800-2000-122", color: "bg-blue-500" },
  ];
  return (
    <SectionWrapper>
      <SectionTitle emoji="👩‍⚕️" title="Контакты врача" subtitle="Специалисты и экстренные службы" />
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">🚨 Экстренные номера</h3>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {emergency.map((e, i) => (
          <a key={i} href={`tel:${e.phone}`} className={`${e.color} text-white rounded-2xl p-3 text-center active:scale-95 transition-transform block`}>
            <p className="text-xl font-bold">{e.phone}</p>
            <p className="text-xs opacity-90">{e.name}</p>
          </a>
        ))}
      </div>
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">🏥 Специалисты</h3>
      <div className="space-y-3">
        {contacts.map((c, i) => (
          <div key={i} className={`${c.color} border rounded-2xl p-4 flex items-center gap-3`}>
            <span className="text-2xl">{c.emoji}</span>
            <div className="flex-1">
              <p className="font-bold text-foreground">{c.role}</p>
              <p className="text-sm text-muted-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.phone}</p>
            </div>
            <button className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <Icon name="Phone" size={16} className="text-primary" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-mint-50 border border-mint-200 rounded-2xl p-4">
        <p className="font-caveat text-primary text-base font-semibold mb-1">📝 Важно</p>
        <p className="text-sm text-foreground leading-relaxed">
          Запишите телефон вашего педиатра заранее — в критической ситуации это сэкономит драгоценное время.
        </p>
      </div>
    </SectionWrapper>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main App
// ──────────────────────────────────────────────────────────────────────────────

export default function Index() {
  const [section, setSection] = useState<Section>("home");

  const renderSection = () => {
    switch (section) {
      case "home": return <HomeSection setSection={setSection} />;
      case "firstaid": return <FirstAidSection />;
      case "diseases": return <DiseasesSection />;
      case "nutrition": return <NutritionSection />;
      case "calculator": return <CalculatorSection />;
      case "faq": return <FaqSection />;
      case "contacts": return <ContactsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-golos">
      <div className="max-w-[480px] mx-auto flex flex-col min-h-screen relative">

        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
          {section !== "home" ? (
            <>
              <button
                onClick={() => setSection("home")}
                className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"
              >
                <Icon name="ArrowLeft" size={18} className="text-foreground" />
              </button>
              <span className="font-semibold text-foreground">
                {navItems.find(n => n.id === section)?.emoji}{" "}
                {navItems.find(n => n.id === section)?.label}
              </span>
            </>
          ) : (
            <>
              <span className="font-caveat text-primary font-bold text-xl">МалышДок</span>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">v1.0</span>
            </>
          )}
        </div>

        {/* Content */}
        <main className="flex-1 px-4 py-4 pb-24">
          {renderSection()}
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur-md border-t border-border px-1 py-2 z-30">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-xl transition-all ${
                  section === item.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className={`text-lg transition-transform ${section === item.id ? "scale-110" : ""}`}>
                  {item.emoji}
                </span>
                <span className={`text-[9px] font-semibold leading-none ${section === item.id ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}