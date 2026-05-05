export type Section = "home" | "firstaid" | "emergency" | "redflags" | "diseases" | "rashes" | "contacts";

export const DOCTOR_BEAR = "https://cdn.poehali.dev/projects/4bdabf76-7052-4eed-87e7-a05ab9d3eeed/files/fbc96f2c-8019-4441-a755-50cf8cf65882.jpg";

export const navItems: { id: Section; label: string; emoji: string }[] = [
  { id: "home", label: "Главная", emoji: "🏠" },
  { id: "firstaid", label: "Помощь", emoji: "🚑" },
  { id: "emergency", label: "Неотложка", emoji: "🆘" },
  { id: "redflags", label: "Флаги", emoji: "🚩" },
  { id: "diseases", label: "Болезни", emoji: "🌡️" },
  { id: "rashes", label: "Сыпи", emoji: "🔬" },
  { id: "contacts", label: "Врачи", emoji: "👩‍⚕️" },
];
