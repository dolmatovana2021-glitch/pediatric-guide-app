import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const bears = [
  { src: "/bears/bear-plaster.png?v=2", name: "С пластырем" },
  { src: "/bears/bear-firstaid.png?v=2", name: "С аптечкой" },
  { src: "/bears/bear-thermometer.png?v=2", name: "С градусником" },
  { src: "/bears/bear-sleepy.png?v=2", name: "Сонный" },
  { src: "/bears/bear-lantern.png?v=2", name: "С фонариком" },
  { src: "/bears/bear-doctor-standing.png?v=2", name: "Доктор в полный рост" },
];

const backgrounds = [
  { label: "Белый", value: "#ffffff" },
  { label: "Персиковый", value: "#f5c6a0" },
  { label: "Мятный", value: "#dff3ec" },
  { label: "Ночной", value: "#1b2a44" },
];

export default function Bears() {
  const [bg, setBg] = useState(backgrounds[0].value);
  const dark = bg === "#1b2a44";

  return (
    <div className="min-h-screen transition-colors" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className={`flex items-center gap-2 text-sm ${dark ? "text-white/80" : "text-neutral-600"}`}>
            <Icon name="ArrowLeft" size={16} />
            На главную
          </Link>
          <div className="flex flex-wrap gap-2">
            {backgrounds.map((b) => (
              <button
                key={b.value}
                onClick={() => setBg(b.value)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                  bg === b.value ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white text-neutral-800"
                }`}
              >
                <span className="h-3 w-3 rounded-full border border-neutral-300" style={{ background: b.value }} />
                {b.label}
              </button>
            ))}
          </div>
        </div>
        <h1 className={`mb-8 text-2xl font-semibold ${dark ? "text-white" : "text-neutral-900"}`}>Медвежата</h1>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {bears.map((b) => (
            <figure key={b.src} className="flex flex-col items-center">
              <img src={b.src} alt={b.name} className="h-56 w-full object-contain" loading="lazy" />
              <figcaption className={`mt-3 text-sm ${dark ? "text-white/80" : "text-neutral-700"}`}>{b.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}