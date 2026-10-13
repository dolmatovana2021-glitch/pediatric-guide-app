import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useChildProfile, saveChildProfile } from "@/components/shared/childProfile";
import {
  calcTbPlan,
  sortedRecords,
  tbTypeLabel,
  tbResultMeta,
  resultsFor,
  isSkinTest,
  fmtDate,
  daysWord,
  TB_SOON_DAYS,
  type TbRecord,
  type TbTestType,
} from "@/components/shared/tbStatus";
import { TbPhotoPicker, TbPhotoThumbs } from "@/components/sections/TbPhotos";
import { deletePhoto } from "@/components/shared/photoUpload";

function todayIso() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

const TYPES: TbTestType[] = ["mantu", "diaskin", "quantiferon", "tspot"];

function RecordForm({
  initial,
  minDate,
  onSave,
  onCancel,
  onDelete,
}: {
  initial: TbRecord;
  minDate?: string;
  onSave: (r: TbRecord) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [r, setR] = useState<TbRecord>(initial);
  const results = resultsFor(r.type);
  const setType = (type: TbTestType) =>
    setR((p) => ({
      ...p,
      type,
      result: resultsFor(type).includes(p.result) ? p.result : "negative",
      size: isSkinTest(type) ? p.size : undefined,
    }));

  return (
    <div className="bg-muted/50 border border-border rounded-2xl p-3 space-y-3">
      <div>
        <p className="text-[11px] font-bold text-muted-foreground mb-1.5">Какая проба</p>
        <div className="grid grid-cols-2 gap-1.5">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`text-[11px] font-semibold px-2 py-2 rounded-xl border transition ${
                r.type === t ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
              }`}
            >
              {tbTypeLabel[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-muted-foreground mb-1.5">
          {isSkinTest(r.type) ? "Дата постановки" : "Дата сдачи анализа"}
        </p>
        <input
          type="date"
          value={r.date}
          min={minDate}
          max={todayIso()}
          onChange={(e) => setR({ ...r, date: e.target.value })}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
        />
      </div>

      <div>
        <p className="text-[11px] font-bold text-muted-foreground mb-1.5">Результат</p>
        <div className="flex flex-wrap gap-1.5">
          {results.map((res) => (
            <button
              key={res}
              type="button"
              onClick={() => setR({ ...r, result: res })}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-full border transition ${
                r.result === res ? tbResultMeta[res].chip + " ring-2 ring-primary/40" : "bg-card text-foreground border-border"
              }`}
            >
              {tbResultMeta[res].label}
            </button>
          ))}
        </div>
      </div>

      {isSkinTest(r.type) && (
        <div>
          <p className="text-[11px] font-bold text-muted-foreground mb-1.5">Размер уплотнения, мм (необязательно)</p>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={40}
            value={r.size ?? ""}
            onChange={(e) => setR({ ...r, size: e.target.value })}
            placeholder="Например, 3"
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>
      )}

      <TbPhotoPicker photos={r.photos || []} onChange={(photos) => setR((p) => ({ ...p, photos }))} />

      <div className="flex gap-2">
        <button
          type="button"
          disabled={!r.date}
          onClick={() => {
            const keep = new Set((r.photos || []).map((p) => p.url));
            (initial.photos || []).forEach((p) => !keep.has(p.url) && deletePhoto(p.url));
            onSave({ ...r, size: r.size?.trim() || undefined, photos: r.photos?.length ? r.photos : undefined });
          }}
          className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={() => {
            const orig = new Set((initial.photos || []).map((p) => p.url));
            (r.photos || []).forEach((p) => !orig.has(p.url) && deletePhoto(p.url));
            onCancel();
          }}
          className="px-4 bg-card border border-border text-foreground rounded-xl py-2.5 text-sm font-semibold"
        >
          Отмена
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Удалить"
            className="px-3 bg-card border border-red-200 text-red-600 rounded-xl py-2.5"
          >
            <Icon name="Trash2" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function PlanBanner({ plan }: { plan: ReturnType<typeof calcTbPlan> }) {
  if (plan.kind === "no-birth")
    return (
      <Banner tone="blue" icon="Info">
        Укажите дату рождения в профиле — и приложение подскажет, когда делать следующую пробу.
      </Banner>
    );
  if (plan.kind === "adult")
    return (
      <Banner tone="slate" icon="Info">
        Ежегодные детские пробы проводятся до 18 лет. Дальше — флюорография по графику взрослых.
      </Banner>
    );
  if (plan.kind === "positive")
    return (
      <Banner tone="red" icon="CircleAlert">
        Последний результат — <b>{tbResultMeta[plan.last.result].label.toLowerCase()}</b>. Следующую проверку назначит
        фтизиатр — сроки зависят от обследования.
      </Banner>
    );
  if (plan.kind === "due")
    return (
      <Banner tone="red" icon="BellRing">
        <b>Пора сделать {tbTypeLabel[plan.test].replace("Проба Манту", "пробу Манту")}</b>
        {plan.overdueDays > 0
          ? ` — срок прошёл ${fmtDate(plan.next)} (${plan.overdueDays} ${daysWord(plan.overdueDays)} назад).`
          : " — срок сегодня."}{" "}
        Запишитесь в поликлинику или спросите в саду/школе.
      </Banner>
    );
  const soon = plan.daysLeft <= TB_SOON_DAYS;
  return (
    <Banner tone={soon ? "amber" : "green"} icon={soon ? "Clock" : "CalendarCheck"}>
      Следующая проверка — <b>{tbTypeLabel[plan.test]}</b> около <b>{fmtDate(plan.next)}</b>
      {soon ? ` (через ${plan.daysLeft} ${daysWord(plan.daysLeft)}).` : "."}
    </Banner>
  );
}

const bannerTones = {
  blue: "bg-blue-50 border-blue-200 text-blue-800 [&_svg]:text-blue-500",
  slate: "bg-muted border-border text-foreground [&_svg]:text-muted-foreground",
  red: "bg-red-50 border-red-200 text-red-800 [&_svg]:text-red-500",
  amber: "bg-amber-50 border-amber-200 text-amber-800 [&_svg]:text-amber-500",
  green: "bg-emerald-50 border-emerald-200 text-emerald-800 [&_svg]:text-emerald-500",
};

function Banner({
  tone,
  icon,
  children,
}: {
  tone: keyof typeof bannerTones;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border rounded-xl p-3 flex items-start gap-2.5 ${bannerTones[tone]}`}>
      <Icon name={icon} size={17} className="flex-shrink-0 mt-0.5" />
      <p className="text-xs leading-relaxed">{children}</p>
    </div>
  );
}

function Toggle({ on, onClick, title, hint }: { on: boolean; onClick: () => void; title: string; hint: string }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center gap-2.5 text-left">
      <span
        className={`w-10 rounded-full flex-shrink-0 relative transition-colors ${on ? "bg-primary" : "bg-muted-foreground/30"}`}
        style={{ height: "22px" }}
      >
        <span
          className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-[20px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-[11px] text-foreground leading-snug flex-1">
        {title} <span className="text-muted-foreground">— {hint}</span>
      </span>
    </button>
  );
}

export function TbTracker() {
  const profile = useChildProfile();
  const [editing, setEditing] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const records = sortedRecords(profile);
  const plan = calcTbPlan(profile);

  const save = (list: TbRecord[]) => saveChildProfile({ ...profile, tbTests: list });

  const upsert = (r: TbRecord) => {
    const list = records.filter((x) => x.id !== r.id);
    save([...list, r]);
    setEditing(null);
  };

  const remove = (id: string) => {
    records.find((x) => x.id === id)?.photos?.forEach((p) => deletePhoto(p.url));
    save(records.filter((x) => x.id !== id));
    setEditing(null);
  };

  const suggestedType: TbTestType =
    plan.kind === "due" || plan.kind === "planned" ? plan.test : records[0]?.type ?? "mantu";

  const newRecord: TbRecord = {
    id: `tb-${Date.now()}`,
    date: todayIso(),
    type: suggestedType,
    result: "negative",
  };

  const visible = showAll ? records : records.slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-2xl p-3.5 mb-3 space-y-3">
      <div className="flex items-center gap-2">
        <Icon name="ClipboardList" size={16} className="text-primary" />
        <p className="font-bold text-sm text-foreground flex-1">
          {profile.name ? `Пробы: ${profile.name}` : "Пробы ребёнка"}
        </p>
      </div>

      <PlanBanner plan={plan} />

      <div className="space-y-2.5">
        <Toggle
          on={profile.noBcg === true}
          onClick={() => saveChildProfile({ ...profile, noBcg: !profile.noBcg })}
          title="Ребёнок без прививки БЦЖ"
          hint="Манту 2 раза в год до 8 лет"
        />
        <Toggle
          on={profile.tbRisk === true}
          onClick={() => saveChildProfile({ ...profile, tbRisk: !profile.tbRisk })}
          title="Группа риска по туберкулёзу"
          hint="Диаскинтест 2 раза в год с 8 лет"
        />
        {profile.tbRisk && (
          <p className="text-[11px] text-muted-foreground leading-snug pl-[50px]">
            Сахарный диабет, язвенная болезнь, хронические гнойно-воспалительные болезни лёгких и почек, ВИЧ-инфекция,
            длительный приём цитостатиков, кортикостероидов, ГИБП и др.
          </p>
        )}
      </div>

      {editing === "new" ? (
        <RecordForm
          initial={newRecord}
          minDate={profile.birthDate || undefined}
          onSave={upsert}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 bg-card px-3 py-2.5 text-[13px] font-semibold text-primary active:scale-[0.99] transition-transform"
        >
          <Icon name="Plus" size={16} />
          {records.length ? "Записать новую пробу" : "Записать последнюю пробу"}
        </button>
      )}

      {records.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">История</p>
          {visible.map((r) =>
            editing === r.id ? (
              <RecordForm
                key={r.id}
                initial={r}
                minDate={profile.birthDate || undefined}
                onSave={upsert}
                onCancel={() => setEditing(null)}
                onDelete={() => remove(r.id)}
              />
            ) : (
              <button
                key={r.id}
                type="button"
                onClick={() => setEditing(r.id)}
                className="w-full flex items-center gap-2.5 bg-muted/50 rounded-xl px-3 py-2 text-left active:scale-[0.99] transition-transform"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground leading-tight">
                    {tbTypeLabel[r.type]} <span className="text-muted-foreground font-normal">· {fmtDate(r.date)}</span>
                  </p>
                  {r.size && <p className="text-[11px] text-muted-foreground mt-0.5">Уплотнение {r.size} мм</p>}
                  {r.photos && r.photos.length > 0 && <TbPhotoThumbs photos={r.photos} />}
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${tbResultMeta[r.result].chip}`}>
                  {tbResultMeta[r.result].label}
                </span>
                <Icon name="Pencil" size={13} className="text-muted-foreground flex-shrink-0" />
              </button>
            )
          )}
          {records.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="w-full text-[12px] font-semibold text-primary py-1"
            >
              {showAll ? "Свернуть" : `Показать все (${records.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TbTracker;
