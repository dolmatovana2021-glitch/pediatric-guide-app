import { Link } from "react-router-dom";
import { SITE_OWNER } from "./siteOwner";

export function SiteFooter() {
  return (
    <footer className="mt-10 text-center text-xs text-muted-foreground space-y-1">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        <Link to="/about" className="text-primary font-semibold underline underline-offset-2">
          О проекте
        </Link>
        <Link to="/privacy" className="text-primary font-semibold underline underline-offset-2">
          Конфиденциальность
        </Link>
        <Link to="/terms" className="text-primary font-semibold underline underline-offset-2">
          Соглашение
        </Link>
        <Link to="/doctors" className="text-primary font-semibold underline underline-offset-2">
          Для врачей
        </Link>
      </div>
      <p>
        Владелец сайта: {SITE_OWNER.name}
        {SITE_OWNER.email && (
          <>
            {", "}
            <a href={`mailto:${SITE_OWNER.email}`} className="text-primary font-semibold underline underline-offset-2">
              {SITE_OWNER.email}
            </a>
          </>
        )}
      </p>
      <p>© 2026 МалышДок</p>
    </footer>
  );
}

export default SiteFooter;