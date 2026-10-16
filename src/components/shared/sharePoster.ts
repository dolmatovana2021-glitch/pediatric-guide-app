export const SITE_URL = "https://tvoymalyshdok.ru/";
export const SITE_HOST = "tvoymalyshdok.ru";

const buildPoster = (svg: string, origin: string) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>МалышДок — QR-код</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Golos Text", Arial, sans-serif; color: #1e293b; text-align: center; }
  .wrap { max-width: 170mm; margin: 0 auto; padding-top: 6mm; }
  .bear { width: 46mm; height: auto; }
  h1 { font-size: 34pt; margin: 2mm 0 0; color: #2e806d; }
  .sub { font-size: 15pt; margin: 3mm 0 8mm; }
  .qr { display: inline-block; padding: 6mm; border: 0.6mm solid #2e806d; border-radius: 6mm; }
  .qr svg { width: 95mm; height: 95mm; display: block; }
  .hint { font-size: 14pt; font-weight: 600; margin: 7mm 0 2mm; }
  .url { font-size: 13pt; color: #2e806d; font-weight: 600; }
  ul { list-style: none; padding: 0; margin: 8mm 0 0; font-size: 12pt; line-height: 1.7; }
  .note { margin-top: 8mm; font-size: 10pt; color: #64748b; }
</style></head>
<body><div class="wrap">
  <img class="bear" src="${origin}/bear/doctor-clean.png" alt="">
  <h1>МалышДок</h1>
  <p class="sub">Бесплатный помощник для родителей</p>
  <div class="qr">${svg}</div>
  <p class="hint">Наведите камеру телефона на QR-код</p>
  <p class="url">${SITE_HOST}</p>
  <ul>
    <li>Первая помощь и экстренные ситуации</li>
    <li>Календарь прививок и плановых осмотров</li>
    <li>Болезни, развитие и питание малыша</li>
    <li>Работает даже без интернета</li>
  </ul>
  <p class="note">Справочное приложение. Не заменяет консультацию врача.</p>
</div>
<script>
  window.onload = function () {
    var img = document.querySelector('.bear');
    var go = function () { setTimeout(function () { window.print(); }, 150); };
    if (img && !img.complete) { img.onload = go; img.onerror = go; } else { go(); }
  };
</script>
</body></html>`;

export function printPoster(container: HTMLElement | null) {
  const svg = container?.querySelector("svg")?.outerHTML;
  if (!svg) return;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.open();
  w.document.write(buildPoster(svg, window.location.origin));
  w.document.close();
}
