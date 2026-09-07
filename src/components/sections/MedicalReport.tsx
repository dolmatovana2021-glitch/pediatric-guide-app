import Icon from "@/components/ui/icon";
import {
  calcAge,
  ageInMonthsAt,
  type ChildProfile,
  type Measurement,
} from "@/components/shared/childProfile";
import {
  estimatePercentile,
  percentileVerdict,
  bmiVerdict,
  calcBmi,
  MAX_AGE_MONTHS,
} from "@/components/shared/whoGrowthData";
import { getStatuses } from "@/components/shared/vaccineStatus";
import { vaccineRows } from "@/components/shared/vaccineData";

type Props = {
  profile: ChildProfile;
  measurements: Measurement[];
};

function fmtDate(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("ru-RU");
}

function pct(v: number | null): string {
  if (v === null) return "—";
  if (v < 3) return "<3";
  if (v > 97) return ">97";
  return String(Math.round(v));
}

export function MedicalReport({ profile, measurements }: Props) {
  const gender = profile.gender === "girl" ? "girl" : "boy";
  const age = calcAge(profile.birthDate);

  const rows = [...measurements]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => {
      const months = profile.birthDate ? ageInMonthsAt(profile.birthDate, m.date) : null;
      const inRange = months !== null && months <= MAX_AGE_MONTHS;
      const bmi = m.height !== null && m.weight !== null ? calcBmi(m.height, m.weight) : null;
      return {
        date: m.date,
        months,
        height: m.height,
        weight: m.weight,
        bmi,
        hp: inRange && m.height !== null ? estimatePercentile("height", gender, months!, m.height) : null,
        wp: inRange && m.weight !== null ? estimatePercentile("weight", gender, months!, m.weight) : null,
        bp: inRange && bmi !== null ? estimatePercentile("bmi", gender, months!, bmi) : null,
      };
    });

  const lastRow = rows.length ? rows[rows.length - 1] : null;

  const vacStatuses = getStatuses();
  const doneVaccines: string[] = [];
  for (const row of vaccineRows) {
    for (const dose of row.doses) {
      if (vacStatuses[dose.id] === "done") {
        doneVaccines.push(`${row.disease} — ${dose.label}`);
      }
    }
  }

  const illness = [...(profile.illness ?? [])].sort((a, b) =>
    b.datetime.localeCompare(a.datetime),
  );

  return (
    <>
      <button
        onClick={() => window.print()}
        className="w-full bg-white border border-border text-foreground rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mt-3 shadow-sm active:scale-95 transition-transform print:hidden"
      >
        <Icon name="Printer" size={16} className="text-primary" />
        Выгрузить отчёт для врача
      </button>
      <p className="text-[10px] text-muted-foreground text-center mt-1.5 px-3 print:hidden">
        Откроется окно печати — выберите «Сохранить как PDF» или распечатайте
      </p>

      <div id="medical-report" className="hidden print:block text-black">
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          Медицинская карта ребёнка
        </h1>
        <p style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>
          Сформировано {new Date().toLocaleDateString("ru-RU")} · данные внесены родителем
        </p>

        <table style={{ fontSize: 12, marginBottom: 16, borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: 12, color: "#555" }}>Имя</td>
              <td style={{ fontWeight: 600 }}>{profile.name || "—"}</td>
            </tr>
            <tr>
              <td style={{ paddingRight: 12, color: "#555" }}>Дата рождения</td>
              <td style={{ fontWeight: 600 }}>
                {profile.birthDate ? fmtDate(profile.birthDate) : "—"}
                {age ? ` (${age.years} г. ${age.months} мес.)` : ""}
              </td>
            </tr>
            <tr>
              <td style={{ paddingRight: 12, color: "#555" }}>Пол</td>
              <td style={{ fontWeight: 600 }}>
                {profile.gender === "girl" ? "девочка" : profile.gender === "boy" ? "мальчик" : "—"}
              </td>
            </tr>
            <tr>
              <td style={{ paddingRight: 12, color: "#555" }}>Аллергии</td>
              <td style={{ fontWeight: 600 }}>{profile.allergies || "не указаны"}</td>
            </tr>
            <tr>
              <td style={{ paddingRight: 12, color: "#555" }}>Группа риска</td>
              <td style={{ fontWeight: 600 }}>{profile.riskGroup ? "да" : "нет"}</td>
            </tr>
          </tbody>
        </table>

        {lastRow && (
          <>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
              Оценка физического развития (нормы ВОЗ)
            </h2>
            <p style={{ fontSize: 12, marginBottom: 14, lineHeight: 1.6 }}>
              На {fmtDate(lastRow.date)}
              {lastRow.months !== null ? `, возраст ${Math.round(lastRow.months)} мес.` : ""}:
              {lastRow.height !== null && (
                <> рост {lastRow.height} см ({pct(lastRow.hp)} центиль — {percentileVerdict(lastRow.hp).label});</>
              )}
              {lastRow.weight !== null && (
                <> вес {lastRow.weight} кг ({pct(lastRow.wp)} центиль — {percentileVerdict(lastRow.wp).label});</>
              )}
              {lastRow.bmi !== null && (
                <> ИМТ {lastRow.bmi.toFixed(1)} ({pct(lastRow.bp)} центиль — {bmiVerdict(lastRow.bp).label}).</>
              )}
            </p>
          </>
        )}

        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
          История замеров ({rows.length})
        </h2>
        {rows.length === 0 ? (
          <p style={{ fontSize: 12, marginBottom: 16 }}>Замеров нет.</p>
        ) : (
          <table
            style={{
              width: "100%",
              fontSize: 11,
              borderCollapse: "collapse",
              marginBottom: 16,
            }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "left" }}>Дата</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Возраст</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Рост</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Ц.</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Вес</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Ц.</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>ИМТ</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Ц.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>{fmtDate(r.date)}</td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                    {r.months !== null ? `${Math.round(r.months)} мес` : "—"}
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                    {r.height ?? "—"}
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>{pct(r.hp)}</td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                    {r.weight ?? "—"}
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>{pct(r.wp)}</td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                    {r.bmi !== null ? r.bmi.toFixed(1) : "—"}
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>{pct(r.bp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
          Сделанные прививки ({doneVaccines.length})
        </h2>
        {doneVaccines.length === 0 ? (
          <p style={{ fontSize: 12, marginBottom: 16 }}>Отметок о прививках нет.</p>
        ) : (
          <ul style={{ fontSize: 11, marginBottom: 16, paddingLeft: 16, lineHeight: 1.7 }}>
            {doneVaccines.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        )}

        {illness.length > 0 && (
          <>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
              Дневник болезни ({illness.length})
            </h2>
            <table
              style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 16 }}
            >
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "left" }}>Дата и время</th>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>t °C</th>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "left" }}>Симптомы</th>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "left" }}>Лекарства</th>
                </tr>
              </thead>
              <tbody>
                {illness.map((e) => (
                  <tr key={e.id}>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                      {new Date(e.datetime).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                      {e.temperature !== null ? e.temperature.toFixed(1) : "—"}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                      {e.symptoms.length ? e.symptoms.join(", ") : "—"}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                      {e.medication || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <p style={{ fontSize: 10, color: "#666", marginTop: 20, lineHeight: 1.5 }}>
          Отчёт сформирован приложением на основе данных, внесённых родителем. Центильные
          оценки рассчитаны по нормам ВОЗ и носят справочный характер. Документ не является
          медицинским заключением и не заменяет осмотр врача.
        </p>
      </div>
    </>
  );
}

export default MedicalReport;