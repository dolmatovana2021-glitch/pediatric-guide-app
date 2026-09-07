import { percentileVerdict, bmiVerdict } from "@/components/shared/whoGrowthData";
import { fmtDate, pct, type GrowthRow } from "./MedicalReport.data";

type Props = {
  rows: GrowthRow[];
  lastRow: GrowthRow | null;
  doneVaccines: string[];
};

export function MedicalReportGrowth({ rows, lastRow, doneVaccines }: Props) {
  return (
    <>
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
    </>
  );
}

export default MedicalReportGrowth;
