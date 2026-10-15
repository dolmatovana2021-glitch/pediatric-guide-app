import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="mt-10 text-center text-xs text-muted-foreground space-y-1">
      <div className="flex justify-center gap-4">
        <Link to="/about" className="text-primary font-semibold underline underline-offset-2">
          О проекте
        </Link>
        <Link to="/privacy" className="text-primary font-semibold underline underline-offset-2">
          Конфиденциальность
        </Link>
      </div>
      <p>© 2026 МалышДок</p>
    </footer>
  );
}

export default SiteFooter;
