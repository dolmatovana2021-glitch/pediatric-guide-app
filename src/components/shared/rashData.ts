export type RashItem = {
  id: string;
  title: string;
};

export type RashCategory = {
  id: string;
  title: string;
  emoji: string;
  items: RashItem[];
};

export const rashCategories: RashCategory[] = [
  {
    id: "infectious",
    title: "Инфекционные сыпи",
    emoji: "🦠",
    items: [
      { id: "chickenpox", title: "Ветряная оспа" },
      { id: "measles", title: "Корь" },
      { id: "rubella", title: "Краснуха" },
      { id: "scarlet-fever", title: "Скарлатина" },
      { id: "roseola", title: "Внезапная экзантема" },
      { id: "parvovirus", title: "Парвовирусная инфекция" },
      { id: "mononucleosis", title: "Инфекционный мононуклеоз" },
      { id: "ulec", title: "Унилатеральная латероторакальная экзантема" },
      { id: "gianotti-crosti", title: "Синдром Джанотти-Крости" },
      { id: "enterovirus", title: "Энтеровирусная инфекция" },
      { id: "pseudotuberculosis", title: "Псевдотуберкулёз" },
      { id: "borreliosis", title: "Клещевой боррелиоз" },
      { id: "neonatal-candidiasis", title: "Кандидоз новорождённых" },
    ],
  },
  {
    id: "non-infectious",
    title: "Неинфекционные сыпи",
    emoji: "🌿",
    items: [
      { id: "bite-midges", title: "Укусы мошек" },
      { id: "bite-mosquitoes", title: "Укусы комаров" },
      { id: "bite-bees", title: "Укусы пчёл" },
      { id: "bite-wasps", title: "Укусы ос" },
      { id: "bite-hornets", title: "Укусы шершней" },
      { id: "contact-dermatitis", title: "Контактный дерматит" },
      { id: "urticaria", title: "Аллергическая крапивница" },
    ],
  },
];
