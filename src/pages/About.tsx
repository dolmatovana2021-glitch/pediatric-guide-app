import Icon from "@/components/ui/icon";
import { AboutAppCard } from "@/components/shared/AboutAppCard";
import { SubPageLayout } from "@/components/shared/SubPageLayout";

const About = () => (
  <SubPageLayout title="О проекте">
    <div className="mt-4 bg-card border border-border rounded-3xl p-4 shadow-sm flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-mint-50 border border-mint-200 flex items-center justify-center flex-shrink-0">
        <Icon name="Rocket" size={20} className="text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground leading-tight">Дата запуска</p>
        <p className="text-sm font-semibold text-foreground mt-0.5">Проект запущен в 2026 году</p>
      </div>
    </div>

    <div className="mt-4 bg-card border border-border rounded-3xl p-4 shadow-sm">
      <p className="font-semibold text-foreground text-sm mb-2">Как появился МалышДок</p>
      <p className="text-[13px] text-foreground leading-relaxed">
        Когда ребёнок заболевает, родителям нужно быстро понять, что делать, а нужные сведения разбросаны по
        разным источникам и не всегда надёжны. МалышДок появился, чтобы собрать проверенную справочную
        информацию о здоровье ребёнка в одном понятном приложении.
      </p>
      <p className="font-semibold text-foreground text-sm mt-4 mb-2">Цели проекта</p>
      <ul className="space-y-2">
        {[
          "Помочь родителям действовать спокойно и уверенно в трудной ситуации",
          "Подсказать, когда нужно срочно обратиться к врачу",
          "Не упускать прививки, плановые осмотры и сроки лекарств",
          "Сделать разговор с педиатром точнее благодаря дневнику болезни",
        ].map((g) => (
          <li key={g} className="flex items-start gap-2 text-[12px] text-foreground leading-snug">
            <Icon name="Target" size={14} className="text-primary flex-shrink-0 mt-0.5" />
            <span>{g}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="-mt-4">
      <AboutAppCard />
    </div>
  </SubPageLayout>
);

export default About;
