/**
 * HTML renderers for the biodata document. The SAME HTML powers both the
 * on-screen preview (rendered in a WebView from a local string — this is
 * on-device content, never a remote page) and the exported PDF (expo-print).
 * Keeping one source guarantees the preview matches the printed document.
 */
import {renderedSections, displayName, type Biodata} from '../data/biodata';

const COLORS = {
  canvas: '#faf6f2',
  ink: '#2a2025',
  muted: '#7c7077',
  line: '#ece3da',
  maroon: '#9b1c3a',
  gold: '#c79a3a',
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function photoTag(data: Biodata, css: string): string {
  if (!data.photo) {
    return '';
  }
  return `<img src="${esc(data.photo)}" alt="${esc(displayName(data))}" style="${css}" />`;
}

// ── Traditional ──────────────────────────────────────────────────────────────
function traditional(data: Biodata): string {
  const sections = renderedSections(data);
  const header = data.header
    ? `<p style="text-align:center;font-family:Georgia,serif;font-size:15px;letter-spacing:.5px;color:${COLORS.gold};margin:0 0 4px">
         <span style="color:${COLORS.gold}">&#10049;</span>
         <span style="color:${COLORS.maroon}">${esc(data.header)}</span>
         <span style="color:${COLORS.gold}">&#10049;</span>
       </p>`
    : '';

  const photo = photoTag(
    data,
    'height:150px;width:120px;object-fit:cover;display:block',
  );
  const photoBox = data.photo
    ? `<div style="flex:0 0 auto;border:2px solid ${COLORS.gold};padding:4px;border-radius:2px">${photo}</div>`
    : '';

  const body = sections
    .map(
      section => `
      <section style="margin-top:22px">
        <h2 style="font-family:Georgia,serif;display:flex;align-items:center;gap:12px;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:${COLORS.maroon};margin:0 0 12px">
          <span>${esc(section.title)}</span>
          <span style="height:1px;flex:1;background:${COLORS.gold};opacity:.6"></span>
        </h2>
        <div>
          ${section.rows
            .map(
              row => `
            <div style="display:flex;gap:12px;font-size:13.5px;line-height:1.6;margin-bottom:6px">
              <div style="width:38%;flex:0 0 auto;font-weight:600;color:${COLORS.ink};opacity:.8">${esc(row.label)}</div>
              <div style="flex:1;color:${COLORS.ink}"><span style="margin-right:8px;color:${COLORS.muted}">:</span>${esc(row.value)}</div>
            </div>`,
            )
            .join('')}
        </div>
      </section>`,
    )
    .join('');

  return `
    <div style="padding:10mm;height:100%">
      <div style="border:2px solid ${COLORS.maroon};padding:3mm;height:100%;box-sizing:border-box">
        <div style="border:1px solid ${COLORS.gold};padding:9mm 10mm;height:100%;box-sizing:border-box">
          ${header}
          <div style="margin-top:20px;display:flex;align-items:flex-start;justify-content:space-between;gap:24px">
            <div style="flex:1">
              <h1 style="font-family:Georgia,serif;font-size:34px;font-weight:700;line-height:1.15;color:${COLORS.maroon};margin:0">${esc(displayName(data))}</h1>
              <div style="margin-top:8px;height:2px;width:96px;background:${COLORS.gold}"></div>
            </div>
            ${photoBox}
          </div>
          ${body}
        </div>
      </div>
    </div>`;
}

// ── Elegant ──────────────────────────────────────────────────────────────────
function elegant(data: Biodata): string {
  const sections = renderedSections(data);
  const header = data.header
    ? `<p style="font-size:12px;text-transform:uppercase;letter-spacing:.35em;color:${COLORS.gold};margin:0">${esc(data.header)}</p>`
    : '';
  const photo = data.photo
    ? `<div style="margin:24px auto 0;height:130px;width:130px;overflow:hidden;border-radius:50%;border:3px solid ${COLORS.gold}">${photoTag(
        data,
        'height:100%;width:100%;object-fit:cover',
      )}</div>`
    : '';

  const body = sections
    .map(
      section => `
      <section style="margin-top:32px">
        <h2 style="font-family:Georgia,serif;text-align:center;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.3em;color:${COLORS.maroon};margin:0 0 16px">${esc(section.title)}</h2>
        <div style="max-width:150mm;margin:0 auto">
          ${section.rows
            .map(
              row => `
            <div style="display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid ${COLORS.line};padding-bottom:6px;margin-bottom:8px;font-size:13.5px">
              <span style="color:${COLORS.muted}">${esc(row.label)}</span>
              <span style="text-align:right;font-weight:500;color:${COLORS.ink}">${esc(row.value)}</span>
            </div>`,
            )
            .join('')}
        </div>
      </section>`,
    )
    .join('');

  return `
    <div style="padding:18mm 20mm">
      <div style="text-align:center">
        ${header}
        ${photo}
        <h1 style="font-family:Georgia,serif;margin:24px 0 0;font-size:36px;font-weight:600;letter-spacing:.5px;color:${COLORS.ink}">${esc(displayName(data))}</h1>
        <div style="margin:16px auto 0;display:flex;align-items:center;justify-content:center;gap:12px;color:${COLORS.gold}">
          <span style="height:1px;width:64px;background:${COLORS.gold};opacity:.5"></span>
          <span>&#10070;</span>
          <span style="height:1px;width:64px;background:${COLORS.gold};opacity:.5"></span>
        </div>
      </div>
      ${body}
    </div>`;
}

// ── Modern ───────────────────────────────────────────────────────────────────
function modern(data: Biodata): string {
  const sections = renderedSections(data);
  const sidebar = sections.filter(s => s.id === 'contact');
  const main = sections.filter(s => s.id !== 'contact');

  const photo = data.photo
    ? `<div style="margin:0 auto 28px;height:140px;width:140px;overflow:hidden;border-radius:50%;border:3px solid ${COLORS.gold}">${photoTag(
        data,
        'height:100%;width:100%;object-fit:cover',
      )}</div>`
    : '';

  const sideHtml = sidebar
    .map(
      section => `
      <section style="margin-bottom:32px">
        <h2 style="font-family:Georgia,serif;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:${COLORS.gold};margin:0 0 12px">${esc(section.title)}</h2>
        <div>
          ${section.rows
            .map(
              row => `
            <div style="font-size:12.5px;line-height:1.35;margin-bottom:10px">
              <div style="color:rgba(255,255,255,.6)">${esc(row.label)}</div>
              <div style="font-weight:500;color:#fff">${esc(row.value)}</div>
            </div>`,
            )
            .join('')}
        </div>
      </section>`,
    )
    .join('');

  const mainHtml = main
    .map(
      section => `
      <section style="margin-bottom:28px">
        <h2 style="font-family:Georgia,serif;font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:${COLORS.maroon};margin:0 0 12px">${esc(section.title)}</h2>
        <div>
          ${section.rows
            .map(
              row => `
            <div style="display:flex;gap:12px;font-size:13px;line-height:1.6;margin-bottom:6px">
              <div style="width:40%;flex:0 0 auto;font-weight:600;color:${COLORS.ink};opacity:.75">${esc(row.label)}</div>
              <div style="flex:1;color:${COLORS.ink}">${esc(row.value)}</div>
            </div>`,
            )
            .join('')}
        </div>
      </section>`,
    )
    .join('');

  const header = data.header
    ? `<p style="font-size:11px;text-transform:uppercase;letter-spacing:.3em;color:${COLORS.gold};margin:0">${esc(data.header)}</p>`
    : '';

  return `
    <div style="display:flex;min-height:297mm">
      <aside style="width:68mm;flex:0 0 auto;background:${COLORS.maroon};padding:14mm 10mm;color:#fff;box-sizing:border-box">
        ${photo}
        ${sideHtml}
      </aside>
      <div style="flex:1;padding:14mm 12mm;box-sizing:border-box">
        ${header}
        <h1 style="font-family:Georgia,serif;margin:8px 0 0;font-size:34px;font-weight:700;line-height:1.15;color:${COLORS.maroon}">${esc(displayName(data))}</h1>
        <div style="margin-top:8px;height:3px;width:80px;background:${COLORS.gold}"></div>
        <div style="margin-top:32px">${mainHtml}</div>
      </div>
    </div>`;
}

const RENDERERS: Record<string, (d: Biodata) => string> = {
  traditional,
  elegant,
  modern,
};

/**
 * Build a complete, self-contained A4 HTML document for the given template.
 * @param forPrint  when true, uses print page sizing for expo-print.
 */
export function buildHtml(
  data: Biodata,
  templateId: string,
  forPrint = false,
): string {
  const render = RENDERERS[templateId] ?? traditional;
  const pageCss = forPrint
    ? '@page { size: A4; margin: 0; } html,body { margin:0; padding:0; }'
    : 'html,body { margin:0; padding:0; }';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=794, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
  ${pageCss}
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { background:#fff; color:${COLORS.ink}; font-family: -apple-system, "Segoe UI", Roboto, sans-serif; }
  .page { width: 794px; min-height: 1123px; background:#fff; margin:0 auto; }
</style>
</head>
<body>
  <div class="page">${render(data)}</div>
</body>
</html>`;
}
