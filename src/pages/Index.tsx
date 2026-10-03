import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { Section } from "@/components/shared/SectionShared";
import { HomeSection, FirstAidSection, EmergencySection, RedFlagsSection, VaccinationSection } from "@/components/sections/AidSections";
import { ContactsSection } from "@/components/sections/InfoSections";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { CheckupSection } from "@/components/sections/CheckupSection";
import { RashSection } from "@/components/sections/RashSection";
import { UsefulSection } from "@/components/sections/UsefulSection";
import { DocsSection } from "@/components/sections/DocsSection";
import { DevelopmentSection } from "@/components/sections/DevelopmentSection";
import { IllnessDiarySection } from "@/components/sections/IllnessDiarySection";
import { TeethSection } from "@/components/sections/TeethSection";
import { MedkitSection } from "@/components/sections/MedkitSection";
import { SleepSection } from "@/components/sections/SleepSection";
import { FeedingLogSection } from "@/components/sections/FeedingLogSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { BottomNav } from "@/components/shared/BottomNav";
import { LoginScreen } from "@/components/sections/LoginScreen";
import { useDueCheckup } from "@/components/shared/checkupStatus";
import { useDueVaccines } from "@/components/shared/vaccineStatus";
import { useSectionVisibility, isSectionVisible } from "@/components/shared/sectionVisibility";
import { useAuth } from "@/components/shared/auth";
import { useChildrenSync } from "@/components/shared/childrenSync";

export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const dueCheckup = useDueCheckup();
  const dueVaccines = useDueVaccines();
  const visibility = useSectionVisibility();
  const { user, loading: authLoading } = useAuth();
  useChildrenSync(Boolean(user));

  const activeSection: Section = isSectionVisible(section, visibility) ? section : "home";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeSection]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={28} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "home": return <HomeSection setSection={setSection} />;
      case "firstaid": return <FirstAidSection />;
      case "emergency": return <EmergencySection />;
      case "redflags": return <RedFlagsSection />;
      case "rash": return <RashSection />;
      case "illness": return <IllnessDiarySection />;
      case "teeth": return <TeethSection />;
      case "medkit": return <MedkitSection />;
      case "sleep": return <SleepSection />;
      case "feedlog": return <FeedingLogSection />;
      case "development": return <DevelopmentSection />;
      case "vaccination": return <VaccinationSection />;
      case "checkup": return <CheckupSection />;
      case "contacts": return <ContactsSection />;
      case "useful": return <UsefulSection />;
      case "docs": return <DocsSection />;
      case "settings": return <SettingsSection />;
      case "profile": return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-golos">
      <div className="max-w-[480px] mx-auto flex flex-col min-h-screen relative">

        <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-md px-4 py-2.5 flex items-center gap-3">
          {activeSection !== "home" ? (
            <>
              <button
                onClick={() => setSection("home")}
                aria-label="На главную"
                className="h-10 pl-2.5 pr-3.5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-1.5 text-[13px] font-semibold text-foreground active:scale-95 transition-transform"
              >
                <Icon name="ChevronLeft" size={18} />
                Главная
              </button>
              <span className="ml-auto">
                <ThemeToggle />
              </span>
            </>
          ) : (
            <>
              <span className="font-caveat text-primary font-bold text-2xl leading-none">МалышДок</span>
              <span className="ml-auto">
                <ThemeToggle />
              </span>
            </>
          )}
        </div>

        <main className="flex-1 px-4 pt-2 pb-32">
          {renderSection()}
        </main>

        <BottomNav
          section={activeSection}
          setSection={setSection}
          badges={{ checkup: Boolean(dueCheckup), vaccination: dueVaccines > 0 }}
        />
      </div>
    </div>
  );
}