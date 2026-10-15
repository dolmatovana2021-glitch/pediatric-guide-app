import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SiteFooter } from "@/components/shared/SiteFooter";

export function SubPageLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
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
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {children}
          <SiteFooter />
        </main>
      </div>
    </div>
  );
}

export default SubPageLayout;
