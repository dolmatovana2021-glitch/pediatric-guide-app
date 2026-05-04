import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  rashPhotos,
  diseases,
  SectionWrapper,
  SectionTitle,
} from "@/components/shared/SectionShared";

// DISEASES
export function DiseasesSection() {
  return (
    <SectionWrapper>
      <SectionTitle emoji="🌡️" title="Болезни и симптомы" />
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
    </SectionWrapper>
  );
}

// RASHES
export function RashesSection() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <SectionWrapper>
      <SectionTitle emoji="🔬" title="Сыпи у детей" subtitle="Нажмите на карточку для подробной информации" />

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 flex gap-2 items-start">
        <span className="text-base flex-shrink-0">⚠️</span>
        <p className="text-xs text-amber-700 leading-relaxed">Фото для ориентира. Точный диагноз ставит только врач при осмотре.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rashPhotos.map((rash, i) => (
          <div key={i} className="flex flex-col">
            <button
              onClick={() => setSelected(selected === i ? null : i)}
              className={`rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${
                selected === i ? "border-primary" : "border-transparent"
              }`}
            >
              <div className="relative">
                <img
                  src={rash.photo}
                  alt={rash.label}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white font-bold text-sm leading-tight">{rash.label}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${rash.tagColor}`}>
                    {rash.tag}
                  </span>
                </div>
              </div>
            </button>

            {selected === i && (
              <div className="mt-2 bg-white border border-border rounded-2xl p-3 shadow-sm animate-fade-in col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">🌡️ {rash.temp}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{rash.desc}</p>
                <div className="mb-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Признаки</p>
                  <ul className="space-y-1">
                    {rash.signs.map((sign, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-mint-50 rounded-xl p-2.5">
                  <p className="text-xs font-bold text-primary mb-0.5">✅ Что делать</p>
                  <p className="text-xs text-foreground leading-relaxed">{rash.action}</p>
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
export function ContactsSection() {
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
