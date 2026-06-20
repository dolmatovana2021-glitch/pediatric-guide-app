import Icon from "@/components/ui/icon";
import { SectionWrapper, SectionTitle } from "@/components/shared/SectionLayout";

export function DocsSection() {
  return (
    <SectionWrapper>
      <SectionTitle
        emoji="📄"
        title="Медицинская документация"
        subtitle="Важные документы и справки о здоровье ребёнка"
      />

      <div className="bg-white border border-dashed border-border rounded-2xl p-8 text-center">
        <Icon name="FileText" size={28} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-[13px] text-muted-foreground">
          Документы скоро появятся здесь
        </p>
      </div>
    </SectionWrapper>
  );
}

export default DocsSection;
