import { type ChildProfile, type IllnessEntry } from "@/components/shared/childProfile";
import { fmtDate } from "./MedicalReport.data";

type HeaderProps = {
  profile: ChildProfile;
  age: { years: number; months: number } | null;
};

export function MedicalReportHeader({ profile, age }: HeaderProps) {
  return (
    <>
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
    </>
  );
}

type IllnessProps = {
  illness: IllnessEntry[];
};

export function MedicalReportIllness({ illness }: IllnessProps) {
  return (
    <>
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
    </>
  );
}

export default MedicalReportHeader;
