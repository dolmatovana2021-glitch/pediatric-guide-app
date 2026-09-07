import Icon from "@/components/ui/icon";
import {
  calcAge,
  type ChildProfile,
  type Measurement,
} from "@/components/shared/childProfile";
import {
  buildGrowthRows,
  buildDoneVaccines,
  buildTeeth,
  buildSleepStats,
  buildFeedStats,
} from "./MedicalReport.data";
import { MedicalReportHeader, MedicalReportIllness } from "./MedicalReport.Info";
import { MedicalReportGrowth } from "./MedicalReport.Growth";
import { MedicalReportDailyCare } from "./MedicalReport.DailyCare";

type Props = {
  profile: ChildProfile;
  measurements: Measurement[];
};

export function MedicalReport({ profile, measurements }: Props) {
  const age = calcAge(profile.birthDate);

  const rows = buildGrowthRows(profile, measurements);
  const lastRow = rows.length ? rows[rows.length - 1] : null;

  const doneVaccines = buildDoneVaccines();

  const ageMonthsNow = age ? age.years * 12 + age.months : null;
  const { eruptedTeeth, lateTeeth } = buildTeeth(profile, ageMonthsNow);

  const sleep = buildSleepStats(profile, ageMonthsNow);
  const { feedsRecent, feedsAvgCount } = buildFeedStats(profile);

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
        <MedicalReportHeader profile={profile} age={age} />

        <MedicalReportGrowth rows={rows} lastRow={lastRow} doneVaccines={doneVaccines} />

        <MedicalReportDailyCare
          eruptedTeeth={eruptedTeeth}
          lateTeeth={lateTeeth}
          sleep={sleep}
          feedsRecent={feedsRecent}
          feedsAvgCount={feedsAvgCount}
        />

        <MedicalReportIllness illness={illness} />
      </div>
    </>
  );
}

export default MedicalReport;
