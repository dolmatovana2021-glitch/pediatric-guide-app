export type Section = "home" | "firstaid" | "emergency" | "redflags" | "rash" | "vaccination" | "checkup" | "contacts" | "profile" | "psychdev" | "useful" | "docs" | "feeding";

export const DOCTOR_BEAR = "https://cdn.poehali.dev/projects/4bdabf76-7052-4eed-87e7-a05ab9d3eeed/files/fbc96f2c-8019-4441-a755-50cf8cf65882.jpg";

export const navItems: { id: Section; label: string; emoji: string }[] = [
  { id: "home", label: "Главная", emoji: "🏠" },
  { id: "firstaid", label: "Помощь", emoji: "🚑" },
  { id: "emergency", label: "Неотложка", emoji: "🆘" },
  { id: "redflags", label: "Флаги", emoji: "🚩" },
  { id: "rash", label: "Сыпь", emoji: "🔴" },
  { id: "vaccination", label: "Прививки", emoji: "💉" },
  { id: "checkup", label: "Осмотры", emoji: "🩺" },
  { id: "contacts", label: "Врачи", emoji: "👩‍⚕️" },
  { id: "profile", label: "Профиль", emoji: "👶" },
];

export const extraSectionMeta: Record<string, { label: string; emoji: string }> = {
  psychdev: { label: "Развитие", emoji: "🧠" },
  useful: { label: "Полезное", emoji: "🔗" },
  docs: { label: "Медицинская документация", emoji: "📄" },
  feeding: { label: "Организация прикорма", emoji: "🥣" },
};