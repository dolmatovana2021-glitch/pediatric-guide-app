import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AboutAppCard } from "@/components/shared/AboutAppCard";

const About = () => (
  <div className="min-h-screen bg-background font-golos">
    <div className="max-w-[480px] mx-auto flex flex-col min-h-screen">
      <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-md px-4 py-2.5 flex items-center gap-3">
        <Link
          to="/"
          aria-label="На главную"
          className="h-10 pl-2.5 pr-3.5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-1.5 text-[13px] font-semibold text-foreground active:scale-95 transition-transform"
        >
          <Icon name="ChevronLeft" size={18} />
          Главная
        </Link>
        <span className="ml-auto">
          <ThemeToggle />
        </span>
      </div>

      <main className="flex-1 px-4 pt-2 pb-10">
        <h1 className="text-2xl font-bold text-foreground">О проекте</h1>

        <div className="mt-4 bg-card border border-border rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
            <Icon name="Rocket" size={20} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-tight">Дата запуска</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">Проект запущен в 2026 году</p>
          </div>
        </div>

        <div className="-mt-4">
          <AboutAppCard />
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">© 2026 МалышДок</footer>
      </main>
    </div>
  </div>
);

export default About;
