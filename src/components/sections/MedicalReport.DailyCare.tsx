import {
  rangeLabel,
  TOTAL_TEETH,
  TOTAL_PERMANENT_TEETH,
  type Tooth,
} from "@/components/shared/teethData";
import { formatHours } from "@/components/shared/sleepData";
import {
  fmtDate,
  type EruptedTooth,
  type FeedDay,
  type SleepStats,
} from "./MedicalReport.data";

type Props = {
  eruptedTeeth: EruptedTooth[];
  lateTeeth: Tooth[];
  sleep: SleepStats;
  feedsRecent: FeedDay[];
  feedsAvgCount: number | null;
};

export function MedicalReportDailyCare({
  eruptedTeeth,
  lateTeeth,
  sleep,
  feedsRecent,
  feedsAvgCount,
}: Props) {
  const { sleepNorm, sleepByDay, sleepAvg, sleepNightAvg, sleepNapsAvg, sleepV } = sleep;

  return (
    <>
      {(eruptedTeeth.length > 0 || lateTeeth.length > 0) && (
        <>
          <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
            Зубная формула (молочных{" "}
            {eruptedTeeth.filter((e) => e.tooth.kind === "primary").length} из {TOTAL_TEETH}
            {eruptedTeeth.some((e) => e.tooth.kind === "permanent")
              ? `, постоянных ${eruptedTeeth.filter((e) => e.tooth.kind === "permanent").length} из ${TOTAL_PERMANENT_TEETH}`
              : ""}
            )
          </h2>

          {eruptedTeeth.length > 0 && (
            <table
              style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}
            >
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "left" }}>Зуб</th>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "left" }}>Расположение</th>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Дата</th>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Норма</th>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "left" }}>Возраст / оценка</th>
                  <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Выпал</th>
                </tr>
              </thead>
              <tbody>
                {eruptedTeeth.map(({ tooth, date, verdictText, lostAt }) => (
                  <tr key={tooth.id}>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                      {tooth.group}
                      {tooth.kind === "permanent" ? " (пост.)" : ""}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                      {tooth.jaw === "upper" ? "верхняя" : "нижняя"},{" "}
                      {tooth.side === "left" ? "слева" : "справа"}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                      {fmtDate(date)}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                      {rangeLabel(tooth)}
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>{verdictText}</td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                      {lostAt ? fmtDate(lostAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p style={{ fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
            {lateTeeth.length > 0 ? (
              <>
                Задерживается прорезывание более чем на 6 месяцев от верхней границы нормы:{" "}
                {lateTeeth.length} шт. (
                {lateTeeth
                  .map(
                    (t) =>
                      `${t.shortName} ${t.jaw === "upper" ? "верх" : "низ"} ${t.side === "left" ? "слева" : "справа"}`,
                  )
                  .join(", ")}
                ).
              </>
            ) : (
              <>Сроки прорезывания соответствуют возрастным нормам.</>
            )}
          </p>
        </>
      )}

      {sleepAvg !== null && (
        <>
          <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Сон</h2>
          <table
            style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 6 }}
          >
            <tbody>
              <tr>
                <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                  Средний суточный сон за 7 дней
                </td>
                <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", fontWeight: 600 }}>
                  {formatHours(sleepAvg)}
                </td>
              </tr>
              {sleepNightAvg !== null && (
                <tr>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                    Из них ночной сон
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", fontWeight: 600 }}>
                    {formatHours(sleepNightAvg)}
                  </td>
                </tr>
              )}
              {sleepNapsAvg !== null && (
                <tr>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                    Дневных снов в сутки (в среднем)
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", fontWeight: 600 }}>
                    {sleepNapsAvg.toFixed(1)}
                  </td>
                </tr>
              )}
              {sleepNorm && (
                <>
                  <tr>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                      Возрастная норма ({sleepNorm.label})
                    </td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", fontWeight: 600 }}>
                      {sleepNorm.minHours}–{sleepNorm.maxHours} ч, {sleepNorm.naps}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Оценка</td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", fontWeight: 600 }}>
                      {sleepV === "ok"
                        ? "в пределах возрастной нормы"
                        : sleepV === "low"
                          ? "меньше возрастной нормы"
                          : "больше возрастной нормы"}
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                  Дней с записями
                </td>
                <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", fontWeight: 600 }}>
                  {sleepByDay.length}
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: 10, color: "#64748b", marginBottom: 16 }}>
            Нормы по рекомендациям Американской академии медицины сна.
          </p>
        </>
      )}

      {feedsRecent.length > 0 && (
        <>
          <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
            Кормления по дням
            {feedsAvgCount !== null
              ? ` (в среднем ${feedsAvgCount.toFixed(1)} в сутки)`
              : ""}
          </h2>
          <table
            style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 16 }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "left" }}>Дата</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Всего</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Грудь</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Смесь</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Прикорм</th>
                <th style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>Объём, мл</th>
              </tr>
            </thead>
            <tbody>
              {feedsRecent.map((d) => (
                <tr key={d.key}>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px" }}>
                    {fmtDate(d.key)}
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center", fontWeight: 600 }}>
                    {d.count}
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                    {d.breast || "—"}
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                    {d.formula || "—"}
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                    {d.solid || "—"}
                  </td>
                  <td style={{ border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center" }}>
                    {d.volume || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default MedicalReportDailyCare;