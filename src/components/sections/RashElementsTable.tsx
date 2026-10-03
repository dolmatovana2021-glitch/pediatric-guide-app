import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Segmented } from "@/components/shared/SectionLayout";
import {
  rashElementGroups,
  RASH_ELEMENTS_NOTE,
  type RashElement,
  type RashElementGroup,
} from "@/components/shared/rashElementsData";

function ElementRow({
  item,
  index,
  onZoom,
}: {
  item: RashElement;
  index: number;
  onZoom: (item: RashElement) => void;
}) {
  return (
    <tr className={index % 2 ? "bg-muted/40" : ""}>
      <td className="p-2 pl-3 align-top w-[92px]">
        <button
          onClick={() => onZoom(item)}
          aria-label={`Увеличить схему: ${item.name}`}
          className="block w-[80px] rounded-xl overflow-hidden border border-border bg-card active:scale-95 transition-transform"
        >
          <img
            src={item.image}
            alt={`Схема: ${item.name}`}
            loading="lazy"
            className="w-full h-auto block"
          />
        </button>
      </td>
      <td className="p-2 pr-3 align-top">
        <p className="text-[14px] font-bold text-foreground leading-tight">{item.name}</p>
        <p className="text-[11px] italic text-muted-foreground leading-tight mt-0.5">
          {item.latin}
          {item.size ? ` · ${item.size}` : ""}
        </p>
        <p className="text-[12px] text-foreground leading-snug mt-1.5">{item.description}</p>
        <p className="text-[11px] text-muted-foreground leading-snug mt-1.5">
          <span className="font-semibold text-foreground">Встречается: </span>
          {item.examples}
        </p>
      </td>
    </tr>
  );
}

function GroupTable({
  group,
  onZoom,
}: {
  group: RashElementGroup;
  onZoom: (item: RashElement) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
      <div className="px-4 pt-3.5 pb-2.5">
        <p className="text-[15px] font-bold text-foreground">{group.title}</p>
        <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">{group.hint}</p>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-y border-border bg-muted/60">
            <th className="text-left text-[11px] font-semibold text-muted-foreground py-1.5 pl-3 pr-2">
              Схема
            </th>
            <th className="text-left text-[11px] font-semibold text-muted-foreground py-1.5 pr-3 pl-2">
              Элемент и описание
            </th>
          </tr>
        </thead>
        <tbody>
          {group.items.map((item, i) => (
            <ElementRow key={item.id} item={item} index={i} onZoom={onZoom} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ZoomModal({ item, onClose }: { item: RashElement; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-3xl p-4 w-full max-w-[380px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold text-foreground leading-tight">{item.name}</p>
            <p className="text-[12px] italic text-muted-foreground">{item.latin}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="w-9 h-9 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        <img
          src={item.image}
          alt={`Схема: ${item.name}`}
          className="w-full h-auto rounded-2xl border border-border"
        />
        <p className="text-[11px] text-muted-foreground text-center mt-1.5">
          Сверху — вид на коже, снизу — срез кожи
        </p>
        <p className="text-[13px] text-foreground leading-snug mt-3">{item.description}</p>
      </div>
    </div>
  );
}

export function RashElementsTable() {
  const [groupId, setGroupId] = useState<RashElementGroup["id"]>("primary");
  const [zoom, setZoom] = useState<RashElement | null>(null);
  const group = rashElementGroups.find((g) => g.id === groupId) ?? rashElementGroups[0];

  return (
    <div>
      <Segmented
        value={groupId}
        onChange={setGroupId}
        options={rashElementGroups.map((g) => ({
          id: g.id,
          label: `${g.id === "primary" ? "Первичные" : "Вторичные"} · ${g.items.length}`,
        }))}
      />

      <GroupTable group={group} onZoom={setZoom} />

      <div className="flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-2xl px-3 py-2.5 mt-3">
        <Icon name="Info" size={15} className="text-sky-600 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] text-sky-900 leading-snug">
          {RASH_ELEMENTS_NOTE} Нажмите на схему, чтобы увеличить.
        </span>
      </div>

      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl px-3 py-2.5 mt-2">
        <Icon name="TriangleAlert" size={15} className="text-red-600 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] text-red-900 leading-snug">
          Петехии и пурпура, которые не бледнеют при надавливании прозрачным стаканом, особенно
          вместе с температурой, — повод немедленно вызвать 103.
        </span>
      </div>

      {zoom && <ZoomModal item={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}

export default RashElementsTable;
