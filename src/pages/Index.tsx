import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Section, navItems } from "@/components/shared/SectionShared";
import { HomeSection, FirstAidSection, EmergencySection } from "@/components/sections/AidSections";
import { DiseasesSection, FaqSection, ContactsSection } from "@/components/sections/InfoSections";

export default function Index() {
  const [section, setSection] = useState<Section>("home");

  const renderSection = () => {
    switch (section) {
      case "home": return <HomeSection setSection={setSection} />;
      case "firstaid": return <FirstAidSection />;
      case "emergency": return <EmergencySection />;
      case "diseases": return <DiseasesSection />;
      case "faq": return <FaqSection />;
      case "contacts": return <ContactsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-golos">
      <div className="max-w-[480px] mx-auto flex flex-col min-h-screen relative">

        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
          {section !== "home" ? (
            <>
              <button
                onClick={() => setSection("home")}
                className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"
              >
                <Icon name="ArrowLeft" size={18} className="text-foreground" />
              </button>
              <span className="font-semibold text-foreground">
                {navItems.find(n => n.id === section)?.emoji}{" "}
                {navItems.find(n => n.id === section)?.label}
              </span>
            </>
          ) : (
            <>
              <span className="font-caveat text-primary font-bold text-xl">МалышДок</span>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">v1.0</span>
            </>
          )}
        </div>

        <main className="flex-1 px-4 py-4 pb-24">
          {renderSection()}
        </main>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur-md border-t border-border px-1 py-2 z-30">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-xl transition-all ${
                  section === item.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className={`text-lg transition-transform ${section === item.id ? "scale-110" : ""}`}>
                  {item.emoji}
                </span>
                <span className={`text-[9px] font-semibold leading-none ${section === item.id ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
