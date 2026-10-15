import { Link } from "react-router-dom";

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
      </div>
      <p>© 2026 МалышДок</p>
    </footer>
  );
}

export default SiteFooter;