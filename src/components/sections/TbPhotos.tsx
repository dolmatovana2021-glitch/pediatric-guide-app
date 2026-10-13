import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import { uploadPhoto, usePhotoSrc } from "@/components/shared/photoUpload";
import type { TbPhoto, TbPhotoKind } from "@/components/shared/tbStatus";

const MAX_PHOTOS = 4;

export const photoKindLabel: Record<TbPhotoKind, string> = {
  site: "Место укола",
  doc: "Справка",
};

function PhotoImg({ photoRef, alt, className }: { photoRef: string; alt: string; className: string }) {
  const { src, status } = usePhotoSrc(photoRef);
  if (src) return <img src={src} alt={alt} className={className} />;
  const icon = status === "loading" ? "Loader2" : status === "locked" ? "Lock" : "ImageOff";
  return (
    <span className={`${className} flex items-center justify-center bg-muted text-muted-foreground`} title={status === "locked" ? "Войдите в аккаунт, чтобы увидеть фото" : undefined}>
      <Icon name={icon} size={16} className={status === "loading" ? "animate-spin" : ""} />
    </span>
  );
}

function ViewerImage({ photo }: { photo: TbPhoto }) {
  const { src, status } = usePhotoSrc(photo.url);
  if (src) return <img src={src} alt={photoKindLabel[photo.kind]} className="max-w-full max-h-[85vh] rounded-xl object-contain" />;
  return (
    <div className="text-white/80 text-sm flex flex-col items-center gap-2 text-center px-6">
      <Icon name={status === "loading" ? "Loader2" : "Lock"} size={32} className={status === "loading" ? "animate-spin" : ""} />
      {status === "loading" ? "Загружаю фото…" : status === "locked" ? "Фото доступно только после входа в аккаунт родителя" : "Фото не найдено"}
    </div>
  );
}

export function PhotoViewer({ photo, onClose }: { photo: TbPhoto; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center"
      >
        <Icon name="X" size={22} />
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        <ViewerImage photo={photo} />
      </div>
      <p className="text-white/80 text-sm mt-3">{photoKindLabel[photo.kind]}</p>
    </div>
  );
}

export function TbPhotoThumbs({ photos }: { photos: TbPhoto[] }) {
  const [open, setOpen] = useState<TbPhoto | null>(null);
  if (!photos.length) return null;
  return (
    <>
      <div className="flex gap-1.5 mt-1.5">
        {photos.map((p) => (
          <span
            key={p.url}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(p);
            }}
            className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0"
          >
            <PhotoImg photoRef={p.url} alt={photoKindLabel[p.kind]} className="w-full h-full object-cover" />
          </span>
        ))}
      </div>
      {open && <PhotoViewer photo={open} onClose={() => setOpen(null)} />}
    </>
  );
}

export function TbPhotoPicker({
  photos,
  onChange,
}: {
  photos: TbPhoto[];
  onChange: (p: TbPhoto[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const kindRef = useRef<TbPhotoKind>("site");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<TbPhoto | null>(null);

  const pick = (kind: TbPhotoKind) => {
    kindRef.current = kind;
    setError("");
    inputRef.current?.click();
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Можно прикрепить только фото");
      return;
    }
    setBusy(true);
    try {
      const url = await uploadPhoto(file);
      onChange([...photos, { url, kind: kindRef.current }]);
    } catch {
      setError("Не удалось загрузить фото. Попробуйте ещё раз");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const canAdd = photos.length < MAX_PHOTOS && !busy;

  return (
    <div>
      <p className="text-[11px] font-bold text-muted-foreground mb-1.5">Фото (необязательно)</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {photos.map((p) => (
            <div key={p.url} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted">
              <button type="button" onClick={() => setOpen(p)} className="w-full h-full">
                <PhotoImg photoRef={p.url} alt={photoKindLabel[p.kind]} className="w-full h-full object-cover" />
              </button>
              <span className="absolute left-0 right-0 bottom-0 bg-black/55 text-white text-[9px] font-semibold text-center py-0.5 pointer-events-none">
                {photoKindLabel[p.kind]}
              </span>
              <button
                type="button"
                aria-label="Убрать фото"
                onClick={() => onChange(photos.filter((x) => x.url !== p.url))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {busy ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-[12px] text-muted-foreground">
          <Icon name="Loader2" size={15} className="animate-spin" />
          Загружаю фото…
        </div>
      ) : canAdd ? (
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => pick("site")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/50 bg-card py-2.5 text-[12px] font-semibold text-primary"
          >
            <Icon name="Camera" size={15} />
            Место укола
          </button>
          <button
            type="button"
            onClick={() => pick("doc")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/50 bg-card py-2.5 text-[12px] font-semibold text-primary"
          >
            <Icon name="FileImage" size={15} />
            Справка
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground">Можно прикрепить до {MAX_PHOTOS} фото</p>
      )}

      {error && <p className="text-[11px] text-red-600 mt-1.5">{error}</p>}
      {open && <PhotoViewer photo={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
